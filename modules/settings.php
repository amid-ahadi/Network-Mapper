<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_login();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (!$current_password || !$new_password || !$confirm_password) {
        echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی هستند.']);
        exit;
    }

    if ($new_password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'رمز عبور جدید و تکرار آن یکسان نیستند.']);
        exit;
    }

    if (strlen($new_password) < 6) {
        echo json_encode(['success' => false, 'message' => 'رمز عبور باید حداقل 6 کاراکتر باشد.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($current_password, $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'رمز عبور فعلی اشتباه است.']);
            exit;
        }

        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashed_password, $_SESSION['user_id']]);

        echo json_encode(['success' => true, 'message' => 'رمز عبور با موفقیت تغییر کرد.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'خطا: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['toggle_theme'])) {
    $current_theme = $_GET['toggle_theme'] === 'dark' ? 'light' : 'dark';
    $stmt = $pdo->prepare("UPDATE users SET theme = ? WHERE id = ?");
    $stmt->execute([$current_theme, $_SESSION['user_id']]);
    echo json_encode(['theme' => $current_theme]);
}
?>