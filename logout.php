<?php
session_start();
session_destroy();

$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptDir === '/' || $scriptDir === '\\') {
    $scriptDir = '';
}
$baseURL = $protocol . '://' . $host . $scriptDir;

header('Location: ' . $baseURL . '/views/login.php');
exit();
?>