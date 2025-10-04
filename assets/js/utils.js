// نمایش هشدار
function showAlert(message, isSuccess) {
    const className = isSuccess ? 'alert-success' : 'alert-danger';
    const alert = `<div class="alert ${className} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    $('.modal-body .alert').remove();
    $('.modal-body form').first().before(alert);
}

// بارگذاری لیست‌ها در مودال‌ها
function initModalLoaders() {
    $('#departmentModal').on('show.bs.modal', function () {
        $.get('modules/buildings.php', function (buildings) {
            let options = '<option value="">انتخاب ساختمان</option>';
            buildings.forEach(b => options += `<option value="${b.id}">${b.name}</option>`);
            $('#departmentForm select[name="building_id"]').html(options);
        });
    });

    $('#switchModal').on('show.bs.modal', function () {
        $.get('modules/departments.php', function (depts) {
            let options = '<option value="">انتخاب دپارتمان</option>';
            depts.forEach(d => options += `<option value="${d.id}">${d.name} (${d.building_name})</option>`);
            $('#switchForm select[name="department_id"]').html(options);
        });
    });

    $('#deviceModal').on('show.bs.modal', function () {
        $.get('modules/switches.php', function (switches) {
            let options = '<option value="">انتخاب سوئیچ</option>';
            switches.forEach(s => options += `<option value="${s.id}">${s.name} (${s.department_name || ''})</option>`);
            $('#deviceForm select[name="switch_id"]').html(options);
        });
    });
}