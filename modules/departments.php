<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_login();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $id = $_POST['id'] ?? null;
    $building_id = $_POST['building_id'] ?? null;
    $name = trim($_POST['name'] ?? '');

    if (!$name || !$building_id) {
        echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی هستند.']);
        exit;
    }

    try {
        if ($action === 'add') {
            $stmt = $pdo->prepare("INSERT INTO departments (building_id, name) VALUES (?, ?)");
            $stmt->execute([$building_id, $name]);
            echo json_encode(['success' => true, 'message' => 'دپارتمان با موفقیت اضافه شد.']);
        } elseif ($action === 'edit' && $id) {
            $stmt = $pdo->prepare("UPDATE departments SET building_id = ?, name = ? WHERE id = ?");
            $stmt->execute([$building_id, $name, $id]);
            echo json_encode(['success' => true, 'message' => 'دپارتمان با موفقیت ویرایش شد.']);
        } elseif ($action === 'delete' && $id) {
            $stmt = $pdo->prepare("DELETE FROM departments WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'دپارتمان با موفقیت حذف شد.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'عملیات نامعتبر.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'خطا: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT d.*, b.name AS building_name FROM departments d JOIN buildings b ON d.building_id = b.id ORDER BY d.name");
    $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($departments);
}
?>