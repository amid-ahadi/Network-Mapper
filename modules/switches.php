<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_login();

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? '';
        $id = isset($_POST['id']) && $_POST['id'] !== '' ? (int)$_POST['id'] : null;
        $name = trim($_POST['name'] ?? '');
        $model = trim($_POST['model'] ?? '');
        $location = trim($_POST['location'] ?? '');
        $ip = trim($_POST['ip_address'] ?? '');
        $mac = trim($_POST['mac_address'] ?? '');
        $department_id = isset($_POST['department_id']) ? (int)$_POST['department_id'] : null;

        if (!$name || !$model || !$location || !$ip || !$mac || !$department_id) {
            echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی هستند.']);
            exit;
        }
        if ($action === 'add') {
            $stmt = $pdo->prepare("INSERT INTO switches (name, model, location, ip_address, mac_address, department_id) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $model, $location, $ip, $mac, $department_id]);
            echo json_encode(['success' => true, 'message' => 'سوئیچ با موفقیت اضافه شد.']);
        } elseif ($action === 'edit' && $id) {
            $stmt = $pdo->prepare("UPDATE switches SET name = ?, model = ?, location = ?, ip_address = ?, mac_address = ?, department_id = ? WHERE id = ?");
            $stmt->execute([$name, $model, $location, $ip, $mac, $department_id, $id]);
            echo json_encode(['success' => true, 'message' => 'سوئیچ با موفقیت ویرایش شد.']);
        } elseif ($action === 'delete' && $id) {
            $stmt = $pdo->prepare("DELETE FROM switches WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'سوئیچ با موفقیت حذف شد.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'عملیات نامعتبر.']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("
            SELECT s.*, d.name AS department_name 
            FROM switches s 
            LEFT JOIN departments d ON s.department_id = d.id 
            ORDER BY s.name
        ");
        $switches = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($switches);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'متد درخواست پشتیبانی نمی‌شود.']);
    }
} catch (Exception $e) {
    error_log("Switches Module Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'خطای داخلی سرور.']);
}
?>