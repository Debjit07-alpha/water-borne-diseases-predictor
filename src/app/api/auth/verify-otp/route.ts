import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, otp } = await request.json();

    if (!userId || !email || !otp) {
      return NextResponse.json(
        { error: 'User ID, email, and OTP are required' },
        { status: 400 }
      );
    }

    // Find the OTP record
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId,
        email: email.toLowerCase(),
        code: otp,
        isUsed: false,
        expiresAt: {
          gt: new Date() // OTP should not be expired
        }
      },
      include: {
        user: true
      }
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true }
    });

    // Update user's last login
    await prisma.user.update({
      where: { id: otpRecord.userId },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: otpRecord.user.id,
        email: otpRecord.user.email,
        role: otpRecord.user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: otpRecord.user.id,
        username: otpRecord.user.username,
        email: otpRecord.user.email,
        fullName: otpRecord.user.fullName,
        role: otpRecord.user.role,
        isActive: otpRecord.user.isActive,
        lastLoginAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}