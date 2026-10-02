-- ========================================================
-- Database: student_information_system
-- Student Information Management System (SIMS)
-- Seeded from frontend/src/data/demoData.json
-- ========================================================

CREATE DATABASE IF NOT EXISTS `student_information_system`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `student_information_system`;

-- --------------------------------------------------------
-- Table structure for `students_department`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students_department` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL UNIQUE,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `students_student`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students_student` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(30) NOT NULL UNIQUE,
  `first_name` VARCHAR(80) NOT NULL,
  `last_name` VARCHAR(80) NOT NULL,
  `email` VARCHAR(254) NOT NULL UNIQUE,
  `phone` VARCHAR(25) NOT NULL DEFAULT '',
  `date_of_birth` DATE NULL,
  `gender` VARCHAR(10) NOT NULL DEFAULT '',
  `address` VARCHAR(255) NOT NULL DEFAULT '',
  `semester` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `enrollment_year` SMALLINT UNSIGNED NOT NULL,
  `status` VARCHAR(12) NOT NULL DEFAULT 'active',
  `gpa` DECIMAL(4, 2) NOT NULL DEFAULT 0.00,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `department_id` INT UNSIGNED NOT NULL,
  CONSTRAINT `students_student_department_fk`
    FOREIGN KEY (`department_id`) REFERENCES `students_department` (`id`) ON DELETE RESTRICT,
  INDEX `students_student_department_idx` (`department_id`),
  INDEX `students_student_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `students_department`
-- --------------------------------------------------------
INSERT INTO `students_department` (`id`, `name`, `code`, `description`)
VALUES
  (1, 'Computer Science', 'CS', 'Software engineering, systems and computing studies.'),
  (2, 'Business Administration', 'BBA', 'Management, finance and entrepreneurship studies.'),
  (3, 'Information Technology', 'IT', 'Applied information technology and digital systems.')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `code` = VALUES(`code`),
  `description` = VALUES(`description`);

-- --------------------------------------------------------
-- Dumping data for table `students_student`
-- --------------------------------------------------------
INSERT INTO `students_student` (
  `id`, `student_id`, `first_name`, `last_name`, `email`, `phone`,
  `date_of_birth`, `gender`, `address`, `semester`, `enrollment_year`,
  `status`, `gpa`, `department_id`
) VALUES
  (1, 'STU-2026-001', 'Aarav', 'Sharma', 'aarav.sharma@example.com', '+977 9800000001', '2004-03-18', 'male', 'Kathmandu, Nepal', 6, 2023, 'active', 3.82, 1),
  (2, 'STU-2026-002', 'Saanvi', 'Thapa', 'saanvi.thapa@example.com', '+977 9800000002', '2003-11-07', 'female', 'Pokhara, Nepal', 8, 2022, 'graduated', 3.58, 2),
  (3, 'STU-2026-003', 'Nischal', 'Gurung', 'nischal.gurung@example.com', '+977 9800000003', '2005-01-26', 'male', 'Lalitpur, Nepal', 4, 2024, 'active', 3.41, 3),
  (4, 'STU-2026-004', 'Anisha', 'Karki', 'anisha.karki@example.com', '+977 9800000004', '2004-08-12', 'female', 'Bhaktapur, Nepal', 5, 2023, 'inactive', 3.12, 1)
ON DUPLICATE KEY UPDATE
  `student_id` = VALUES(`student_id`),
  `first_name` = VALUES(`first_name`),
  `last_name` = VALUES(`last_name`),
  `email` = VALUES(`email`),
  `phone` = VALUES(`phone`),
  `date_of_birth` = VALUES(`date_of_birth`),
  `gender` = VALUES(`gender`),
  `address` = VALUES(`address`),
  `semester` = VALUES(`semester`),
  `enrollment_year` = VALUES(`enrollment_year`),
  `status` = VALUES(`status`),
  `gpa` = VALUES(`gpa`),
  `department_id` = VALUES(`department_id`);
