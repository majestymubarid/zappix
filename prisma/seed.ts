import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create pricing plans
  const plans = [
    {
      name: 'creator',
      monthlyPrice: 1500000, // ₦15,000 in kobo
      yearlyPrice: 15000000, // ₦150,000 in kobo
      founderMonthlyPrice: 1200000, // ₦12,000 in kobo
      founderYearlyPrice: 12000000, // ₦120,000 in kobo
      maxNumbers: 2,
      maxContacts: 10000,
      maxBroadcastsMonth: 20,
      maxStatusMonth: 60,
      maxTeamMembers: 1,
      maxAdSlots: 2,
      storageGb: 5,
      hasAdvancedBot: false,
      hasApiAccess: false,
      hasFullAnalytics: false,
      hasCsvExport: false,
      hasPdfExport: false,
    },
    {
      name: 'growth',
      monthlyPrice: 3500000, // ₦35,000 in kobo
      yearlyPrice: 35000000, // ₦350,000 in kobo
      founderMonthlyPrice: 2900000, // ₦29,000 in kobo
      founderYearlyPrice: 29000000, // ₦290,000 in kobo
      maxNumbers: 10,
      maxContacts: 100000,
      maxBroadcastsMonth: 200,
      maxStatusMonth: 500,
      maxTeamMembers: 5,
      maxAdSlots: 10,
      storageGb: 20,
      hasAdvancedBot: true,
      hasApiAccess: false,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: false,
    },
    {
      name: 'agency',
      monthlyPrice: 7500000, // ₦75,000 in kobo
      yearlyPrice: 75000000, // ₦750,000 in kobo
      founderMonthlyPrice: 6500000, // ₦65,000 in kobo
      founderYearlyPrice: 65000000, // ₦650,000 in kobo
      maxNumbers: null, // unlimited
      maxContacts: null, // unlimited
      maxBroadcastsMonth: null, // unlimited
      maxStatusMonth: null, // unlimited
      maxTeamMembers: null, // unlimited
      maxAdSlots: null, // unlimited
      storageGb: 100,
      hasAdvancedBot: true,
      hasApiAccess: true,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: true,
    },
  ]

  for (const planData of plans) {
    const plan = await prisma.plan.upsert({
      where: { name: planData.name },
      update: planData,
      create: planData,
    })
    console.log(`✓ Created/Updated plan: ${plan.name}`)
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
