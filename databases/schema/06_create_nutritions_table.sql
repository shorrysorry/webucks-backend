CREATE TABLE nutritions
(
  id INT AUTO_INCREMENT,
  product_id INT NOT NULL,
  caffeine FLOAT NULL,
  fat FLOAT NULL,
  sugar FLOAT NULL,
  sodium FLOAT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);