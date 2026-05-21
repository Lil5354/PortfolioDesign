import { prisma } from './prisma';
import { NotificationType } from '@prisma/client';

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  referenceId?: string;
  referenceType?: string;
  content: string;
  actorId?: string;
  actorName?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      referenceId: input.referenceId || null,
      referenceType: input.referenceType || null,
      content: input.content.slice(0, 500),
      actorId: input.actorId || null,
      actorName: input.actorName || null,
    },
  });
}

export async function notifyAdminsAndLecturers(input: Omit<CreateNotificationInput, 'userId'>) {
  const users = await prisma.user.findMany({
    where: { role: { in: ['lecturer', 'admin'] }, isActive: true },
    select: { id: true },
  });
  for (const u of users) {
    await createNotification({ ...input, userId: u.id });
  }
}
