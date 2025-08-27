-- CreateTable
CREATE TABLE "public"."Roadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roadmapTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT,
    "initialNodes" JSONB NOT NULL,
    "initialEdges" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_userId_key" ON "public"."Roadmap"("userId");

-- CreateIndex
CREATE INDEX "Roadmap_userId_idx" ON "public"."Roadmap"("userId");

-- AddForeignKey
ALTER TABLE "public"."Roadmap" ADD CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
