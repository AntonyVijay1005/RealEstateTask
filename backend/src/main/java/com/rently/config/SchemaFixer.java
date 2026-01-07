package com.rently.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔧 Running SchemaFixer to ensure tables exist...");

        try {
            // Forcefully create property_images table if it doesn't exist
            // This fixes the "Table 'defaultdb.property_images' doesn't exist" error
            // which can happen if Hibernate misses the @ElementCollection update
            String createTableSql = "CREATE TABLE IF NOT EXISTS property_images (" +
                    "property_id BIGINT NOT NULL, " +
                    "image_url VARCHAR(255), " +
                    "FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE" +
                    ") ENGINE=InnoDB;";

            jdbcTemplate.execute(createTableSql);
            System.out.println("✅ SchemaFixer: Verified 'property_images' table.");
        } catch (Exception e) {
            System.err.println("⚠️ SchemaFixer Warning: Could not create table. " + e.getMessage());
        }
    }
}
