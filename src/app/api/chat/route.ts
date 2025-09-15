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

    let prompt = `You are an expert AI health assistant specializing in water-borne diseases and public health for North-East India. 
    
Your expertise covers:
🔬 **Disease Analysis**: Cholera, typhoid, diarrhea, hepatitis A, dysentery, giardiasis, leptospirosis, salmonella
💧 **Water Quality Assessment**: Visual contamination signs, water sources, treatment methods
🩺 **Symptom Recognition**: Visual signs of dehydration, skin conditions, eye conditions related to water-borne diseases
🏥 **Health Recommendations**: Prevention strategies, when to seek medical help, emergency signs
📍 **Regional Context**: Specific risks and conditions in North-East India

${message ? `User message: ${message}` : ''}`;

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

      // Enhanced prompt for comprehensive image analysis
      const imageAnalysisPrompt = `

🖼️ **IMAGE ANALYSIS REQUEST**
Please provide a detailed analysis of the uploaded image. Focus on:

**If it's a water-related image:**
- Water clarity, color, and visible contamination
- Potential sources of contamination
- Risk assessment for water-borne diseases
- Recommended treatment or safety measures

**If it shows symptoms or health conditions:**
- Visible signs that might indicate water-borne diseases
- Severity assessment (mild/moderate/severe)
- Immediate care recommendations
- When to seek professional medical help

**If it's environmental/sanitation:**
- Hygiene risks and contamination sources
- Disease transmission potential
- Prevention recommendations

**General approach:**
- Describe what you observe objectively
- Explain health implications
- Provide actionable advice
- Include relevant warnings or disclaimers

⚠️ **Important**: Always remind users that this is not a substitute for professional medical diagnosis and they should consult healthcare providers for serious concerns.`;

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
