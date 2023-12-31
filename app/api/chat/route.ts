import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";


const openai = new OpenAI();

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });


    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CHAT_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
