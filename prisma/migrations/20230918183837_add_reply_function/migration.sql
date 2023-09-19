-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "replyToId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
