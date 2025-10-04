<?php
require_once __DIR__ . '/includes/auth.php';
require_login();
require_once __DIR__ . '/includes/config.php';
$user_settings = get_user_settings($pdo);
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl" data-theme="<?= htmlspecialchars($user_settings['theme']) ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>داشبورد مدیریت شبکه بیمارستان</title>
    <link href="assets/css/bootstrap.rtl.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
<!-- کتابخانه‌ها -->
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/vis-network.min.js"></script>
<script src="assets/js/html2canvas.min.js"></script>
<script src="assets/js/jspdf.umd.min.js"></script>

<!-- ماژول‌های جاوااسکریپت -->
<script src="assets/js/utils.js"></script>
<script src="assets/js/buildings.js"></script>
<script src="assets/js/departments.js"></script>
<script src="assets/js/switches.js"></script>
<script src="assets/js/devices.js"></script>
<script src="assets/js/connections.js"></script>
<script src="assets/js/network-map.js"></script>
<script src="assets/js/main.js"></script>

</head>
<body>
    <!-- نوار بالایی -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">مدیریت شبکه بیمارستان</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#buildingModal">ساختمان‌ها</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#departmentModal">دپارتمان‌ها</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#switchModal">سوئیچ‌ها</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#deviceModal">دستگاه‌ها</a></li>
                    <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#connectionModal">ارتباطات</a></li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="toggleTheme">
                            <i class="fas fa-moon"></i> <span id="themeText">حالت شب</span>
                        </a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                            مدیر سیستم
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#settingsModal">تنظیمات</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="logout.php">خروج</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- محتوای اصلی -->
    <div class="container-fluid mt-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>نقشه شبکه</h3>
            <button class="btn btn-success" id="exportPdf">خروجی PDF</button>
        </div>
        <!-- فیلترها -->
<div class="row mb-3">
    <div class="col-md-4">
        <label class="form-label">فیلتر بر اساس ساختمان</label>
        <select id="filterBuilding" class="form-select">
            <option value="">همه ساختمان‌ها</option>
        </select>
    </div>
    <div class="col-md-4">
        <label class="form-label">فیلتر بر اساس دپارتمان</label>
        <select id="filterDepartment" class="form-select" disabled>
            <option value="">همه دپارتمان‌ها</option>
        </select>
    </div>
    <div class="col-md-4 d-flex align-items-end">
        <button id="filterReset" class="btn btn-outline-secondary">پاک‌سازی فیلتر</button>
    </div>
</div>
        <div id="networkMap" style="height: 70vh; border: 1px solid #ddd; border-radius: 8px;"></div>
    </div>

    <!-- مودال‌ها -->
    <?php include __DIR__ . '/views/dashboard.php'; ?>

    <!-- Font Awesome برای آیکون‌ها -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- اسکریپت اصلی -->
    <script src="assets/js/main.js"></script>
    <script>
        // تنظیم تم اولیه
    //    const theme = document.documentElement.getAttribute('data-theme');
    //    applyTheme(theme);
    </script>
</body>
</html>