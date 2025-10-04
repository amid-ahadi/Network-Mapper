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

        // --- اضافه کردن گره‌ها به ترتیب سلسله مراتب ---
        // 1. ساختمان‌ها
        filteredBuildings.forEach(b => {
            nodes.add({ 
                id: `b${b.id}`, 
                label: `ساختمان:\n${b.name}`, 
                group: 'building',
                level: 0 // سطح بالاترین
            });
        });

        // 2. دپارتمان‌ها
        filteredDepartments.forEach(d => {
            nodes.add({ 
                id: `d${d.id}`, 
                label: `دپارتمان:\n${d.name}`, 
                group: 'department',
                level: 1
            });
            // اتصال به ساختمان والد
            if (filteredBuildings.some(b => b.id == d.building_id)) {
                edges.add({ from: `b${d.building_id}`, to: `d${d.id}` });
            }
        });

        // 3. سوئیچ‌ها
        const relevantSwitches = switches.filter(s => 
            filteredDepartments.some(d => d.id == s.department_id)
        );
        relevantSwitches.forEach(s => {
            nodes.add({ 
                id: `s${s.id}`, 
                label: `سوئیچ:\n${s.name}\n${s.ip_address}`, 
                group: 'switch',
                level: 2
            });
            edges.add({ from: `d${s.department_id}`, to: `s${s.id}` });
        });

        // 4. دستگاه‌ها
        const relevantSwitchIds = relevantSwitches.map(s => s.id);
        const relevantDevices = devices.filter(d => 
            relevantSwitchIds.includes(d.switch_id) ||
            filteredDepartments.some(dep => dep.id == d.department_id)
        );
        relevantDevices.forEach(d => {
            nodes.add({ 
                id: `dev${d.id}`, 
                label: `${d.type}:\n${d.name}\n${d.ip_address}`, 
                group: 'device',
                level: 3
            });
            // اتصال منطقی به دپارتمان (خط‌چین)
            if (filteredDepartments.some(dep => dep.id == d.department_id)) {
                edges.add({ 
                    from: `d${d.department_id}`, 
                    to: `dev${d.id}`, 
                    dashes: true, 
                    color: { color: '#999' }
                });
            }
            // اتصال فیزیکی به سوئیچ (خط پیوسته)
            if (relevantSwitchIds.includes(d.switch_id)) {
                edges.add({ from: `s${d.switch_id}`, to: `dev${d.id}` });
            }
        });

        // 5. ارتباطات دستی (اختیاری)
        connections.forEach(c => {
            const fromId = (c.source_type === 'switch' ? 's' : 'dev') + c.source_id;
            const toId = (c.target_type === 'switch' ? 's' : 'dev') + c.target_id;
            if (nodes.get(fromId) && nodes.get(toId)) {
                edges.add({
                    from: fromId,
                    to: toId,
                    label: `${c.cable_type}\n${c.port_from} → ${c.port_to}`,
                    arrows: 'to, from',
                    color: { color: '#d35400' }
                });
            }
        });

        // --- تنظیمات نمایش ---
        const container = document.getElementById('networkMap');
        const data = { nodes, edges };
        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD',        // Up → Down
                    sortMethod: 'directed', // جهت‌دار بر اساس لبه‌ها
                    nodeSpacing: 180,       // فاصله افقی
                    levelSeparation: 140,   // فاصله عمودی بین سطوح
                    treeSpacing: 200        // فاصله بین درخت‌ها
                }
            },
            physics: false, // غیرفعال برای ثبات سلسله مراتب
            interaction: {
                dragNodes: false, // جلوگیری از جابجایی دستی (اختیاری)
                zoomView: true,
                dragView: true
            },
            edges: {
                smooth: {
                    enabled: true,
                    type: 'cubicBezier',
                    roundness: 0.6
                },
                arrows: {
                    to: { enabled: true, scaleFactor: 0.8 }
                },
                color: { color: '#555' },
                font: { size: 10, face: 'Tahoma', align: 'horizontal' }
            },
            groups: {
                building: { 
                    color: { background: '#e3f2fd', border: '#1976d2' },
                    shape: 'box',
                    font: { bold: true, size: 14 }
                },
                department: { 
                    color: { background: '#f3e5f5', border: '#7b1fa2' },
                    shape: 'box',
                    font: { size: 13 }
                },
                switch: { 
                    color: { background: '#e8f5e9', border: '#388e3c' },
                    shape: 'ellipse',
                    font: { size: 12 }
                },
                device: { 
                    color: { background: '#fff3e0', border: '#f57c00' },
                    shape: 'ellipse',
                    font: { size: 12 }
                }
            }
        };

        new vis.Network(container, data, options);
    }).catch(err => {
        console.error('خطا در بارگذاری نقشه:', err);
    });
}

// تابع عمومی برای بارگذاری بدون فیلتر (در صورت نیاز)
function loadNetworkMap() {
    loadNetworkMapWithFilters();
}