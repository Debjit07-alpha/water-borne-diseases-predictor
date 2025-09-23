import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock SMS service - replace with actual SMS provider (Twilio, AWS SNS, etc.)
async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    // For demo purposes, we'll simulate SMS sending
    // In production, integrate with actual SMS service like:
    // - Twilio: https://www.twilio.com/docs/sms/quickstart/node
    // - AWS SNS: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
    // - MSG91: https://msg91.com/
    
    console.log(`SMS sent to ${phone}: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate 95% success rate
    return Math.random() > 0.05;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}

// Parse incoming SMS responses (webhook handler)
async function parseIncomingSMS(phone: string, message: string, alertId: string) {
  try {
    const lowerMessage = message.toLowerCase().trim();
    
    // Basic response parsing
    let responseData: any = {
      phone,
      messageText: message,
      alertId,
      receivedAt: new Date(),
      parsedAt: new Date(),
      confidence: 0.8
    };

    // Parse common response patterns
    if (lowerMessage.includes('no case') || lowerMessage.includes('none') || lowerMessage.includes('0')) {
      responseData = {
        ...responseData,
        casesReported: 0,
        responseType: 'NO_CASES',
        urgencyLevel: 'LOW',
        isEmergency: false
      };
    } else if (lowerMessage.includes('case') || /\d+/.test(lowerMessage)) {
      // Extract numbers from response
      const numbers = lowerMessage.match(/\d+/g);
      const caseCount = numbers ? parseInt(numbers[0]) : 1;
      
      responseData = {
        ...responseData,
        casesReported: caseCount,
        responseType: 'CASES_REPORTED',
        urgencyLevel: caseCount > 3 ? 'HIGH' : 'MEDIUM',
        symptoms: extractSymptoms(lowerMessage),
        isEmergency: caseCount > 5
      };
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      responseData = {
        ...responseData,
        casesReported: 1,
        responseType: 'EMERGENCY',
        urgencyLevel: 'HIGH',
        isEmergency: true
      };
    } else {
      responseData = {
        ...responseData,
        responseType: 'UNCLEAR',
        urgencyLevel: 'LOW'
      };
    }

    // Store response in database
    const smsResponse = await prisma.smsResponse.create({
      data: {
        ...responseData,
        rawParsedData: responseData
      }
    });

    console.log('SMS response parsed and stored:', smsResponse);
    return smsResponse;
  } catch (error) {
    console.error('Error parsing SMS response:', error);
    return null;
  }
}

function extractSymptoms(message: string): string[] {
  const symptoms = ['fever', 'diarrhea', 'vomiting', 'dehydration', 'headache', 'fatigue'];
  const foundSymptoms: string[] = [];
  
  symptoms.forEach(symptom => {
    if (message.toLowerCase().includes(symptom)) {
      foundSymptoms.push(symptom);
    }
  });
  
  return foundSymptoms;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, recipients, alertData, action = 'send' } = body;

    if (action === 'webhook') {
      // Handle incoming SMS responses
      const { phone, incomingMessage, alertId } = body;
      const parsedResponse = await parseIncomingSMS(phone, incomingMessage, alertId);
      
      return NextResponse.json({
        success: true,
        data: parsedResponse
      });
    }

    // Validate required fields for sending SMS
    if (!message || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json(
        { error: 'Message and recipients array are required' },
        { status: 400 }
      );
    }

    // Send SMS to all recipients
    const sendResults = await Promise.allSettled(
      recipients.map(async (phone: string) => {
        const success = await sendSMS(phone, message);
        return { phone, success };
      })
    );

    // Process results
    const successfulSends = sendResults
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => (result as PromiseFulfilledResult<any>).value.phone);

    const failedSends = sendResults
      .filter(result => result.status === 'rejected' || !result.value.success)
      .map(result => 
        result.status === 'fulfilled' 
          ? result.value.phone 
          : 'unknown'
      );

    // Store alert in database if alertData provided
    if (alertData) {
      try {
        const smsAlert = await prisma.smsAlert.create({
          data: {
            diseaseType: alertData.diseaseType,
            severity: alertData.severity.toUpperCase() as any,
            affectedCount: alertData.affectedCount,
            location: alertData.location,
            actionRequired: alertData.actionRequired,
            messageContent: message,
            recipients: successfulSends,
            status: successfulSends.length > 0 ? 'SENT' : 'FAILED'
          }
        });
        console.log('Alert stored in database:', smsAlert);
      } catch (dbError) {
        console.error('Error storing alert in database:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRecipients: recipients.length,
        successfulSends: successfulSends.length,
        failedSends: failedSends.length,
        sentTo: successfulSends,
        failed: failedSends,
        alertId: alertData?.id
      }
    });

  } catch (error) {
    console.error('SMS API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('alertId');

    if (alertId) {
      // Get specific alert responses
      // const responses = await prisma.smsResponse.findMany({
      //   where: { alertId },
      //   orderBy: { timestamp: 'desc' }
      // });
      
      // Mock response for demo
      const mockResponses = [
        {
          id: '1',
          phone: '+1234567890',
          message: '2 cases of diarrhea in our household',
          timestamp: new Date(),
          parsedData: { cases: 2, status: 'cases_reported', symptoms: ['diarrhea'] }
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockResponses
      });
    }

    // Get all recent SMS alerts
    // const alerts = await prisma.smsAlert.findMany({
    //   take: 20,
    //   orderBy: { timestamp: 'desc' },
    //   include: {
    //     responses: true
    //   }
    // });

    // Mock data for demo
    const mockAlerts: any[] = [];

    return NextResponse.json({
      success: true,
      data: mockAlerts
    });

  } catch (error) {
    console.error('SMS API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Webhook endpoint for receiving SMS responses
export async function PUT(request: NextRequest) {
  try {
    // This would be called by your SMS provider when responses come in
    const body = await request.json();
    const { from, body: messageBody, alertId } = body;

    const parsedResponse = await parseIncomingSMS(from, messageBody, alertId);

    return NextResponse.json({
      success: true,
      data: parsedResponse
    });

  } catch (error) {
    console.error('SMS Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}