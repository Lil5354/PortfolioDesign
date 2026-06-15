const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`CREATE CAST (text AS "Role") WITH INOUT AS IMPLICIT;`);
    console.log("Casted Role");
  } catch (e) { console.log(e.message); }

  try {
    await prisma.$executeRawUnsafe(`CREATE CAST (text AS "NotificationType") WITH INOUT AS IMPLICIT;`);
    console.log("Casted NotificationType");
  } catch (e) { console.log(e.message); }

  try {
    await prisma.$executeRawUnsafe(`CREATE CAST (text AS "ReportStatus") WITH INOUT AS IMPLICIT;`);
    console.log("Casted ReportStatus");
  } catch (e) { console.log(e.message); }

  try {
    await prisma.$executeRawUnsafe(`CREATE CAST (text AS "DisplayOrder") WITH INOUT AS IMPLICIT;`);
    console.log("Casted DisplayOrder");
  } catch (e) { console.log(e.message); }
  
  try {
    await prisma.$executeRawUnsafe(`CREATE CAST (text AS "ReactionType") WITH INOUT AS IMPLICIT;`);
    console.log("Casted ReactionType");
  } catch (e) { console.log(e.message); }
}

main().finally(() => prisma.$disconnect());
