/*
  Warnings:

  - Added the required column `jobOpenings` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobOpeningsChange` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."IndustryInsight" ADD COLUMN     "careerPath" JSONB[],
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "forecast" JSONB[],
ADD COLUMN     "jobOpenings" INTEGER NOT NULL,
ADD COLUMN     "jobOpeningsChange" INTEGER NOT NULL,
ADD COLUMN     "topRegions" JSONB[];
