// --- دستگاه‌ها ---
$(document).on('submit', '#deviceForm', function (e) {
    e.preventDefault();
    const name = $(this).find('input[name="name"]').val().trim();
    const type = $(this).find('input[name="type"]').val().trim();
    const department_id = $(this).find('select[name="department_id"]').val(); 
    const switch_id = $(this).find('select[name="switch_id"]').val();
    const ip = $(this).find('input[name="ip_address"]').val().trim();
    const mac = $(this).find('input[name="mac_address"]').val().trim();

    // ✅ department_id هم بررسی شود
    if (!name || !type || !department_id || !switch_id || !ip || !mac) {
        showAlert('لطفاً همه فیلدها را پر کنید.', false);
        return;
    }

    const id = $(this).find('input[name="id"]').val();
    $.post('modules/devices.php', {
        id: id,
        name: name,
        type: type,
        department_id: department_id, // ✅ اضافه شد
        switch_id: switch_id,
        ip_address: ip,
        mac_address: mac,
        action: id ? 'edit' : 'add'
    }, function (res) {
        showAlert(res.message, res.success);
        if (res.success) {
            $('#deviceModal').modal('hide');
            $('#deviceForm')[0].reset();
            $('#deviceForm input[name="id"]').val('');
            loadDevices();
            loadNetworkMap();
        }
    }, 'json').fail(function () {
        showAlert('خطا در ارتباط با سرور.', false);
    });
});

$(document).on('click', '.edit-device', function () {
    const btn = $(this);
    $('#deviceForm input[name="id"]').val(btn.data('id'));
    $('#deviceForm input[name="name"]').val(btn.data('name'));
    $('#deviceForm input[name="type"]').val(btn.data('type'));
    $('#deviceForm select[name="department_id"]').val(btn.data('department'));
    $('#deviceForm select[name="switch_id"]').val(btn.data('switch'));
    $('#deviceForm input[name="ip_address"]').val(btn.data('ip'));
    $('#deviceForm input[name="mac_address"]').val(btn.data('mac'));
    $('#deviceModal').modal('show');
});

$(document).on('click', '.delete-device', function () {
    if (confirm('آیا مطمئن هستید؟')) {
        $.post('modules/devices.php', {
            id: $(this).data('id'),
            action: 'delete'
        }, function (res) {
            showAlert(res.message, res.success);
            if (res.success) {
                loadDevices();
                loadNetworkMap();
            }
        }, 'json');
    }
});

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