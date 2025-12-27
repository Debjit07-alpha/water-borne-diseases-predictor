import nodemailer from 'nodemailer';

// Gmail configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'biswasjaydeep51@gmail.com',
    pass: 'rlbm oykf bkbj kzap', // App password
  },
});

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, fullName: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: 'biswasjaydeep51@gmail.com',
      to: email,
      subject: 'River Pulse - Login OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🌊 RIVER PULSE</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Water-Borne Disease Prevention Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You are trying to log in to your River Pulse account. Please use the following OTP to complete your login:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 40px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                ${otp}
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; color: #495057; font-size: 14px;">
                <strong>⚠️ Security Note:</strong><br>
                • This OTP is valid for 10 minutes only<br>
                • Do not share this code with anyone<br>
                • River Pulse will never ask for your OTP via phone or other means
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 0;">
              If you didn't request this login, please ignore this email or contact our support team.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>🇮🇳 A Digital India Initiative - Building a Healthier Tomorrow</p>
              <p>River Pulse © 2025 | Water-Borne Disease Prevention Platform</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
};

// Verify transporter connection
export const verifyEmailService = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service verification failed:', error);
    return false;
  }
};

// Send Password Reset email
export const sendPasswordResetEmail = async (email: string, resetToken: string, fullName: string): Promise<boolean> => {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth?reset=${resetToken}`;
    
    const mailOptions = {
      from: 'biswasjaydeep51@gmail.com',
      to: email,
      subject: 'River Pulse - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🌊 RIVER PULSE</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Water-Borne Disease Prevention Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password for your River Pulse account. Click the button below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 20px;">
              Or copy and paste this link into your browser:<br>
              <span style="color: #667eea; word-break: break-all;">${resetLink}</span>
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; color: #495057; font-size: 14px;">
                <strong>⚠️ Security Note:</strong><br>
                • This link is valid for 1 hour only<br>
                • If you didn't request this reset, please ignore this email<br>
                • Your password will remain unchanged until you create a new one
              </p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>🇮🇳 A Digital India Initiative - Building a Healthier Tomorrow</p>
              <p>River Pulse © 2025 | Water-Borne Disease Prevention Platform</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
};