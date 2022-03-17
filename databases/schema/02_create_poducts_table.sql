CREATE TABLE products
(
  id INT AUTO_INCREMENT,
  korean_name VARCHAR(100) UNIQUE NOT NULL,
  english_name VARCHAR(100) NOT NULL,
  category_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories (id)
);