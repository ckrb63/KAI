import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI();

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explations. You must create three questions that the user might be curious about from this answer at last three line. Asnwer in Korean",
};

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
      messages: [instructionMessage, ...messages],
      model: "gpt-3.5-turbo",
    });

    // const questions = await openai.chat.completions.create({
    //   messages: [instructionMessage, ...messages],
    //   model: "gpt-3.5-turbo",
    // });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CHAT_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
