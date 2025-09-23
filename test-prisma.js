const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Check if otpCode is available
console.log('Available Prisma models:', Object.keys(prisma));
console.log('Has otpCode?', 'otpCode' in prisma);

// Try to access otpCode
try {
  console.log('OtpCode model:', typeof prisma.otpCode);
} catch (error) {
  console.error('Error accessing otpCode:', error.message);
}