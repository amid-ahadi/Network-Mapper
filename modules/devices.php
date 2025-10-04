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
        $type = trim($_POST['type'] ?? '');
        $ip = trim($_POST['ip_address'] ?? '');
        $mac = trim($_POST['mac_address'] ?? '');
        $department_id = isset($_POST['department_id']) ? (int)$_POST['department_id'] : null;
        $switch_id = isset($_POST['switch_id']) ? (int)$_POST['switch_id'] : null;

        if (!$name || !$type || !$ip || !$mac || !$department_id || !$switch_id) {
            echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی هستند.']);
            exit;
        }

        if ($action === 'add') {
            $stmt = $pdo->prepare("INSERT INTO devices (name, type, ip_address, mac_address, department_id, switch_id) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $type, $ip, $mac, $department_id, $switch_id]);
            echo json_encode(['success' => true, 'message' => 'دستگاه با موفقیت اضافه شد.']);
        } elseif ($action === 'edit' && $id) {
            $stmt = $pdo->prepare("UPDATE devices SET name = ?, type = ?, ip_address = ?, mac_address = ?, department_id = ?, switch_id = ? WHERE id = ?");
            $stmt->execute([$name, $type, $ip, $mac, $department_id, $switch_id, $id]);
            echo json_encode(['success' => true, 'message' => 'دستگاه با موفقیت ویرایش شد.']);
        } elseif ($action === 'delete' && $id) {
            $stmt = $pdo->prepare("DELETE FROM devices WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'دستگاه با موفقیت حذف شد.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'عملیات نامعتبر.']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("
            SELECT d.*, 
                   s.name AS switch_name, 
                   dep.name AS department_name
            FROM devices d
            JOIN departments dep ON d.department_id = dep.id
            JOIN switches s ON d.switch_id = s.id
            ORDER BY d.name
        ");
        $devices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($devices);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'متد درخواست پشتیبانی نمی‌شود.']);
    }
} catch (Exception $e) {
    error_log("Devices Module Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'خطای داخلی سرور.']);
}
?>