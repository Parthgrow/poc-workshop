import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


const GOOGLE_API_KEY=AIzaSyBXVnFEvZsyjPqVSoxW60KCswl74KULGyM ;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const systemPrompt = `
You are an expert web designer. 
Generate a complete responsive landing page using only valid HTML and Tailwind CSS classes. 
Do not use React, JSX, or TypeScript. 
The output must be a single self-contained HTML document (no external CSS/JS).
Include the Tailwind CDN in the head section.
Make sure the page is beautiful and modern looking.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: prompt }
  ]);

  const response = await result.response;
  return NextResponse.json({ html: response.text() });
}