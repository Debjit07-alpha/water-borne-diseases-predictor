import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
