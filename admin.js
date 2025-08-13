// Admin Functions
// PhysioTherapy Management System

// Admin tab management
function showAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.remove('border-indigo-500', 'text-indigo-600');
        t.classList.add('border-transparent', 'text-gray-500');
    });
    document.querySelectorAll('.admin-content').forEach(c => c.classList.add('hidden'));
    
    document.getElementById(tab + '-tab').classList.remove('border-transparent', 'text-gray-500');
    document.getElementById(tab + '-tab').classList.add('border-indigo-500', 'text-indigo-600');
    showElement(tab + '-content');
}

function loadAdminData() {
    loadEditorsList();
    loadPhysiotherapistsList();
    loadPatientsList();
    loadAdminsList();
    loadMonthlyStatistics();
}

// Editor management
function addEditor(event) {
    event.preventDefault();
    const name = document.getElementById('editor-name').value;
    const email = document.getElementById('editor-email').value;
    
    if (!validateEmail(email)) {
        showCustomModal('Invalid Email', 'Please enter a valid email address.', null, false);
        return;
    }
    
    if (data.editors.find(e => e.email === email)) {
        showCustomModal('Error', 'Editor with this email already exists.', null, false);
        return;
    }
    
    data.editors.push({ name, email, id: Date.now() });
    document.getElementById('editor-name').value = '';
    document.getElementById('editor-email').value = '';
    loadEditorsList();
    createNotification('Success', 'Editor added successfully!', 'success');
}

function loadEditorsList() {
    const tbody = document.getElementById('editors-tbody');
    tbody.innerHTML = '';
    
    data.editors.forEach(editor => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${editor.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${editor.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <button onclick="removeEditor(${editor.id})" class="text-red-600 hover:text-red-900 transition-colors">Remove</button>
            </td>
        `;
    });
}

function removeEditor(id) {
    showCustomModal('Confirm Removal', 'Are you sure you want to remove this editor?', () => {
        data.editors = data.editors.filter(e => e.id !== id);
        loadEditorsList();
        createNotification('Success', 'Editor removed successfully.', 'success');
    });
}

// Physiotherapist management
function addPhysiotherapist(event) {
    event.preventDefault();
    const name = document.getElementById('physio-name').value;
    const email = document.getElementById('physio-email-add').value;
    const specialization = document.getElementById('physio-specialization').value;
    const phone = document.getElementById('physio-phone').value;
    
    // Validation
    if (!validateEmail(email)) {
        showCustomModal('Invalid Email', 'Please enter a valid email address.', null, false);
        return;
    }
    
    if (!validatePhone(phone)) {
        showCustomModal('Invalid Phone', 'Please enter a valid Bahrain phone number (e.g., +973-1234-5678).', null, false);
        return;
    }
    
    if (data.physiotherapists.find(p => p.email === email)) {
        showCustomModal('Error', 'Physiotherapist with this email already exists.', null, false);
        return;
    }
    
    data.physiotherapists.push({ 
        name, 
        email, 
        specialization, 
        phone, 
        password: 'physio123',
        id: Date.now(),
        createdAt: new Date().toISOString()
    });
    
    // Clear form
    document.getElementById('physio-name').value = '';
    document.getElementById('physio-email-add').value = '';
    document.getElementById('physio-specialization').value = '';
    document.getElementById('physio-phone').value = '';
    
    loadPhysiotherapistsList();
    updatePhysiotherapistSelect();
    createNotification('Success', 'Physiotherapist added successfully! Default password is "physio123".', 'success');
}

function loadPhysiotherapistsList() {
    const tbody = document.getElementById('physiotherapists-tbody');
    tbody.innerHTML = '';
    
    data.physiotherapists.forEach(physio => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${physio.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${physio.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${physio.specialization}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${physio.phone}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <button onclick="editPhysiotherapist(${physio.id})" class="text-green-600 hover:text-green-900 mr-2 transition-colors">Edit</button>
                <button onclick="removePhysiotherapist(${physio.id})" class="text-red-600 hover:text-red-900 transition-colors">Remove</button>
            </td>
        `;
    });
}

function removePhysiotherapist(id) {
    showCustomModal('Confirm Removal', 'Are you sure you want to remove this physiotherapist? This will also remove all their appointments.', () => {
        // Remove physiotherapist
        data.physiotherapists = data.physiotherapists.filter(p => p.id !== id);
        
        // Remove all appointments for this physiotherapist
        data.appointments = data.appointments.filter(apt => apt.physiotherapistId !== id);
        
        loadPhysiotherapistsList();
        updatePhysiotherapistSelect();
        createNotification('Success', 'Physiotherapist and associated appointments removed successfully.', 'success');
    });
}

// Patient management
function loadPatientsList() {
    const tbody = document.getElementById('patients-tbody');
    tbody.innerHTML = '';
    
    data.patients.forEach(patient => {
        const row = tbody.insertRow();
        const appointmentCount = data.appointments.filter(apt => apt.patientId === patient.id).length;
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${patient.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${patient.cpr}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${patient.phone}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${patient.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <button onclick="viewPatientDetails(${patient.id})" class="text-blue-600 hover:text-blue-900 mr-2 transition-colors">View Details</button>
                <button onclick="editPatient(${patient.id})" class="text-green-600 hover:text-green-900 mr-2 transition-colors">Edit</button>
                <button onclick="viewPatientFile(${patient.id})" class="text-purple-600 hover:text-purple-900 transition-colors">Medical File</button>
            </td>
        `;
    });
}

function viewPatientDetails(patientId) {
    const patient = data.patients.find(p => p.id === patientId);
    if (patient) {
        const appointmentCount = data.appointments.filter(apt => apt.patientId === patient.id).length;
        const assignedPhysio = getCurrentPhysiotherapistForPatient(patient.id);
        
        const details = `
Name: ${patient.name}
CPR: ${patient.cpr}
Phone: ${patient.phone}
Email: ${patient.email}
Medical History: ${patient.history || 'None provided'}
Uploaded Files: ${patient.files ? patient.files.length : 0} files
Appointments: ${appointmentCount}
Assigned Physiotherapist: ${assignedPhysio ? `Dr. ${assignedPhysio.name}` : 'None'}
Review Status: ${patient.reviewed ? 'Reviewed' : 'Pending Review'}
        `;
        showCustomModal('Patient Details', details, null, false);
    }
}

// Admin management
function addAdmin(event) {
    event.preventDefault();
    const email = document.getElementById('admin-email-add').value;
    const password = document.getElementById('admin-password-add').value;
    
    if (!validateEmail(email)) {
        showCustomModal('Invalid Email', 'Please enter a valid email address.', null, false);
        return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showCustomModal('Invalid Password', passwordValidation.message, null, false);
        return;
    }
    
    if (data.admins.find(a => a.email === email)) {
        showCustomModal('Error', 'Admin with this email already exists.', null, false);
        return;
    }
    
    data.admins.push({ email, password, id: Date.now(), createdAt: new Date().toISOString() });
    document.getElementById('admin-email-add').value = '';
    document.getElementById('admin-password-add').value = '';
    loadAdminsList();
    createNotification('Success', 'Admin added successfully!', 'success');
}

function loadAdminsList() {
    const tbody = document.getElementById('admins-tbody');
    tbody.innerHTML = '';
    
    data.admins.forEach(admin => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${admin.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                ${admin.email === 'bmidharui@gmail.com' ? 
                    '<span class="text-blue-600 font-medium">Master Admin</span>' : 
                    `<button onclick="removeAdmin(${admin.id})" class="text-red-600 hover:text-red-900 transition-colors">Remove</button>`
                }
            </td>
        `;
    });
}

function removeAdmin(id) {
    showCustomModal('Confirm Removal', 'Are you sure you want to remove this admin?', () => {
        data.admins = data.admins.filter(a => a.id !== id);
        loadAdminsList();
        createNotification('Success', 'Admin removed successfully.', 'success');
    });
}

// Statistics functions
function loadMonthlyStatistics() {
    const container = document.getElementById('monthly-stats');
    container.innerHTML = '';
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Overall statistics card
    const totalPatients = data.patients.length;
    const totalPhysiotherapists = data.physiotherapists.length;
    const totalAppointments = data.appointments.length;
    const monthlyAppointments = data.appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
    });
    
    const overallCard = document.createElement('div');
    overallCard.className = 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow col-span-full';
    overallCard.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Statistics</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
                <p class="text-2xl font-bold text-blue-600">${totalPatients}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
            </div>
            <div class="text-center">
                <p class="text-2xl font-bold text-green-600">${totalPhysiotherapists}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Physiotherapists</p>
            </div>
            <div class="text-center">
                <p class="text-2xl font-bold text-purple-600">${totalAppointments}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Appointments</p>
            </div>
            <div class="text-center">
                <p class="text-2xl font-bold text-orange-600">${monthlyAppointments.length}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">This Month</p>
            </div>
        </div>
    `;
    container.appendChild(overallCard);
    
    // Individual physiotherapist statistics
    data.physiotherapists.forEach(physio => {
        const physioMonthlyAppointments = data.appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return apt.physiotherapistId === physio.id && 
                   aptDate.getMonth() === currentMonth && 
                   aptDate.getFullYear() === currentYear;
        });
        
        const completedAppointments = physioMonthlyAppointments.filter(apt => apt.status === 'completed');
        const totalPatients = new Set(physioMonthlyAppointments.map(apt => apt.patientId)).size;
        const completionRate = physioMonthlyAppointments.length > 0 ? 
            Math.round((completedAppointments.length / physioMonthlyAppointments.length) * 100) : 0;
        
        const statCard = document.createElement('div');
        statCard.className = 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow';
        statCard.innerHTML = `
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Dr. ${physio.name}</h3>
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Appointments:</span>
                    <span class="font-medium text-gray-900 dark:text-white">${physioMonthlyAppointments.length}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
                    <span class="font-medium text-green-600">${completedAppointments.length}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Unique Patients:</span>
                    <span class="font-medium text-blue-600">${totalPatients}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Completion Rate:</span>
                    <span class="font-medium text-purple-600">${completionRate}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div class="bg-purple-600 h-2 rounded-full transition-all duration-500" style="width: ${completionRate}%"></div>
                </div>
            </div>
        `;
        container.appendChild(statCard);
    });
}

// Update physiotherapist select dropdowns
function updatePhysiotherapistSelect() {
    const selects = [
        document.getElementById('select-physiotherapist'),
        document.getElementById('editor-physio-select')
    ];
    
    selects.forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Choose a physiotherapist...</option>';
            
            data.physiotherapists.forEach(physio => {
                const option = document.createElement('option');
                option.value = physio.id;
                option.textContent = `Dr. ${physio.name} - ${physio.specialization}`;
                select.appendChild(option);
            });
            
            // Restore previous selection if still valid
            if (currentValue && data.physiotherapists.find(p => p.id == currentValue)) {
                select.value = currentValue;
            }
        }
    });
}

// Export data functions (for backup/reporting)
function exportData(type) {
    let exportData;
    let filename;
    
    switch (type) {
        case 'patients':
            exportData = data.patients;
            filename = 'patients_export.json';
            break;
        case 'appointments':
            exportData = data.appointments;
            filename = 'appointments_export.json';
            break;
        case 'physiotherapists':
            exportData = data.physiotherapists;
            filename = 'physiotherapists_export.json';
            break;
        case 'all':
            exportData = data;
            filename = 'system_backup.json';
            break;
        default:
            return;
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    createNotification('Export Complete', `${type} data exported successfully.`, 'success');
}