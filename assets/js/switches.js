// --- سوئیچ‌ها ---
$(document).on('submit', '#switchForm', function (e) {
    e.preventDefault();
    
    const name = $(this).find('input[name="name"]').val().trim();
    const model = $(this).find('input[name="model"]').val().trim();
    const location = $(this).find('input[name="location"]').val().trim();
    const department_id = $(this).find('select[name="department_id"]').val();
    const ip = $(this).find('input[name="ip_address"]').val().trim();
    const mac = $(this).find('input[name="mac_address"]').val().trim();

    // فقط بررسی فیلدهای اجباری
    if (!name || !model || !location || !department_id || !ip || !mac) {
        showAlert('لطفاً همه فیلدها را پر کنید.', false);
        return;
    }

    const id = $(this).find('input[name="id"]').val();
    const action = id ? 'edit' : 'add';

    $.post('modules/switches.php', {
        id: id,
        name: name,
        model: model,
        location: location,
        department_id: department_id,
        ip_address: ip,
        mac_address: mac,
        action: action
    }, function (res) {
        showAlert(res.message, res.success);
        if (res.success) {
            $('#switchModal').modal('hide');
            $('#switchForm')[0].reset();
            $('#switchForm input[name="id"]').val('');
            loadSwitches();
            loadNetworkMap();
        }
    }, 'json').fail(function (xhr) {
        let msg = 'خطا در ارتباط با سرور.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
            msg = xhr.responseJSON.message;
        }
        showAlert(msg, false);
    });
});

// --- رویدادهای ویرایش و حذف ---
$(document).on('click', '.edit-switch', function () {
    const btn = $(this);
    $('#switchForm input[name="id"]').val(btn.data('id'));
    $('#switchForm input[name="name"]').val(btn.data('name'));
    $('#switchForm input[name="model"]').val(btn.data('model'));
    $('#switchForm input[name="location"]').val(btn.data('location'));
    $('#switchForm select[name="department_id"]').val(btn.data('department'));
    $('#switchForm input[name="ip_address"]').val(btn.data('ip'));
    $('#switchForm input[name="mac_address"]').val(btn.data('mac'));
    $('#switchModal').modal('show');
});

$(document).on('click', '.delete-switch', function () {
    if (confirm('آیا مطمئن هستید؟')) {
        $.post('modules/switches.php', {
            id: $(this).data('id'),
            action: 'delete'
        }, function (res) {
            showAlert(res.message, res.success);
            if (res.success) {
                loadSwitches();
                loadNetworkMap();
            }
        }, 'json').fail(function () {
            showAlert('خطا در حذف سوئیچ.', false);
        });
    }
});

// --- بارگذاری لیست سوئیچ‌ها ---
function loadSwitches() {
    $.get('modules/switches.php')
        .done(function (data) {
            let html = '<table class="table table-sm"><thead><tr><th>نام</th><th>مدل</th><th>دپارتمان</th><th>IP</th><th>MAC</th><th>عملیات</th></tr></thead><tbody>';
            data.forEach(s => {
                html += `<tr>
                    <td>${s.name}</td>
                    <td>${s.model}</td>
                    <td>${s.department_name || '—'}</td>
                    <td>${s.ip_address}</td>
                    <td>${s.mac_address}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-switch" 
                            data-id="${s.id}" 
                            data-name="${s.name}" 
                            data-model="${s.model}" 
                            data-location="${s.location}" 
                            data-department="${s.department_id}"
                            data-ip="${s.ip_address}" 
                            data-mac="${s.mac_address}">ویرایش</button>
                        <button class="btn btn-sm btn-outline-danger delete-switch" data-id="${s.id}">حذف</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            $('#switchesList').html(html);
        })
        .fail(function () {
            $('#switchesList').html('<div class="alert alert-danger">خطا در بارگذاری سوئیچ‌ها.</div>');
        });
}