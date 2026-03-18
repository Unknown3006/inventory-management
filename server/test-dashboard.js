const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ID = "d4b1a41a-96e0-47b8-a764-5a67c4e57b98";

async function main() {
  const popularProducts = await prisma.products.findMany({ where: { userId: ID } });
  const salesSummary = await prisma.salesSummary.findMany({ where: { userId: ID } });
  const purchaseSummary = await prisma.purchaseSummary.findMany({ where: { userId: ID } });
  const expenseSummary = await prisma.expenseSummary.findMany({ where: { userId: ID } });
  const expenseByCategory = await prisma.expenseByCategory.findMany({ where: { userId: ID } });

  console.log("FULL_DASHBOARD_COUNTS_FOR_PUSHKAR:");
  console.log(`Products: ${popularProducts.length}`);
  console.log(`SalesSummary: ${salesSummary.length}`);
  console.log(`PurchaseSummary: ${purchaseSummary.length}`);
  console.log(`ExpenseSummary: ${expenseSummary.length}`);
  console.log(`ExpenseByCategory: ${expenseByCategory.length}`);
}

main().finally(() => prisma.$disconnect());
