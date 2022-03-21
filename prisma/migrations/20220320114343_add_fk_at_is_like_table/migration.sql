-- AddForeignKey
ALTER TABLE `is_likes` ADD CONSTRAINT `is_likes_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
