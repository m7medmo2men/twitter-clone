-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_replyToId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "replyToId";

