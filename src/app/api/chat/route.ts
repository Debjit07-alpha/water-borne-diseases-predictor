import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key_here') {
      console.error("Google AI API key is missing or not configured");
      return NextResponse.json(
        { 
          error: "AI service is not configured. Please set up the GOOGLE_AI_API_KEY environment variable.",
          details: "Contact the administrator to configure the Google AI API key." 
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;

    // Validate input
    if (!message && !image) {
      return NextResponse.json(
        { error: "Message or image is required" },
        { status: 400 }
      );
    }

    // Fetch disease symptoms from database
    let diseaseData = "";
    try {
      const diseases = await prisma.disease.findMany({
        select: {
          name: true,
          symptoms: true,
        }
      });
      
      diseaseData = diseases.map(disease => 
        `${disease.name}: ${Array.isArray(disease.symptoms) ? disease.symptoms.join(', ') : disease.symptoms}`
      ).join('\n');
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fallback disease data
      diseaseData = `Cholera: Severe watery diarrhea, vomiting, dehydration, muscle cramps
Typhoid: High fever, headache, weakness, stomach pain, rose-colored rash
Hepatitis A: Jaundice, fatigue, nausea, abdominal pain, dark urine
Dysentery: Bloody diarrhea, fever, stomach cramps, nausea
Giardiasis: Diarrhea, gas, stomach cramps, nausea, dehydration
Leptospirosis: High fever, headache, chills, muscle aches, vomiting, jaundice
Salmonellosis: Diarrhea, fever, stomach cramps, nausea, vomiting
Diarrhea: Loose stools, dehydration, stomach pain`;
    }

    // Choose model based on whether we have an image
    const modelName = image ? "gemini-1.5-flash" : "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    let prompt = `You are River Pulse, a direct medical assistant for identifying water-borne diseases. Be concise and helpful.

DISEASE DATABASE:
${diseaseData}

RESPONSE RULES:
1. If symptoms clearly match a disease - state the disease name directly
2. If symptoms are too vague (like only "fever" or "headache") - ask 1-2 specific questions
3. Do NOT list multiple diseases unless symptoms strongly suggest multiple possibilities
4. Keep responses short and focused
5. Always recommend medical consultation for serious symptoms

RESPONSE FORMAT:
- For clear match: "Based on your symptoms (list symptoms), this appears to be [DISEASE NAME]. [Brief explanation]. Please consult a doctor for proper diagnosis and treatment."
- For unclear symptoms: "I need more information. [Ask 1-2 specific questions about symptoms]"

${message ? `User symptoms: ${message}` : ''}`;

    let parts: any[] = [{ text: prompt }];

    // If image is provided, convert it to base64 and add to parts
    if (image) {
      try {
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

IMAGE ANALYSIS:
Analyze the image for visible symptoms. Match clear symptoms to diseases from the database above.

RESPONSE APPROACH:
- Clear symptoms visible: State the most likely disease directly
- Unclear symptoms: Ask for text description of what you're experiencing
- Be direct and concise

Focus only on disease identification. Do not provide treatment advice.`;

        prompt += imageAnalysisPrompt;
        parts[0].text = prompt;
      } catch (imageError) {
        console.error("Image processing error:", imageError);
        return NextResponse.json(
          { error: "Failed to process image" },
          { status: 400 }
        );
      }
    }

    try {
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
        } catch (streamError) {
          console.error("Streaming error:", streamError);
          
          // Handle specific API errors
          let errorMessage = "AI service temporarily unavailable. Please try again.";
          if (streamError instanceof Error) {
            if (streamError.message.includes('API_KEY_INVALID')) {
              errorMessage = "AI service configuration issue. Please contact support.";
            } else if (streamError.message.includes('QUOTA_EXCEEDED')) {
              errorMessage = "AI service quota exceeded. Please try again later.";
            } else if (streamError.message.includes('MODEL_NOT_FOUND')) {
              errorMessage = "AI model not available. Please try again.";
            }
          }
          
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ 
            error: errorMessage 
          })}\n\n`));
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
    } catch (modelError) {
      console.error("Model generation error:", modelError);
      
      // Handle specific model errors
      let errorMessage = "AI service is temporarily unavailable. Please try again.";
      let statusCode = 503;
      
      if (modelError instanceof Error) {
        if (modelError.message.includes('API_KEY_INVALID') || modelError.message.includes('API key not valid')) {
          errorMessage = "AI service configuration issue. Please contact support.";
          statusCode = 500;
        } else if (modelError.message.includes('QUOTA_EXCEEDED') || modelError.message.includes('quota')) {
          errorMessage = "AI service quota exceeded. Please try again later.";
          statusCode = 429;
        } else if (modelError.message.includes('MODEL_NOT_FOUND')) {
          errorMessage = "AI model not available. Please try again.";
          statusCode = 503;
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }  } catch (error) {
    console.error("Chat API error:", error);
    
    // Provide more specific error messages based on error type
    let errorMessage = "I'm experiencing technical difficulties. Please try again.";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        errorMessage = "AI service configuration issue. Please contact support.";
        statusCode = 500;
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = "AI service is temporarily busy. Please try again in a moment.";
        statusCode = 429;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network connection issue. Please check your internet and try again.";
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
