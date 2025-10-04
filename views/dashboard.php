<!-- مودال ساختمان‌ها -->
<div class="modal fade" id="buildingModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">مدیریت ساختمان‌ها</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="buildingForm">
                    <input type="hidden" name="id">
                    <div class="mb-3">
                        <label class="form-label">نام ساختمان</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">ذخیره</button>
                </form>
                <hr>
                <div id="buildingsList"></div>
            </div>
        </div>
    </div>
</div>

<!-- مودال دپارتمان‌ها -->
<div class="modal fade" id="departmentModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">مدیریت دپارتمان‌ها</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="departmentForm">
                    <input type="hidden" name="id">
                    <div class="mb-3">
                        <label class="form-label">ساختمان</label>
                        <select name="building_id" class="form-select" required></select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">نام دپارتمان</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">ذخیره</button>
                </form>
                <hr>
                <div id="departmentsList"></div>
            </div>
        </div>
    </div>
</div>

<!-- مودال سوئیچ‌ها -->
<div class="modal fade" id="switchModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">مدیریت سوئیچ‌ها</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="switchForm">
                    <input type="hidden" name="id">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">نام</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">مدل</label>
                            <input type="text" name="model" class="form-control" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">موقعیت</label>
                        <input type="text" name="location" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">دپارتمان</label>
                        <select name="department_id" class="form-select" required>
                            <option value="">انتخاب دپارتمان</option>
                        </select>
                    </div>
                    <div class="row">
                      <div class="col-md-6 mb-3">
                           <label class="form-label">آدرس IP</label>
                           <input type="text" name="ip_address" class="form-control" required>
                     </div>
                      <div class="col-md-6 mb-3">
                       <label class="form-label">آدرس MAC</label>
                    <input type="text" name="mac_address" class="form-control" required>
                    </div>
                    </div>
                    <button type="submit" class="btn btn-primary">ذخیره</button>
                </form>
                <hr>
                <div id="switchesList"></div>
            </div>
        </div>
    </div>
</div>

<!-- مودال دستگاه‌ها -->
<div class="modal fade" id="deviceModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">مدیریت دستگاه‌ها</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="deviceForm">
                    <input type="hidden" name="id">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">نام</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">نوع</label>
                            <input type="text" name="type" class="form-control" placeholder="کامپیوتر، پرینتر، ..." required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">آدرس IP</label>
                            <input type="text" name="ip_address" class="form-control">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">آدرس MAC</label>
                            <input type="text" name="mac_address" class="form-control">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">دپارتمان</label>
                        <select name="department_id" class="form-select" required>
                            <option value="">انتخاب دپارتمان</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">سوئیچ</label>
                        <select name="switch_id" class="form-select" required>
                            <option value="">انتخاب سوئیچ</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">ذخیره</button>
                </form>
                <hr>
                <div id="devicesList"></div>
            </div>
        </div>
    </div>
</div>

<!-- مودال ارتباطات -->
<div class="modal fade" id="connectionModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">مدیریت ارتباطات</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="connectionForm">
                    <input type="hidden" name="id">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">منبع</label>
                            <select name="source_type" class="form-select" required>
                                <option value="switch">سوئیچ</option>
                                <option value="device">دستگاه</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">مقصد</label>
                            <select name="target_type" class="form-select" required>
                                <option value="switch">سوئیچ</option>
                                <option value="device">دستگاه</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">انتخاب منبع</label>
                            <select name="source_id" class="form-select" required></select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">انتخاب مقصد</label>
                            <select name="target_id" class="form-select" required></select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">نوع کابل</label>
                            <input type="text" name="cable_type" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">پورت منبع</label>
                            <input type="text" name="port_from" class="form-control" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">پورت مقصد</label>
                            <input type="text" name="port_to" class="form-control" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">ذخیره</button>
                </form>
                <hr>
                <div id="connectionsList"></div>
            </div>
        </div>
    </div>
</div>

<!-- مودال تنظیمات -->
<div class="modal fade" id="settingsModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">تنظیمات کاربری</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="settingsForm">
                    <div class="mb-3">
                        <label class="form-label">رمز عبور فعلی</label>
                        <input type="password" name="current_password" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">رمز عبور جدید</label>
                        <input type="password" name="new_password" class="form-control" minlength="6" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">تکرار رمز عبور جدید</label>
                        <input type="password" name="confirm_password" class="form-control" minlength="6" required>
                    </div>
                    <button type="submit" class="btn btn-warning">تغییر رمز عبور</button>
                </form>
            </div>
        </div>
    </div>
</div>