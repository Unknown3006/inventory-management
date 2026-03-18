import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PUSHKAR_USER_ID = "d4b1a41a-96e0-47b8-a764-5a67c4e57b98";

async function main() {
  console.log("Starting backfill for user data isolation...");

  const updateData = { userId: PUSHKAR_USER_ID };

  // Update Products
  const products = await prisma.products.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${products.count} Products`);

  // Update Sales
  const sales = await prisma.sales.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${sales.count} Sales`);

  // Update Purchases
  const purchases = await prisma.purchases.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${purchases.count} Purchases`);

  // Update Expenses
  const expenses = await prisma.expenses.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${expenses.count} Expenses`);

  // Update SalesSummary
  const salesSum = await prisma.salesSummary.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${salesSum.count} SalesSummary`);

  // Update PurchaseSummary
  const purchaseSum = await prisma.purchaseSummary.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${purchaseSum.count} PurchaseSummary`);

  // Update ExpenseSummary
  const expenseSum = await prisma.expenseSummary.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${expenseSum.count} ExpenseSummary`);

  // Update ExpenseByCategory
  const expenseByCat = await prisma.expenseByCategory.updateMany({
    where: {},
    data: updateData,
  });
  console.log(`Updated ${expenseByCat.count} ExpenseByCategory`);

  console.log("Backfill unconditionally completed.");

}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
