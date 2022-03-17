CREATE TABLE product_images
(
  id INT AUTO_INCREMENT,
  image_url VARCHAR(3000) NOT NULL,
  product_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);
