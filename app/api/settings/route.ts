import getCurrentUser from "@/actions/get-current-user";
import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { name, image } = body;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatadUser = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
      },
    });
    return NextResponse.json(updatadUser);
  } catch (e) {
    console.log(e, "SETTING_POST");
    return new NextResponse("Internal error", { status: 500 });
  }
}
