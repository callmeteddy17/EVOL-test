-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "id" SET DEFAULT concat('comment_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "id" SET DEFAULT concat('image_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "id" SET DEFAULT concat('like_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "link" TEXT,
ALTER COLUMN "id" SET DEFAULT concat('post_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Save" ALTER COLUMN "id" SET DEFAULT concat('save_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Share" ALTER COLUMN "id" SET DEFAULT concat('share_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "id" SET DEFAULT concat('video_', replace(cast(gen_random_uuid() as text), '-', ''));
