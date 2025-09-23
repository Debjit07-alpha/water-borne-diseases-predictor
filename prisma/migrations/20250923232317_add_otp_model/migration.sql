-- CreateTable
CREATE TABLE "public"."OtpCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtpCode_userId_idx" ON "public"."OtpCode"("userId");

-- CreateIndex
CREATE INDEX "OtpCode_email_idx" ON "public"."OtpCode"("email");

-- CreateIndex
CREATE INDEX "OtpCode_code_idx" ON "public"."OtpCode"("code");

-- CreateIndex
CREATE INDEX "OtpCode_expiresAt_idx" ON "public"."OtpCode"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
