-- DropForeignKey
ALTER TABLE "_PostLikes" DROP CONSTRAINT "_PostLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostLikes" DROP CONSTRAINT "_PostLikes_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "pinned";

-- DropTable
DROP TABLE "_PostLikes";

