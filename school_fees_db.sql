-- ======================================================
-- School Fees Management System - Database Schema
-- Database: school_fees_db
-- For: XAMPP (phpMyAdmin) MySQL
-- ======================================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS school_fees_db;
CREATE DATABASE school_fees_db;
USE school_fees_db;

-- ======================================================
-- 1. Admin Table
-- Stores administrator login credentials
-- ======================================================
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
);

-- ======================================================
-- 2. Students Table
-- Stores student personal and academic details
-- ======================================================
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    parent_name VARCHAR(100),
    mobile_number VARCHAR(20),
    address VARCHAR(255)
);

-- ======================================================
-- 3. Fees Table
-- Stores total fee assigned to each student
-- Tracks paid, remaining, and status
-- ======================================================
CREATE TABLE fees (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    total_fees DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    remaining_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ======================================================
-- 4. Payments Table
-- Stores individual payment transactions (installments)
-- ======================================================
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    fee_id INT NOT NULL,
    student_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    FOREIGN KEY (fee_id) REFERENCES fees(fee_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ======================================================
-- Default Admin Login
-- Username: admin
-- Password: admin123
-- ======================================================
INSERT INTO admin (username, password) VALUES 
('admin', 'admin123');

-- ======================================================
-- Dummy Students Data for Testing
-- ======================================================
INSERT INTO students (name, class, section, roll_number, parent_name, mobile_number, address) VALUES
('Vishal Bokhare', 'MCA', 'A', 'MCA2024001', 'Prakash Bokhare', '9876543210', 'Delhi, India'),
('Tejaswini Chaudhari', 'MCA', 'A', 'MCA2024002', 'Kailas Chaudhari', '9876543211', 'Mumbai, India'),
('Yash Jain', 'MCA', 'B', 'MCA2024003', 'Ramesh Jain', '9876543212', 'Bangalore, India'),
('Nareen Patil', 'MCA', 'B', 'MCA2024004', 'Mahesh Patil', '9876543213', 'Ahmedabad, India'),
('Ritika Rathod', 'MCA', 'A', 'MCA2024005', 'Venkat Rathod', '9876543214', 'Hyderabad, India');

-- ======================================================
-- Dummy Fees Data
-- Rahul: Partial (20000/50000)
-- Priya: Paid (50000/50000)
-- Amit: Pending (0/50000)
-- Sneha: Partial (15000/50000)
-- Vikram: Pending (0/50000)
-- ======================================================
INSERT INTO fees (student_id, total_fees, paid_amount, remaining_amount, status) VALUES
(1, 50000.00, 20000.00, 30000.00, 'Partial'),
(2, 50000.00, 50000.00, 0.00, 'Paid'),
(3, 50000.00, 0.00, 50000.00, 'Pending'),
(4, 50000.00, 15000.00, 35000.00, 'Partial'),
(5, 50000.00, 0.00, 50000.00, 'Pending');

-- ======================================================
-- Dummy Payment History (Installments)
-- ======================================================
INSERT INTO payments (fee_id, student_id, amount_paid, payment_date, payment_mode) VALUES
(1, 1, 10000.00, '2024-01-15', 'Cash'),
(1, 1, 10000.00, '2024-02-10', 'Online'),
(2, 2, 25000.00, '2024-01-20', 'Bank Transfer'),
(2, 2, 25000.00, '2024-03-05', 'Card'),
(4, 4, 15000.00, '2024-02-01', 'Cash');

-- ======================================================
-- End of Script
-- ======================================================

