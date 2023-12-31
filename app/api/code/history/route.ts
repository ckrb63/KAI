import { createHistory } from "@/lib/api/history";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const response = await createHistory();
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.log("[HISTORY_ERROR", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
