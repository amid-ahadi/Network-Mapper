$(document).ready(function () {
    // بارگذاری داده‌های اولیه
    loadBuildings();
    loadDepartments();
    loadSwitches();
    loadDevices();
    loadConnections();
    loadNetworkMap();
    //------------ filter map-----------
    
    
    // --- بارگذاری لیست ساختمان‌ها برای فیلتر ---
function loadFilterBuildings() {
    $.get('modules/buildings.php', function (buildings) {
        let options = '<option value="">همه ساختمان‌ها</option>';
        buildings.forEach(b => options += `<option value="${b.id}">${b.name}</option>`);
        $('#filterBuilding').html(options);
    });
}

// --- بارگذاری دپارتمان‌های وابسته ---
$('#filterBuilding').on('change', function () {
    const buildingId = $(this).val();
    if (buildingId) {
        $.get('modules/departments.php', function (departments) {
            let options = '<option value="">همه دپارتمان‌ها</option>';
            departments
                .filter(d => d.building_id == buildingId)
                .forEach(d => options += `<option value="${d.id}">${d.name}</option>`);
            $('#filterDepartment').html(options).prop('disabled', false);
        });
    } else {
        $('#filterDepartment').html('<option value="">همه دپارتمان‌ها</option>').prop('disabled', true);
    }
    applyFilters();
});

$('#filterDepartment').on('change', applyFilters);

$('#filterReset').on('click', function () {
    $('#filterBuilding').val('');
    $('#filterDepartment').html('<option value="">همه دپارتمان‌ها</option>').prop('disabled', true);
    applyFilters();
});

// --- اعمال فیلتر روی نقشه ---
function applyFilters() {
    const buildingId = $('#filterBuilding').val();
    const departmentId = $('#filterDepartment').val();

    // ذخیره فیلترها در localStorage برای حفظ پس از رفرش
    localStorage.setItem('networkFilter', JSON.stringify({ buildingId, departmentId }));

    // بارگذاری مجدد نقشه با فیلتر
    loadNetworkMapWithFilters(buildingId, departmentId);
}

// --- بارگذاری نقشه با فیلتر ---
function loadNetworkMapWithFilters(buildingId = null, departmentId = null) {
    Promise.all([
        $.get('modules/buildings.php'),
        $.get('modules/departments.php'),
        $.get('modules/switches.php'),
        $.get('modules/devices.php'),
        $.get('modules/connections.php')
    ]).then(([buildings, departments, switches, devices, connections]) => {
        const nodes = new vis.DataSet();
        const edges = new vis.DataSet();

        // فیلتر ساختمان‌ها
        const filteredBuildings = buildingId 
            ? buildings.filter(b => b.id == buildingId) 
            : buildings;

        // فیلتر دپارتمان‌ها
        const filteredDepartments = departmentId
            ? departments.filter(d => d.id == departmentId)
            : buildingId
                ? departments.filter(d => d.building_id == buildingId)
                : departments;

        // --- اضافه کردن گره‌ها ---
        filteredBuildings.forEach(b => {
            nodes.add({ id: `b${b.id}`, label: `ساختمان: ${b.name}`, group: 'building' });
        });

        filteredDepartments.forEach(d => {
            nodes.add({ id: `d${d.id}`, label: `دپارتمان: ${d.name}`, group: 'department' });
            if (filteredBuildings.some(b => b.id == d.building_id)) {
                edges.add({ from: `b${d.building_id}`, to: `d${d.id}`, arrows: 'to' });
            }
        });

        // سوئیچ‌های مرتبط
        const relevantSwitches = switches.filter(s => 
            filteredDepartments.some(d => d.id == s.department_id)
        );
        relevantSwitches.forEach(s => {
            nodes.add({ id: `s${s.id}`, label: `سوئیچ: ${s.name}\n${s.ip_address}`, group: 'switch' });
            edges.add({ from: `d${s.department_id}`, to: `s${s.id}`, arrows: 'to' });
        });

        // دستگاه‌های مرتبط
        const relevantSwitchIds = relevantSwitches.map(s => s.id);
        const relevantDevices = devices.filter(d => 
            relevantSwitchIds.includes(d.switch_id) ||
            filteredDepartments.some(dep => dep.id == d.department_id)
        );
        relevantDevices.forEach(d => {
            nodes.add({ id: `dev${d.id}`, label: `${d.type}: ${d.name}\n${d.ip_address}`, group: 'device' });
            // اتصال منطقی به دپارتمان
            if (filteredDepartments.some(dep => dep.id == d.department_id)) {
                edges.add({ from: `d${d.department_id}`, to: `dev${d.id}`, arrows: 'to', dashes: true, color: { color: '#999' } });
            }
            // اتصال فیزیکی به سوئیچ
            if (relevantSwitchIds.includes(d.switch_id)) {
                edges.add({ from: `s${d.switch_id}`, to: `dev${d.id}`, arrows: 'to' });
            }
        });

        // ارتباطات دستی
        connections.forEach(c => {
            let from = (c.source_type === 'switch' ? 's' : 'dev') + c.source_id;
            let to = (c.target_type === 'switch' ? 's' : 'dev') + c.target_id;
            // فقط اگر هر دو گره در نقشه باشند
            if (nodes.get(from) && nodes.get(to)) {
                edges.add({
                    from: from,
                    to: to,
                    label: `${c.cable_type}\n${c.port_from} → ${c.port_to}`,
                    arrows: 'to, from'
                });
            }
        });

        const container = document.getElementById('networkMap');
        const data = { nodes, edges };
        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD',
                    sortMethod: 'directed',
                    nodeSpacing: 150,
                    levelSeparation: 120
                }
            },
            physics: false,
            edges: {
                smooth: { enabled: true, type: 'cubicBezier', roundness: 0.4 },
                arrows: { to: { enabled: true, scaleFactor: 0.7 } },
                color: { color: '#555' },
                font: { size: 10, align: 'horizontal' }
            },
            groups: {
                building: { color: { background: '#e3f2fd', border: '#1976d2' }, shape: 'box', font: { bold: true } },
                department: { color: { background: '#f3e5f5', border: '#7b1fa2' }, shape: 'box' },
                switch: { color: { background: '#e8f5e9', border: '#388e3c' }, shape: 'ellipse' },
                device: { color: { background: '#fff3e0', border: '#f57c00' }, shape: 'ellipse' }
            }
        };
        new vis.Network(container, data, options);
    });
}

// --- بارگذاری اولیه فیلترها ---
$(document).ready(function () {
    loadFilterBuildings();
    // بارگذاری فیلترهای ذخیره‌شده
    const saved = localStorage.getItem('networkFilter');
    if (saved) {
        const { buildingId, departmentId } = JSON.parse(saved);
        $('#filterBuilding').val(buildingId);
        if (buildingId) {
            // دپارتمان‌ها را بارگذاری و انتخاب کن
            $.get('modules/departments.php', function (departments) {
                let options = '<option value="">همه دپارتمان‌ها</option>';
                departments
                    .filter(d => d.building_id == buildingId)
                    .forEach(d => options += `<option value="${d.id}">${d.name}</option>`);
                $('#filterDepartment').html(options).prop('disabled', false);
                if (departmentId) {
                    $('#filterDepartment').val(departmentId);
                }
                applyFilters();
            });
        } else {
            applyFilters();
        }
    } else {
        loadNetworkMapWithFilters(); // بدون فیلتر
    }
});
    
    //-----------end of Filter----------
    // بارگذاری لیست‌ها در مودال‌ها
    initModalLoaders();
});


// --- بارگذاری لیست‌ها در مودال ارتباطات ---
$('#connectionModal').on('show.bs.modal', function () {
    let switches = [];
    let devices = [];

    // بارگذاری سوئیچ‌ها
    $.get('modules/switches.php').done(function (data) {
        switches = data;
        updateConnectionSelects();
    });

    // بارگذاری دستگاه‌ها
    $.get('modules/devices.php').done(function (data) {
        devices = data;
        updateConnectionSelects();
    });

    // تابع به‌روزرسانی انتخاب‌ها
    function updateConnectionSelects() {
        const sourceType = $('select[name="source_type"]').val();
        const targetType = $('select[name="target_type"]').val();

        let sourceOptions = '<option value="">انتخاب کنید</option>';
        let targetOptions = '<option value="">انتخاب کنید</option>';

        if (sourceType === 'switch') {
            switches.forEach(s => sourceOptions += `<option value="${s.id}">${s.name}</option>`);
        } else {
            devices.forEach(d => sourceOptions += `<option value="${d.id}">${d.name}</option>`);
        }

        if (targetType === 'switch') {
            switches.forEach(s => targetOptions += `<option value="${s.id}">${s.name}</option>`);
        } else {
            devices.forEach(d => targetOptions += `<option value="${d.id}">${d.name}</option>`);
        }

        $('select[name="source_id"]').html(sourceOptions);
        $('select[name="target_id"]').html(targetOptions);
    }

    // اتصال رویداد تغییر نوع
    $('select[name="source_type"], select[name="target_type"]')
        .off('change')
        .on('change', updateConnectionSelects);

    // بارگذاری اولیه
    updateConnectionSelects();
});

//-----------------------
$('#deviceModal').on('show.bs.modal', function () {
    // بارگذاری دپارتمان‌ها
    $.get('modules/departments.php', function (depts) {
        let options = '<option value="">انتخاب دپارتمان</option>';
        depts.forEach(d => options += `<option value="${d.id}">${d.name} (${d.building_name})</option>`);
        $('#deviceForm select[name="department_id"]').html(options);
    });

    // بارگذاری سوئیچ‌ها
    $.get('modules/switches.php', function (switches) {
        let options = '<option value="">انتخاب سوئیچ</option>';
        switches.forEach(s => options += `<option value="${s.id}">${s.name} (${s.department_name || ''})</option>`);
        $('#deviceForm select[name="switch_id"]').html(options);
    });
});

function loadDevices() {
    $.get('modules/devices.php')
        .done(function (data) {
            let html = '<table class="table table-sm"><thead><tr><th>نام</th><th>نوع</th><th>دپارتمان</th><th>سوئیچ</th><th>IP</th><th>MAC</th><th>عملیات</th></tr></thead><tbody>';
            data.forEach(d => {
                html += `<tr>
                    <td>${d.name}</td>
                    <td>${d.type}</td>
                    <td>${d.department_name}</td>
                    <td>${d.switch_name}</td>
                    <td>${d.ip_address}</td>
                    <td>${d.mac_address}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-device" 
                            data-id="${d.id}" 
                            data-name="${d.name}" 
                            data-type="${d.type}" 
                            data-department="${d.department_id}"
                            data-switch="${d.switch_id}"
                            data-ip="${d.ip_address}" 
                            data-mac="${d.mac_address}">ویرایش</button>
                        <button class="btn btn-sm btn-outline-danger delete-device" data-id="${d.id}">حذف</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            $('#devicesList').html(html);
        })
        .fail(function () {
            $('#devicesList').html('<div class="alert alert-danger">خطا در بارگذاری دستگاه‌ها.</div>');
        });
}

//-----------------------
