-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "parentTweetId" INTEGER;

-- CreateTable
CREATE TABLE "_PostRetweets" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostRetweets_AB_unique" ON "_PostRetweets"("A", "B");

-- CreateIndex
CREATE INDEX "_PostRetweets_B_index" ON "_PostRetweets"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentTweetId_fkey" FOREIGN KEY ("parentTweetId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostRetweets" ADD CONSTRAINT "_PostRetweets_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostRetweets" ADD CONSTRAINT "_PostRetweets_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
