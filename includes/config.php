<?php
// config.php
$host = 'localhost';
$dbname = ''; // نام دیتابیس خود را اینجا وارد کنید
$username = '';           // نام کاربری دیتابیس
$password = '';               // رمز عبور دیتابیس

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4");
} catch (PDOException $e) {
    die("اتصال به دیتابیس با شکست مواجه شد: " . $e->getMessage());
}
?>
