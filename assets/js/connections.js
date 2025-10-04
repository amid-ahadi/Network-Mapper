// --- ارتباطات ---
$(document).on('submit', '#connectionForm', function (e) {
    e.preventDefault();
    const source_type = $(this).find('select[name="source_type"]').val();
    const source_id = $(this).find('select[name="source_id"]').val();
    const target_type = $(this).find('select[name="target_type"]').val();
    const target_id = $(this).find('select[name="target_id"]').val();
    const cable_type = $(this).find('input[name="cable_type"]').val().trim();
    const port_from = $(this).find('input[name="port_from"]').val().trim();
    const port_to = $(this).find('input[name="port_to"]').val().trim();
    if (!source_type || !source_id || !target_type || !target_id || !cable_type || !port_from || !port_to) {
        showAlert('لطفاً همه فیلدها را پر کنید.', false);
        return;
    }
    const id = $(this).find('input[name="id"]').val();
    $.post('modules/connections.php', {
        id: id,
        source_type: source_type,
        source_id: source_id,
        target_type: target_type,
        target_id: target_id,
        cable_type: cable_type,
        port_from: port_from,
        port_to: port_to,
        action: id ? 'edit' : 'add'
    }, function (res) {
        showAlert(res.message, res.success);
        if (res.success) {
            $('#connectionModal').modal('hide');
            $('#connectionForm')[0].reset();
            $('#connectionForm input[name="id"]').val('');
            loadConnections();
            loadNetworkMap();
        }
    }, 'json').fail(function () {
        showAlert('خطا در ارتباط با سرور.', false);
    });
});

$(document).on('click', '.edit-connection', function () {
    const btn = $(this);
    $('#connectionForm input[name="id"]').val(btn.data('id'));
    $('#connectionForm select[name="source_type"]').val(btn.data('source-type'));
    $('#connectionForm select[name="target_type"]').val(btn.data('target-type'));
    $('#connectionForm select[name="source_id"]').val(btn.data('source-id'));
    $('#connectionForm select[name="target_id"]').val(btn.data('target-id'));
    $('#connectionForm input[name="cable_type"]').val(btn.data('cable'));
    $('#connectionForm input[name="port_from"]').val(btn.data('port-from'));
    $('#connectionForm input[name="port_to"]').val(btn.data('port-to'));
    $('#connectionModal').modal('show');
    $('#connectionForm select[name="source_type"], #connectionForm select[name="target_type"]').trigger('change');
});

$(document).on('click', '.delete-connection', function () {
    if (confirm('آیا مطمئن هستید؟')) {
        $.post('modules/connections.php', {
            id: $(this).data('id'),
            action: 'delete'
        }, function (res) {
            showAlert(res.message, res.success);
            if (res.success) {
                loadConnections();
                loadNetworkMap();
            }
        }, 'json');
    }
});

function loadConnections() {
    $.get('modules/connections.php')
        .done(function (data) {
            let html = '<table class="table table-sm"><thead><tr><th>منبع</th><th>مقصد</th><th>کابل</th><th>پورت‌ها</th><th>عملیات</th></tr></thead><tbody>';
            data.forEach(c => {
                html += `<tr>
                    <td>${c.source_type} (${c.source_id})</td>
                    <td>${c.target_type} (${c.target_id})</td>
                    <td>${c.cable_type}</td>
                    <td>${c.port_from} → ${c.port_to}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-connection" 
                            data-id="${c.id}"
                            data-source-type="${c.source_type}"
                            data-source-id="${c.source_id}"
                            data-target-type="${c.target_type}"
                            data-target-id="${c.target_id}"
                            data-cable="${c.cable_type}"
                            data-port-from="${c.port_from}"
                            data-port-to="${c.port_to}">ویرایش</button>
                        <button class="btn btn-sm btn-outline-danger delete-connection" data-id="${c.id}">حذف</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            $('#connectionsList').html(html);
        })
        .fail(function () {
            $('#connectionsList').html('<div class="alert alert-danger">خطا در بارگذاری ارتباطات.</div>');
        });
}