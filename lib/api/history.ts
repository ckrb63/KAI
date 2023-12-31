import { auth } from "@clerk/nextjs";

import prisma from "../prismadb";

export const createChat = async (
  historyId: string,
  role: string,
  content: string
) => {
  try {
    await prisma.chat.create({
      data: {
        historyId,
        role,
        content,
      },
    });
    return true;
  } catch {
    return false;
  }
};

export const createHistory = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userChatHistory = await prisma.chatHistory.create({
    data: { userId },
  });

  return userChatHistory.id;
};
