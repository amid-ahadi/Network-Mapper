// --- دپارتمان‌ها ---
$(document).on('submit', '#departmentForm', function (e) {
    e.preventDefault();
    const building_id = $(this).find('select[name="building_id"]').val();
    const name = $(this).find('input[name="name"]').val().trim();
    if (!building_id || !name) {
        showAlert('لطفاً همه فیلدها را پر کنید.', false);
        return;
    }
    const id = $(this).find('input[name="id"]').val();
    $.post('modules/departments.php', {
        id: id,
        building_id: building_id,
        name: name,
        action: id ? 'edit' : 'add'
    }, function (res) {
        showAlert(res.message, res.success);
        if (res.success) {
            $('#departmentModal').modal('hide');
            $('#departmentForm')[0].reset();
            $('#departmentForm input[name="id"]').val('');
            loadDepartments();
            loadNetworkMap();
        }
    }, 'json').fail(function () {
        showAlert('خطا در ارتباط با سرور.', false);
    });
});

$(document).on('click', '.edit-department', function () {
    const id = $(this).data('id');
    const building_id = $(this).data('building');
    const name = $(this).data('name');
    $('#departmentForm input[name="id"]').val(id);
    $('#departmentForm select[name="building_id"]').val(building_id);
    $('#departmentForm input[name="name"]').val(name);
    $('#departmentModal').modal('show');
});

$(document).on('click', '.delete-department', function () {
    if (confirm('آیا مطمئن هستید؟')) {
        $.post('modules/departments.php', {
            id: $(this).data('id'),
            action: 'delete'
        }, function (res) {
            showAlert(res.message, res.success);
            if (res.success) {
                loadDepartments();
                loadNetworkMap();
            }
        }, 'json');
    }
});

function loadDepartments() {
    $.get('modules/departments.php')
        .done(function (data) {
            let html = '<table class="table table-sm"><thead><tr><th>ساختمان</th><th>دپارتمان</th><th>عملیات</th></tr></thead><tbody>';
            data.forEach(d => {
                html += `<tr>
                    <td>${d.building_name}</td>
                    <td>${d.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-department" data-id="${d.id}" data-building="${d.building_id}" data-name="${d.name}">ویرایش</button>
                        <button class="btn btn-sm btn-outline-danger delete-department" data-id="${d.id}">حذف</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            $('#departmentsList').html(html);
        })
        .fail(function () {
            $('#departmentsList').html('<div class="alert alert-danger">خطا در بارگذاری دپارتمان‌ها.</div>');
        });
}