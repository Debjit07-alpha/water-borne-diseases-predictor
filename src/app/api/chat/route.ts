import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;

    // Choose model based on whether we have an image
    const modelName = image ? "gemini-1.5-flash" : "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    let prompt = `You are a medical chatbot designed to identify potential diseases based on user-provided symptoms. Your knowledge base includes a list of pre-defined diseases and their associated symptoms. When a user describes symptoms, you will analyze the input, match it against your knowledge base, and clearly state the most probable disease(s) based solely on the symptoms provided. Do not provide medical advice, treatment recommendations, or any information beyond the possible disease diagnosis. Keep your responses concise and to the point, focusing only on the potential disease(s).

Your disease knowledge base includes:
- Cholera: Severe watery diarrhea, vomiting, dehydration, muscle cramps
- Typhoid: High fever, headache, weakness, stomach pain, rose-colored rash
- Hepatitis A: Jaundice, fatigue, nausea, abdominal pain, dark urine
- Dysentery: Bloody diarrhea, fever, stomach cramps, nausea
- Giardiasis: Diarrhea, gas, stomach cramps, nausea, dehydration
- Leptospirosis: High fever, headache, chills, muscle aches, vomiting, jaundice
- Salmonella: Diarrhea, fever, stomach cramps, nausea, vomiting
- Diarrheal diseases: Loose stools, dehydration, stomach pain
- Gastroenteritis: Vomiting, diarrhea, stomach pain, fever

${message ? `User symptoms: ${message}` : ''}`;

    let parts: any[] = [{ text: prompt }];

    // If image is provided, convert it to base64 and add to parts
    if (image) {
      const bytes = await image.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      
      parts.push({
        inlineData: {
          data: base64,
          mimeType: image.type
        }
      });

      // Enhanced prompt for symptom-focused image analysis
      const imageAnalysisPrompt = `

IMAGE ANALYSIS FOR DISEASE IDENTIFICATION:
Analyze the uploaded image for visible symptoms that may indicate specific diseases from your knowledge base. Focus only on:

1. Visible symptoms you can observe in the image
2. Match these symptoms to potential diseases from your knowledge base
3. State the most probable disease(s) based on visible evidence
4. Be concise and factual

Do not provide treatment advice, prevention tips, or general health information. Only identify potential diseases based on observable symptoms.`;

      prompt += imageAnalysisPrompt;
      parts[0].text = prompt;
    }

    const result = await model.generateContentStream(parts);

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        } catch (error) {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: "Error generating response" })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
