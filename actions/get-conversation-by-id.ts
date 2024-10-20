import db from "@/libs/db";
import getCurrentUser from "./get-current-user";

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    return conversation;
  } catch {
    return null;
  }
};

export default getConversationById;
