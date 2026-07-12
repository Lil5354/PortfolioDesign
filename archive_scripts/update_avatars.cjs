const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
];

async function main() {
  const users = await prisma.user.findMany();
  for (let i = 0; i < users.length; i++) {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    // Update all users to have an avatar so they render correctly
    await prisma.user.update({
      where: { id: users[i].id },
      data: { avatarUrl: users[i].avatarUrl || randomAvatar }
    });
  }
  console.log("Avatars updated successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
