import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import { generateOTP, sendOTPEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing unused OTPs for this user
    await prisma.otpCode.deleteMany({
      where: {
        userId: user.id,
        isUsed: false
      }
    });

    // Store OTP in database
    await prisma.otpCode.create({
      data: {
        userId: user.id,
        email: user.email,
        code: otpCode,
        expiresAt,
        isUsed: false
      }
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(user.email, otpCode, user.fullName);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email address. Please check your inbox.',
      userId: user.id,
      email: user.email
    });

  } catch (error) {
    console.error('OTP generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}