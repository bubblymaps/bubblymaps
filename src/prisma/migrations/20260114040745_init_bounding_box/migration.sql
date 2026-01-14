-- CreateTable
CREATE TABLE "BoundingBox" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#ff8c00',
    "coordinates" JSONB NOT NULL,
    "properties" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoundingBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoundingBox_active_idx" ON "BoundingBox"("active");
