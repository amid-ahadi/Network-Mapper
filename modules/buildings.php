<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_login();

// تنظیمات خطا برای دیباگ (در محیط تولید غیرفعال کنید)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? '';
        $id = isset($_POST['id']) && $_POST['id'] !== '' ? (int)$_POST['id'] : null;
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';

        // اعتبارسنجی
        if ($action === 'add' || $action === 'edit') {
            if ($name === '') {
                echo json_encode(['success' => false, 'message' => 'نام ساختمان نمی‌تواند خالی باشد.']);
                exit;
            }

            if ($action === 'add') {
                $stmt = $pdo->prepare("INSERT INTO buildings (name) VALUES (?)");
                $stmt->execute([$name]);
                echo json_encode(['success' => true, 'message' => 'ساختمان با موفقیت اضافه شد.']);
            } elseif ($action === 'edit') {
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'شناسه ساختمان نامعتبر است.']);
                    exit;
                }
                $stmt = $pdo->prepare("UPDATE buildings SET name = ? WHERE id = ?");
                $stmt->execute([$name, $id]);
                echo json_encode(['success' => true, 'message' => 'ساختمان با موفقیت ویرایش شد.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'عملیات نامعتبر است.']);
            }
        } elseif ($action === 'delete') {
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'شناسه ساختمان نامعتبر است.']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM buildings WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'ساختمان با موفقیت حذف شد.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'عملیات نامشخص.']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT * FROM buildings ORDER BY name");
        $buildings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($buildings);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'متد درخواست پشتیبانی نمی‌شود.']);
    }
} catch (Exception $e) {
    error_log("Buildings Module Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'خطای داخلی سرور. لطفاً با مدیر سیستم تماس بگیرید.']);
}
?>
