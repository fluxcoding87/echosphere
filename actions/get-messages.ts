import db from "@/libs/db";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch {
    return [];
  }
};

export default getMessages;
