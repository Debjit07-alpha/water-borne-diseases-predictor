-- CreateEnum
CREATE TYPE "public"."IncidentStatus" AS ENUM ('PENDING', 'VERIFIED', 'INVESTIGATING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ASHA_WORKER', 'COMMUNITY_VOLUNTEER', 'CLINIC_STAFF', 'INCIDENT_REPORTER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."SeverityLevel" AS ENUM ('MILD', 'MODERATE', 'SEVERE');

-- CreateEnum
CREATE TYPE "public"."AlertStatus" AS ENUM ('DRAFT', 'SENT', 'DELIVERED', 'RESPONDED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ResponseType" AS ENUM ('NO_CASES', 'CASES_REPORTED', 'EMERGENCY', 'UNCLEAR');

-- CreateEnum
CREATE TYPE "public"."UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "public"."Incident" ADD COLUMN     "reportedBy" TEXT,
ADD COLUMN     "reporterName" TEXT,
ADD COLUMN     "reporterPhone" TEXT,
ADD COLUMN     "status" "public"."IncidentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "assignedArea" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "phoneNumber" TEXT,
    "address" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WaterQualityReport" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "coliformCFU" INTEGER,
    "turbidity" DOUBLE PRECISION,
    "dissolvedOxygen" DOUBLE PRECISION,
    "ph" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "notes" TEXT,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaterQualityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SymptomTrend" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "diarrheaCount" INTEGER NOT NULL DEFAULT 0,
    "vomitingCount" INTEGER NOT NULL DEFAULT 0,
    "dehydrationCount" INTEGER NOT NULL DEFAULT 0,
    "feverCount" INTEGER NOT NULL DEFAULT 0,
    "abdominalPainCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OutbreakPrediction" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "riskCategory" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutbreakPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsAlert" (
    "id" TEXT NOT NULL,
    "diseaseType" TEXT NOT NULL,
    "severity" "public"."SeverityLevel" NOT NULL,
    "affectedCount" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "actionRequired" TEXT NOT NULL,
    "customMessage" TEXT,
    "messageContent" TEXT NOT NULL,
    "recipients" TEXT[],
    "status" "public"."AlertStatus" NOT NULL DEFAULT 'SENT',
    "createdBy" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsResponse" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "casesReported" INTEGER,
    "responseType" "public"."ResponseType" NOT NULL,
    "symptoms" TEXT[],
    "urgencyLevel" "public"."UrgencyLevel",
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "parsedAt" TIMESTAMP(3),
    "confidence" DOUBLE PRECISION,
    "rawParsedData" JSONB,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "location" TEXT,
    "preferredLanguage" TEXT DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "diseaseAlerts" BOOLEAN NOT NULL DEFAULT true,
    "emergencyAlerts" BOOLEAN NOT NULL DEFAULT true,
    "surveyRequests" BOOLEAN NOT NULL DEFAULT true,
    "lastResponseAt" TIMESTAMP(3),
    "totalResponses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "diseaseType" TEXT NOT NULL,
    "severity" "public"."SeverityLevel" NOT NULL,
    "messageTemplate" TEXT NOT NULL,
    "actionRequired" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsAnalytics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalAlerts" INTEGER NOT NULL DEFAULT 0,
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "totalResponses" INTEGER NOT NULL DEFAULT 0,
    "emergencyCount" INTEGER NOT NULL DEFAULT 0,
    "caseCount" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DOUBLE PRECISION,
    "locationStats" JSONB,
    "diseaseStats" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ContactToContactGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContactToContactGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "public"."User"("isActive");

-- CreateIndex
CREATE INDEX "User_assignedArea_idx" ON "public"."User"("assignedArea");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "WaterQualityReport_collectedAt_idx" ON "public"."WaterQualityReport"("collectedAt");

-- CreateIndex
CREATE INDEX "SymptomTrend_date_idx" ON "public"."SymptomTrend"("date");

-- CreateIndex
CREATE INDEX "SymptomTrend_latitude_longitude_date_idx" ON "public"."SymptomTrend"("latitude", "longitude", "date");

-- CreateIndex
CREATE INDEX "OutbreakPrediction_generatedAt_idx" ON "public"."OutbreakPrediction"("generatedAt");

-- CreateIndex
CREATE INDEX "OutbreakPrediction_targetDate_idx" ON "public"."OutbreakPrediction"("targetDate");

-- CreateIndex
CREATE INDEX "OutbreakPrediction_latitude_longitude_targetDate_idx" ON "public"."OutbreakPrediction"("latitude", "longitude", "targetDate");

-- CreateIndex
CREATE INDEX "OutbreakPrediction_riskCategory_idx" ON "public"."OutbreakPrediction"("riskCategory");

-- CreateIndex
CREATE INDEX "SmsAlert_sentAt_idx" ON "public"."SmsAlert"("sentAt");

-- CreateIndex
CREATE INDEX "SmsAlert_status_idx" ON "public"."SmsAlert"("status");

-- CreateIndex
CREATE INDEX "SmsAlert_diseaseType_idx" ON "public"."SmsAlert"("diseaseType");

-- CreateIndex
CREATE INDEX "SmsAlert_severity_idx" ON "public"."SmsAlert"("severity");

-- CreateIndex
CREATE INDEX "SmsAlert_location_idx" ON "public"."SmsAlert"("location");

-- CreateIndex
CREATE INDEX "SmsAlert_createdBy_idx" ON "public"."SmsAlert"("createdBy");

-- CreateIndex
CREATE INDEX "SmsResponse_alertId_idx" ON "public"."SmsResponse"("alertId");

-- CreateIndex
CREATE INDEX "SmsResponse_receivedAt_idx" ON "public"."SmsResponse"("receivedAt");

-- CreateIndex
CREATE INDEX "SmsResponse_responseType_idx" ON "public"."SmsResponse"("responseType");

-- CreateIndex
CREATE INDEX "SmsResponse_isEmergency_idx" ON "public"."SmsResponse"("isEmergency");

-- CreateIndex
CREATE INDEX "SmsResponse_phone_idx" ON "public"."SmsResponse"("phone");

-- CreateIndex
CREATE INDEX "ContactGroup_isActive_idx" ON "public"."ContactGroup"("isActive");

-- CreateIndex
CREATE INDEX "ContactGroup_location_idx" ON "public"."ContactGroup"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_key" ON "public"."Contact"("phone");

-- CreateIndex
CREATE INDEX "Contact_phone_idx" ON "public"."Contact"("phone");

-- CreateIndex
CREATE INDEX "Contact_isActive_idx" ON "public"."Contact"("isActive");

-- CreateIndex
CREATE INDEX "Contact_location_idx" ON "public"."Contact"("location");

-- CreateIndex
CREATE INDEX "Contact_lastResponseAt_idx" ON "public"."Contact"("lastResponseAt");

-- CreateIndex
CREATE INDEX "SmsTemplate_diseaseType_idx" ON "public"."SmsTemplate"("diseaseType");

-- CreateIndex
CREATE INDEX "SmsTemplate_severity_idx" ON "public"."SmsTemplate"("severity");

-- CreateIndex
CREATE INDEX "SmsTemplate_isActive_idx" ON "public"."SmsTemplate"("isActive");

-- CreateIndex
CREATE INDEX "SmsAnalytics_date_idx" ON "public"."SmsAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SmsAnalytics_date_key" ON "public"."SmsAnalytics"("date");

-- CreateIndex
CREATE INDEX "_ContactToContactGroup_B_index" ON "public"."_ContactToContactGroup"("B");

-- CreateIndex
CREATE INDEX "Incident_reportedBy_idx" ON "public"."Incident"("reportedBy");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "public"."Incident"("status");

-- CreateIndex
CREATE INDEX "Incident_createdAt_idx" ON "public"."Incident"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsAlert" ADD CONSTRAINT "SmsAlert_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsResponse" ADD CONSTRAINT "SmsResponse_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "public"."SmsAlert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContactToContactGroup" ADD CONSTRAINT "_ContactToContactGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContactToContactGroup" ADD CONSTRAINT "_ContactToContactGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ContactGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
