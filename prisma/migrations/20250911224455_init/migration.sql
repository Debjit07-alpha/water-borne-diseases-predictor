-- CreateTable
CREATE TABLE "public"."Incident" (
    "id" TEXT NOT NULL,
    "disease" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Disease" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "symptoms" TEXT[],
    "causes" TEXT NOT NULL,
    "prevention" TEXT[],
    "treatment" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disease_name_key" ON "public"."Disease"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_slug_key" ON "public"."Disease"("slug");
