import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


    // Generate AI marketing content
    const marketingPrompt = `
You are an expert marketing copywriter specializing in workshop landing pages.
Based on the user's workshop description, generate compelling marketing copy.

User Description: ${prompt}

Generate:
1. A compelling headline (max 60 characters)
2. A persuasive subheadline (max 120 characters) 
3. A strong call-to-action button text (max 30 characters)
4. A theme/style description for the landing page (e.g., "modern professional", "creative vibrant", "minimalist clean")

IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting, code blocks, or additional text. Just the JSON object.

{
  "headline": "Your headline here",
  "subheadline": "Your subheadline here", 
  "cta": "Your CTA text here",
  "theme": "Your theme description here"
}
`;

    const marketingResult = await model.generateContent(marketingPrompt);
    const marketingResponse = await marketingResult.response;
    
    let aiGeneratedCopy;
    try {
      let responseText = marketingResponse.text();
      console.log("Raw AI response:", responseText);
      
      // Clean the response by removing markdown code blocks if present
      responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Try to find JSON object in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }
      
      console.log("Cleaned response text:", responseText);
      aiGeneratedCopy = JSON.parse(responseText);
      console.log("base features : the value of ai generated copy", aiGeneratedCopy);
    } catch (error) {
      // Fallback if AI doesn't return valid JSON
      console.log("base features : Error : couldn't create the ai generated copy ", error);
      console.log("Response that failed to parse:", marketingResponse.text());
      
      aiGeneratedCopy = {
        headline: "Transform Your Business with AI",
        subheadline: prompt.substring(0, 120),
        cta: "Register Now",
        theme: "modern professional"
      };
    }

    // Generate a short random ID for the workshop
    const workshopId = nanoid(); // 8 characters long
    
    // Prepare workshop data to store
    const workshopData = {
      id: workshopId,
      prompt: prompt,
      aiGeneratedCopy: aiGeneratedCopy,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    try {
      // Store the workshop data in KV
      await kv.set(`workshop:${workshopId}`, workshopData);
      console.log(`Workshop stored with ID: ${workshopId}`);
    } catch (kvError) {
      console.error("Error storing workshop in KV:", kvError);
      // Continue even if KV storage fails
    }

    return NextResponse.json({
      success: true,
      workshopId: workshopId,
      aiGeneratedCopy,
      workshopData
    }); 

  } catch (error) {
    console.error("Error generating workshop content:", error);
    return NextResponse.json(
      { error: "Failed to generate workshop content" },
      { status: 500 }
    );
  }
}
