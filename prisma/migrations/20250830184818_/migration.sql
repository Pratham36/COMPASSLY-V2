/*
  Warnings:

  - You are about to drop the column `userId` on the `IndustryInsight` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[industry]` on the table `IndustryInsight` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."IndustryInsight" DROP CONSTRAINT "IndustryInsight_userId_fkey";

-- DropIndex
DROP INDEX "public"."IndustryInsight_userId_key";

-- AlterTable
ALTER TABLE "public"."IndustryInsight" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "industry" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IndustryInsight_industry_key" ON "public"."IndustryInsight"("industry");

-- CreateIndex
CREATE INDEX "IndustryInsight_industry_idx" ON "public"."IndustryInsight"("industry");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_industry_fkey" FOREIGN KEY ("industry") REFERENCES "public"."IndustryInsight"("industry") ON DELETE SET NULL ON UPDATE CASCADE;
