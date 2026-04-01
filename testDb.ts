import { prisma } from "./server/db";

async function main() {
  try {
    console.log("Connecting to DB...");
    const users = await prisma.user.findMany();
    console.log("Users fetched:", users.length);
  } catch (err) {
    console.error("DB error", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
