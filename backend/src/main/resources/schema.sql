CREATE TABLE IF NOT EXISTS property_images (
    property_id BIGINT NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB;
