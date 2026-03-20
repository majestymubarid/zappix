import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  // Verify webhook authenticity
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  switch (event.event) {
    case 'subscription.create':
      await handleSubscriptionCreate(event.data)
      break
    case 'charge.success':
      await handleChargeSuccess(event.data)
      break
    case 'subscription.disable':
      await handleSubscriptionDisable(event.data)
      break
    case 'transfer.success':
      await handleTransferSuccess(event.data)
      break
    case 'transfer.failed':
      await handleTransferFailed(event.data)
      break
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionCreate(data: any) {
  const userEmail = data.customer.email
  const planCode = data.plan.plan_code

  const plan = await prisma.plan.findFirst({
    where: {
      OR: [
        { paystackPlanCode: planCode },
        { paystackYearlyCode: planCode },
      ],
    },
  })

  if (plan) {
    await prisma.user.update({
      where: { email: userEmail },
      data: { planId: plan.id },
    })

    // Credit referral commission if applicable
    await creditReferralCommission(userEmail, plan)
  }
}

async function handleChargeSuccess(data: any) {
  // Handle recurring charge — trigger new commission for referrer
  const userEmail = data.customer.email
  const planCode = data.plan?.plan_code

  if (planCode) {
    const plan = await prisma.plan.findFirst({
      where: {
        OR: [
          { paystackPlanCode: planCode },
          { paystackYearlyCode: planCode },
        ],
      },
    })

    if (plan) {
      await creditReferralCommission(userEmail, plan)
    }
  }
}

async function handleSubscriptionDisable(data: any) {
  const userEmail = data.customer.email
  await prisma.user.update({
    where: { email: userEmail },
    data: { planId: null },
  })
}

async function handleTransferSuccess(data: any) {
  await prisma.withdrawal.updateMany({
    where: { paystackTransferId: data.transfer_code },
    data: { status: 'completed', completedAt: new Date() },
  })
}

async function handleTransferFailed(data: any) {
  await prisma.withdrawal.updateMany({
    where: { paystackTransferId: data.transfer_code },
    data: { status: 'failed' },
  })
}

async function creditReferralCommission(userEmail: string, plan: any) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } })
  if (!user) return

  const referral = await prisma.referral.findUnique({
    where: { referredUserId: user.id },
  })
  if (!referral || referral.status !== 'active') return

  const commission = Math.floor(plan.monthlyPrice * 0.25)
  const month = new Date().toISOString().slice(0, 7) // "2026-03"

  await prisma.commission.create({
    data: {
      referralId: referral.id,
      referrerId: referral.referrerId,
      amount: commission,
      status: 'pending',
      billingCycleMonth: month,
    },
  })
}
