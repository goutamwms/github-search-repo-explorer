-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_user_id_fkey";

-- DropIndex
DROP INDEX "Note_user_id_idx";

-- DropIndex
DROP INDEX "User_email_idx";
