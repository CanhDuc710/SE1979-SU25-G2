-- Migration script to fix payment_method column length
-- Run this SQL script in your MySQL database

USE your_database_name; -- Replace with your actual database name

-- Check current column definition
DESCRIBE orders;

-- Alter the payment_method column to allow longer values
ALTER TABLE orders MODIFY COLUMN payment_method VARCHAR(20) NOT NULL;

-- Verify the change
DESCRIBE orders;
