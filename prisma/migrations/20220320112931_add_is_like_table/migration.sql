-- CreateTable
CREATE TABLE `is_likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_like` BOOLEAN NOT NULL DEFAULT false,
    `product_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
