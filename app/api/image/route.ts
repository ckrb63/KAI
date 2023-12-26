import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;
    console.log(body);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("prompt are required", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("resolution are required", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("resolution are required", { status: 400 });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[IMAGE_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
