import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "sv@uef.edu.vn";
  const password = "test123";

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: hashedPassword,
      fullName: "Nguyễn Minh Anh",
      studentId: "21DGR00042",
      role: "student",
      isActive: true,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sv",
      bio: "Thiết kế đồ họa sinh viên UEF",
    },
  });

  console.log("User created:", user.email);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });