/*
  Warnings:

  - You are about to drop the column `description` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "id" SET DEFAULT concat('comment_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "description",
ALTER COLUMN "id" SET DEFAULT concat('image_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "id" SET DEFAULT concat('like_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "id" SET DEFAULT concat('post_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Save" ALTER COLUMN "id" SET DEFAULT concat('save_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Share" ALTER COLUMN "id" SET DEFAULT concat('share_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "description",
ALTER COLUMN "id" SET DEFAULT concat('video_', replace(cast(gen_random_uuid() as text), '-', ''));
