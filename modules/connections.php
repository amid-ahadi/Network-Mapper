<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_login();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $id = $_POST['id'] ?? null;
    $source_type = $_POST['source_type'] ?? '';
    $source_id = $_POST['source_id'] ?? null;
    $target_type = $_POST['target_type'] ?? '';
    $target_id = $_POST['target_id'] ?? null;
    $cable_type = trim($_POST['cable_type'] ?? '');
    $port_from = trim($_POST['port_from'] ?? '');
    $port_to = trim($_POST['port_to'] ?? '');

    if (!$source_type || !$source_id || !$target_type || !$target_id || !$cable_type || !$port_from || !$port_to) {
        echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی هستند.']);
        exit;
    }

    // جلوگیری از اتصال به خودش
    if ($source_type === $target_type && $source_id == $target_id) {
        echo json_encode(['success' => false, 'message' => 'اتصال به خودش مجاز نیست.']);
        exit;
    }

    try {
        if ($action === 'add') {
            $stmt = $pdo->prepare("INSERT INTO connections (source_type, source_id, target_type, target_id, cable_type, port_from, port_to) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$source_type, $source_id, $target_type, $target_id, $cable_type, $port_from, $port_to]);
            echo json_encode(['success' => true, 'message' => 'ارتباط با موفقیت اضافه شد.']);
        } elseif ($action === 'edit' && $id) {
            $stmt = $pdo->prepare("UPDATE connections SET source_type = ?, source_id = ?, target_type = ?, target_id = ?, cable_type = ?, port_from = ?, port_to = ? WHERE id = ?");
            $stmt->execute([$source_type, $source_id, $target_type, $target_id, $cable_type, $port_from, $port_to, $id]);
            echo json_encode(['success' => true, 'message' => 'ارتباط با موفقیت ویرایش شد.']);
        } elseif ($action === 'delete' && $id) {
            $stmt = $pdo->prepare("DELETE FROM connections WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'ارتباط با موفقیت حذف شد.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'عملیات نامعتبر.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'خطا: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM connections ORDER BY id");
    $connections = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($connections);
}
?>