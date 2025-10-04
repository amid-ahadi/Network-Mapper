// --- ساختمان‌ها ---
$(document).on('submit', '#buildingForm', function (e) {
    e.preventDefault();
    const name = $(this).find('input[name="name"]').val().trim();
    if (!name) {
        showAlert('نام ساختمان را وارد کنید.', false);
        return;
    }
    const id = $(this).find('input[name="id"]').val();
    $.post('modules/buildings.php', {
        id: id,
        name: name,
        action: id ? 'edit' : 'add'
    }, function (res) {
        showAlert(res.message, res.success);
        if (res.success) {
            $('#buildingModal').modal('hide');
            $('#buildingForm')[0].reset();
            $('#buildingForm input[name="id"]').val('');
            loadBuildings();
            loadNetworkMap();
        }
    }, 'json').fail(function () {
        showAlert('خطا در ارتباط با سرور.', false);
    });
});

$(document).on('click', '.edit-building', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    $('#buildingForm input[name="id"]').val(id);
    $('#buildingForm input[name="name"]').val(name);
    $('#buildingModal').modal('show');
});

$(document).on('click', '.delete-building', function () {
    if (confirm('آیا مطمئن هستید؟')) {
        $.post('modules/buildings.php', {
            id: $(this).data('id'),
            action: 'delete'
        }, function (res) {
            showAlert(res.message, res.success);
            if (res.success) {
                loadBuildings();
                loadNetworkMap();
            }
        }, 'json');
    }
});

function loadBuildings() {
    $.get('modules/buildings.php')
        .done(function (data) {
            let html = '<table class="table table-sm"><thead><tr><th>نام</th><th>عملیات</th></tr></thead><tbody>';
            data.forEach(b => {
                html += `<tr>
                    <td>${b.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-building" data-id="${b.id}" data-name="${b.name}">ویرایش</button>
                        <button class="btn btn-sm btn-outline-danger delete-building" data-id="${b.id}">حذف</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            $('#buildingsList').html(html);
        })
        .fail(function () {
            $('#buildingsList').html('<div class="alert alert-danger">خطا در بارگذاری ساختمان‌ها.</div>');
        });
}