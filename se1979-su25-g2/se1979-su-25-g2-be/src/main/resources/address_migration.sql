-- Script để thêm cột recipient_name và recipient_phone vào bảng addresses
ALTER TABLE addresses
ADD COLUMN recipient_name VARCHAR(100),
ADD COLUMN recipient_phone VARCHAR(20);

