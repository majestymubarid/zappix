import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const plans = [
    {
      id: 'creator',
      name: 'creator',
      monthlyPrice: 1500000,    // ₦15,000 in kobo
      yearlyPrice: 15000000,
      founderMonthlyPrice: 1200000,
      founderYearlyPrice: 12000000,
      maxNumbers: 2,
      maxContacts: 10000,
      maxBroadcastsMonth: 20,
      maxStatusMonth: 60,
      maxTeamMembers: 1,
      maxAdSlots: 3,
      storageGb: 5,
      hasAdvancedBot: false,
      hasApiAccess: false,
      hasFullAnalytics: false,
      hasCsvExport: false,
      hasPdfExport: false,
      paystackPlanCode: 'PLN_creator_monthly',
      paystackYearlyCode: 'PLN_creator_yearly',
    },
    {
      id: 'growth',
      name: 'growth',
      monthlyPrice: 3500000,
      yearlyPrice: 35000000,
      founderMonthlyPrice: 2900000,
      founderYearlyPrice: 29000000,
      maxNumbers: 10,
      maxContacts: 100000,
      maxBroadcastsMonth: 200,
      maxStatusMonth: 500,
      maxTeamMembers: 5,
      maxAdSlots: 20,
      storageGb: 20,
      hasAdvancedBot: true,
      hasApiAccess: false,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: false,
      paystackPlanCode: 'PLN_growth_monthly',
      paystackYearlyCode: 'PLN_growth_yearly',
    },
    {
      id: 'agency',
      name: 'agency',
      monthlyPrice: 7500000,
      yearlyPrice: 75000000,
      founderMonthlyPrice: 6500000,
      founderYearlyPrice: 65000000,
      maxNumbers: null,
      maxContacts: null,
      maxBroadcastsMonth: null,
      maxStatusMonth: null,
      maxTeamMembers: null,
      maxAdSlots: null,
      storageGb: 100,
      hasAdvancedBot: true,
      hasApiAccess: true,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: true,
      paystackPlanCode: 'PLN_agency_monthly',
      paystackYearlyCode: 'PLN_agency_yearly',
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    })
  }
  console.log('✅ Plans seeded')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
