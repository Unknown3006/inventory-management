import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

// The userId for pushkar@gmail.com — all seed data will be assigned to this user
const PUSHKAR_USER_ID = "d4b1a41a-96e0-47b8-a764-5a67c4e57b98";

// Tables that have a userId field for data isolation
const TABLES_WITH_USER_ID = [
  "products",
  "sales",
  "salesSummary",
  "purchases",
  "purchaseSummary",
  "expenses",
  "expenseSummary",
  "expenseByCategory",
];

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    return path.basename(fileName, path.extname(fileName));
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "products.json",
    "expenseSummary.json",
    "sales.json",
    "salesSummary.json",
    "purchases.json",
    "purchaseSummary.json",
    "users.json",
    "expenses.json",
    "expenseByCategory.json",
  ];

  // For deletion, we need to respect foreign key constraints.
  // Delete dependents first, then parents (Products, ExpenseSummary).
  const deleteOrderNames = [
    "sales.json",
    "purchases.json",
    "expenseByCategory.json",
    "salesSummary.json",
    "purchaseSummary.json",
    "expenses.json",
    "users.json",
    "products.json",
    "expenseSummary.json",
  ];

  await deleteAllData(deleteOrderNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      // Inject userId for pushkar@gmail.com into all data tables (not users table)
      const record = { ...data };
      if (TABLES_WITH_USER_ID.includes(modelName) && modelName !== "users") {
        record.userId = PUSHKAR_USER_ID;
      }

      await model.create({
        data: record,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName} ${TABLES_WITH_USER_ID.includes(modelName) ? `(userId: ${PUSHKAR_USER_ID})` : ""}`);
  }

  console.log("\n✅ All seed data assigned to pushkar@gmail.com user only.");
  console.log("   Other users will start with empty dashboards.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
