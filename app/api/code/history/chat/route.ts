import { createChat } from "@/lib/api/history";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { historyId, role, content } = body;
    const response = await createChat(historyId, role, content);

    return NextResponse.json(response);
  } catch (error) {
    console.log("[HISTORY_CHAT_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
