-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_parentTweetId_fkey";

-- DropForeignKey
ALTER TABLE "_PostRetweets" DROP CONSTRAINT "_PostRetweets_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostRetweets" DROP CONSTRAINT "_PostRetweets_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "parentTweetId";

-- DropTable
DROP TABLE "_PostRetweets";

