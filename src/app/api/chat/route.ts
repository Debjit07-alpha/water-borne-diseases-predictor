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

    let prompt = `You are a medical chatbot designed to identify potential diseases based on user-provided symptoms. Your approach should be careful and considerate to avoid causing unnecessary anxiety.

IMPORTANT GUIDELINES:
1. If the user provides only ONE general symptom (like "fever", "headache", "nausea" alone), DO NOT list multiple diseases
2. Instead, ask for MORE SPECIFIC information to narrow down possibilities
3. Only provide disease identification when you have SUFFICIENT specific symptoms
4. Be supportive and avoid creating anxiety with multiple disease possibilities for vague symptoms

RESPONSE STRATEGY:
- For insufficient/vague symptoms: Ask clarifying questions like:
  * "Can you describe any additional symptoms you're experiencing?"
  * "How long have you had this symptom?"
  * "Can you provide more details about [specific symptom]?"
  * "Are there any other symptoms accompanying the [mentioned symptom]?"

- For sufficient specific symptoms: Provide the most likely disease match from your knowledge base

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

EXAMPLES OF APPROPRIATE RESPONSES:
- For "I have fever": Ask for more symptoms rather than listing diseases
- For "High fever, headache, and stomach pain": Can suggest potential matches like Typhoid
- For "Severe watery diarrhea and vomiting": Can suggest Cholera

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
Analyze the uploaded image carefully and responsibly. Follow these guidelines:

1. Look for CLEAR, SPECIFIC visible symptoms in the image
2. If you can identify multiple specific symptoms, match them to diseases from your knowledge base
3. If the image shows only general or unclear symptoms, ask for more information instead of listing multiple diseases
4. Be conservative in your assessment to avoid unnecessary anxiety

RESPONSE APPROACH:
- For clear, specific symptoms visible in image: Provide the most likely disease match
- For unclear or general symptoms: Ask for additional information or text description of symptoms
- Always be supportive and avoid causing anxiety with multiple disease possibilities

Focus only on disease identification based on observable symptoms. Do not provide treatment advice or general health information.`;

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
