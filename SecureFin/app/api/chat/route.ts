import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, prompt } = await req.json();
        const input = message || prompt; // Handle both formats

        if (!input) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(input);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("AI Error Full:", JSON.stringify(error, null, 2));
        return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }
}
