import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData(deleteOrder: string[]) {
  for (const modelName of deleteOrder) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(`Model ${modelName} not found.`);
    }
  }
}

async function seedData(insertOrder: string[], dataDirectory: string) {
  for (const fileName of insertOrder) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({ data });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  // Order for deleting → children first
  const deleteOrder = [
    "sales",
    "salesSummary",
    "purchases",
    "purchaseSummary",
    "expenses",
    "expenseByCategory",
    "expenseSummary",
    "products",
    "users"
  ];

  // Order for inserting → parents first
  const insertOrder = [
    "users.json",
    "products.json",
    "purchases.json",
    "purchaseSummary.json",
    "sales.json",
    "salesSummary.json",
    "expenses.json",
    "expenseSummary.json",
    "expenseByCategory.json"
  ];

  await deleteAllData(deleteOrder);
  await seedData(insertOrder, dataDirectory);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
