const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ID = "d4b1a41a-96e0-47b8-a764-5a67c4e57b98";

async function main() {
  const pCount = await prisma.products.count({ where: { userId: ID } });
  const sCount = await prisma.salesSummary.count({ where: { userId: ID } });
  const eCount = await prisma.expenseSummary.count({ where: { userId: ID } });
  console.log(`Pushkar holds ${pCount} Products, ${sCount} SalesSummaries, ${eCount} ExpenseSummaries`);
}

main().finally(() => prisma.$disconnect());
