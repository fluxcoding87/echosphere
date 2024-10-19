import getCurrentUser from "@/actions/get-current-user";
import db from "@/libs/db";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Find the existing conversation
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    //Find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update seen of last message

    const updatedMessage = await db.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }
    await pusherServer.trigger(
      conversationId!,
      "message:updated",
      updatedMessage
    );
    return NextResponse.json(updatedMessage);
  } catch (e) {
    console.log(e, "ERROR_MESSAGES_SEEN");
    return new NextResponse("internal error", { status: 500 });
  }
}
