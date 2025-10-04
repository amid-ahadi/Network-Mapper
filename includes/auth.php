<?php
session_start();
require_once __DIR__ . '/config.php';

function getBaseURL() {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
    if ($scriptDir === '/' || $scriptDir === '\\') {
        $scriptDir = '';
    }
    return $protocol . '://' . $host . $scriptDir;
}

function require_login() {
    if (!isset($_SESSION['user_id'])) {
        $baseURL = getBaseURL();
        header('Location: ' . $baseURL . '/views/login.php');
        exit();
    }
}

function get_user_settings($pdo) {
    if (!isset($_SESSION['user_id'])) return ['theme' => 'light'];
    
    $stmt = $pdo->prepare("SELECT theme FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: ['theme' => 'light'];
}
?>
