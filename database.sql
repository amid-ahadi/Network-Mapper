-- --------------------------------------------------------
-- دیتابیس: hospital_network
-- --------------------------------------------------------

-- --------------------------------------------------------
-- جدول کاربران
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `theme` ENUM('light', 'dark') DEFAULT 'light',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- کاربر پیش‌فرض: admin / 123456
INSERT INTO `users` (`username`, `password`, `theme`) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'light');


-- --------------------------------------------------------
-- جدول ساختمان‌ها
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `buildings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;


-- --------------------------------------------------------
-- جدول دپارتمان‌ها
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `building_id` INT(11) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;


-- --------------------------------------------------------
-- جدول سوئیچ‌ها
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `switches` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(39) NOT NULL,  -- پشتیبانی از IPv4 و IPv6
  `mac_address` VARCHAR(17) NOT NULL,
  `department_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;


-- --------------------------------------------------------
-- جدول دستگاه‌ها
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `devices` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,       -- مثلاً: کامپیوتر، پرینتر، اسکنر
  `ip_address` VARCHAR(39) NOT NULL,
  `mac_address` VARCHAR(17) NOT NULL,
  `department_id` INT(11) NOT NULL,
  `switch_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`switch_id`) REFERENCES `switches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;


-- --------------------------------------------------------
-- جدول ارتباطات (اختیاری - برای اتصالات دستی)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `connections` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `source_type` ENUM('switch', 'device') NOT NULL,
  `source_id` INT(11) NOT NULL,
  `target_type` ENUM('switch', 'device') NOT NULL,
  `target_id` INT(11) NOT NULL,
  `cable_type` VARCHAR(50) NOT NULL, -- مثلاً: Cat6، فیبر نوری
  `port_from` VARCHAR(20) NOT NULL,
  `port_to` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;
