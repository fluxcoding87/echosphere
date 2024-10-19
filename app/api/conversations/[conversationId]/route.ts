import getCurrentUser from "@/actions/get-current-user";
import db from "@/libs/db";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("INVALID_ID", { status: 400 });
    }
    const deletedConversation = await db.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });
    return NextResponse.json(deletedConversation);
  } catch (e) {
    console.log("ERROR_CONVERSATION_DELETE", e);

    return new NextResponse(`Internal Error`, {
      status: 500,
    });
  }
}
