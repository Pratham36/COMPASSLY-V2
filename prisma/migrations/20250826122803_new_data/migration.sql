/*
  Warnings:

  - You are about to drop the column `careerPath` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the column `forecast` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the column `jobOpenings` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the column `jobOpeningsChange` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the column `topRegions` on the `IndustryInsight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."IndustryInsight" DROP COLUMN "careerPath",
DROP COLUMN "certifications",
DROP COLUMN "forecast",
DROP COLUMN "jobOpenings",
DROP COLUMN "jobOpeningsChange",
DROP COLUMN "topRegions";
