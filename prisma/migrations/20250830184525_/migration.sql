/*
  Warnings:

  - You are about to drop the column `industry` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `IndustryInsight` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_industry_fkey";

-- DropIndex
DROP INDEX "public"."IndustryInsight_industry_idx";

-- DropIndex
DROP INDEX "public"."IndustryInsight_industry_key";

-- AlterTable
ALTER TABLE "public"."IndustryInsight" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "industry";

-- CreateIndex
CREATE UNIQUE INDEX "IndustryInsight_userId_key" ON "public"."IndustryInsight"("userId");

-- AddForeignKey
ALTER TABLE "public"."IndustryInsight" ADD CONSTRAINT "IndustryInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
