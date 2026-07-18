/**
 * app.js
 * Frontend application logic for School Fees Management System.
 * Single Page Application (SPA) that communicates with Java backend via REST APIs.
 */

const API_BASE = '';

// ===== AUTHENTICATION =====

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('isLoggedIn', 'true');
            showPage('app-page');
            loadDashboard();
            loadAllFees();
        } else {
            showError('login-error', 'Invalid username or password');
        }
    } catch (err) {
        showError('login-error', 'Server connection failed');
    }
});

document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    showPage('login-page');
});

// Check login on load
if (localStorage.getItem('isLoggedIn') === 'true') {
    showPage('app-page');
    loadDashboard();
    loadAllFees();
}

// ===== NAVIGATION =====

document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        showSection(page);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        if (page === 'students') loadStudents();
        if (page === 'fees') loadAllFees();
        if (page === 'reports') clearReports();
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// ===== DASHBOARD =====

async function loadDashboard() {
    try {
        const response = await fetch('/api/reports/dashboard');
        const data = await response.json();
        document.getElementById('dash-total-students').textContent = data.totalStudents || 0;
        document.getElementById('dash-pending').textContent = data.pendingFees || 0;
        document.getElementById('dash-partial').textContent = data.partialPayments || 0;
        document.getElementById('dash-paid').textContent = data.fullyPaid || 0;
        document.getElementById('dash-collection').textContent = 'Rs. ' + (data.totalCollection || 0).toLocaleString();
    } catch (err) {
        showToast('Failed to load dashboard');
    }
}

// ===== STUDENTS =====

async function loadStudents() {
    try {
        const response = await fetch('/api/students');
        const students = await response.json();
        renderStudentsTable(students);
    } catch (err) {
        showToast('Failed to load students');
    }
}

function renderStudentsTable(students) {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = students.map(s => `
        <tr>
            <td>${s.studentId}</td>
            <td>${s.name}</td>
            <td>${s.class}</td>
            <td>${s.section}</td>
            <td>${s.rollNumber}</td>
            <td>${s.parentName || '-'}</td>
            <td>${s.mobileNumber || '-'}</td>
            <td>
                <button class="btn btn-small btn-primary" onclick="editStudent(${s.studentId})">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteStudent(${s.studentId})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showStudentForm() {
    document.getElementById('student-form-container').classList.remove('hidden');
    document.getElementById('student-form-title').textContent = 'Add Student';
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
}

function hideStudentForm() {
    document.getElementById('student-form-container').classList.add('hidden');
}

async function editStudent(id) {
    try {
        const response = await fetch(`/api/students/${id}`);
        const student = await response.json();
        
        document.getElementById('student-id').value = student.studentId;
        document.getElementById('s-name').value = student.name;
        document.getElementById('s-class').value = student.class;
        document.getElementById('s-section').value = student.section;
        document.getElementById('s-roll').value = student.rollNumber;
        document.getElementById('s-parent').value = student.parentName || '';
        document.getElementById('s-mobile').value = student.mobileNumber || '';
        document.getElementById('s-address').value = student.address || '';
        
        document.getElementById('student-form-title').textContent = 'Edit Student';
        document.getElementById('student-form-container').classList.remove('hidden');
    } catch (err) {
        showToast('Failed to load student');
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
        const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            showToast('Student deleted');
            loadStudents();
            loadDashboard();
        }
    } catch (err) {
        showToast('Failed to delete student');
    }
}

document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const student = {
        name: document.getElementById('s-name').value,
        class: document.getElementById('s-class').value,
        section: document.getElementById('s-section').value,
        rollNumber: document.getElementById('s-roll').value,
        parentName: document.getElementById('s-parent').value,
        mobileNumber: document.getElementById('s-mobile').value,
        address: document.getElementById('s-address').value
    };
    
    try {
        if (id) {
            student.studentId = id;
            const response = await fetch('/api/students', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            const data = await response.json();
            if (data.success) showToast('Student updated');
        } else {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            const data = await response.json();
            if (data.success) showToast('Student added with ID: ' + data.studentId);
        }
        hideStudentForm();
        loadStudents();
        loadDashboard();
    } catch (err) {
        showToast('Operation failed');
    }
});

async function searchStudents() {
    const keyword = document.getElementById('student-search').value;
    if (!keyword) { loadStudents(); return; }
    try {
        const response = await fetch(`/api/students?search=${encodeURIComponent(keyword)}`);
        const students = await response.json();
        renderStudentsTable(students);
    } catch (err) {
        showToast('Search failed');
    }
}

// ===== FEES =====

let currentStudentIdForFee = null;

async function loadAllFees() {
    try {
        const response = await fetch('/api/fees');
        const fees = await response.json();
        const tbody = document.getElementById('fees-table-body');
        tbody.innerHTML = fees.map(f => `
            <tr>
                <td>${f.feeId}</td>
                <td>${f.studentName}</td>
                <td>${f.rollNumber}</td>
                <td>Rs. ${f.totalFees}</td>
                <td>Rs. ${f.paidAmount}</td>
                <td>Rs. ${f.remainingAmount}</td>
                <td><span class="status-badge ${f.status.toLowerCase()}">${f.status}</span></td>
            </tr>
        `).join('');
    } catch (err) {
        showToast('Failed to load fees');
    }
}

async function viewStudentFee() {
    const id = document.getElementById('fee-student-id').value;
    if (!id) { showToast('Enter Student ID'); return; }
    
    try {
        const response = await fetch(`/api/fees/student/${id}`);
        if (!response.ok) { showToast('Fee record not found'); return; }
        const fee = await response.json();
        
        currentStudentIdForFee = id;
        document.getElementById('fee-student-name').textContent = fee.studentName;
        document.getElementById('fee-roll').textContent = fee.rollNumber;
        document.getElementById('fee-total').textContent = 'Rs. ' + fee.totalFees;
        document.getElementById('fee-paid').textContent = 'Rs. ' + fee.paidAmount;
        document.getElementById('fee-remaining').textContent = 'Rs. ' + fee.remainingAmount;
        
        const statusEl = document.getElementById('fee-status');
        statusEl.textContent = fee.status;
        statusEl.className = 'status-badge ' + fee.status.toLowerCase();
        
        document.getElementById('fee-details').classList.remove('hidden');
    } catch (err) {
        showToast('Failed to load fee details');
    }
}

function showPaymentForm() {
    if (!currentStudentIdForFee) { showToast('View a student fee first'); return; }
    document.getElementById('payment-form-container').classList.remove('hidden');
}

function hidePaymentForm() {
    document.getElementById('payment-form-container').classList.add('hidden');
}

document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payment = {
        studentId: currentStudentIdForFee,
        amount: document.getElementById('pay-amount').value,
        paymentMode: document.getElementById('pay-mode').value
    };
    
    try {
        const response = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment)
        });
        const data = await response.json();
        if (data.success) {
            showToast('Payment successful! Status: ' + data.status);
            hidePaymentForm();
            viewStudentFee();
            loadAllFees();
            loadDashboard();
        } else {
            showToast(data.error || 'Payment failed');
        }
    } catch (err) {
        showToast('Payment failed');
    }
});

function showUpdateFeeForm() {
    if (!currentStudentIdForFee) { showToast('View a student fee first'); return; }
    document.getElementById('update-fee-form-container').classList.remove('hidden');
}

function hideUpdateFeeForm() {
    document.getElementById('update-fee-form-container').classList.add('hidden');
}

document.getElementById('update-fee-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        studentId: currentStudentIdForFee,
        totalFees: document.getElementById('new-total-fee').value
    };
    
    try {
        const response = await fetch('/api/fees/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showToast('Total fee updated');
            hideUpdateFeeForm();
            viewStudentFee();
            loadAllFees();
        }
    } catch (err) {
        showToast('Update failed');
    }
});

// ===== PAYMENTS & RECEIPTS =====

async function viewPaymentHistory() {
    const id = document.getElementById('history-student-id').value;
    if (!id) { showToast('Enter Student ID'); return; }
    
    try {
        const response = await fetch(`/api/payments/history?studentId=${id}`);
        const payments = await response.json();
        const tbody = document.getElementById('payments-table-body');
        tbody.innerHTML = payments.map(p => `
            <tr>
                <td>${p.paymentId}</td>
                <td>${p.studentName}</td>
                <td>Rs. ${p.amountPaid}</td>
                <td>${p.paymentDate}</td>
                <td>${p.paymentMode}</td>
            </tr>
        `).join('');
    } catch (err) {
        showToast('Failed to load payment history');
    }
}

async function generateReceipt() {
    const id = document.getElementById('history-student-id').value;
    if (!id) { showToast('Enter Student ID'); return; }
    
    try {
        const response = await fetch(`/api/fees/receipt/${id}`);
        if (!response.ok) { showToast('No receipt available'); return; }
        const data = await response.json();
        
        document.getElementById('receipt-content').innerHTML = `
            <div class="receipt-header">
                <h2>SCHOOL FEES RECEIPT</h2>
                <p>Receipt No: RCP-${data.payment.paymentId}</p>
                <p>Date: ${data.payment.paymentDate}</p>
            </div>
            <div class="receipt-body">
                <p><strong>Student:</strong> ${data.student.name}</p>
                <p><strong>Class/Section:</strong> ${data.student.class}/${data.student.section}</p>
                <p><strong>Roll Number:</strong> ${data.student.rollNumber}</p>
                <hr>
                <p><strong>Total Fees:</strong> Rs. ${data.fee.totalFees}</p>
                <p><strong>Paid Amount:</strong> Rs. ${data.fee.paidAmount}</p>
                <p><strong>This Payment:</strong> Rs. ${data.payment.amountPaid}</p>
                <p><strong>Remaining:</strong> Rs. ${data.fee.remainingAmount}</p>
                <p><strong>Status:</strong> ${data.fee.status}</p>
                <p><strong>Payment Mode:</strong> ${data.payment.paymentMode}</p>
            </div>
            <div class="receipt-footer">
                <p>Thank you for your payment!</p>
            </div>
        `;
        document.getElementById('receipt-container').classList.remove('hidden');
    } catch (err) {
        showToast('Failed to generate receipt');
    }
}

function printReceipt() {
    window.print();
}

// ===== REPORTS =====

function clearReports() {
    document.getElementById('report-content').innerHTML = '';
}

async function showPendingReport() {
    try {
        const response = await fetch('/api/reports/pending');
        const data = await response.json();
        const html = `
            <h3>Pending Fees Report</h3>
            <table class="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Roll No</th><th>Total</th><th>Paid</th><th>Remaining</th><th>Status</th></tr></thead>
                <tbody>${data.map(s => `
                    <tr>
                        <td>${s.studentId}</td>
                        <td>${s.name}</td>
                        <td>${s.class}</td>
                        <td>${s.rollNumber}</td>
                        <td>Rs. ${s.totalFees}</td>
                        <td>Rs. ${s.paidAmount}</td>
                        <td>Rs. ${s.remainingAmount}</td>
                        <td><span class="status-badge ${s.status.toLowerCase()}">${s.status}</span></td>
                    </tr>
                `).join('')}</tbody>
            </table>
        `;
        document.getElementById('report-content').innerHTML = html;
    } catch (err) {
        showToast('Failed to load report');
    }
}

async function showCollectionReport() {
    try {
        const response = await fetch('/api/reports/collection');
        const data = await response.json();
        const html = `
            <h3>Total Collection Report</h3>
            <div class="stats-grid">
                <div class="stat-card blue"><h3>Total Transactions</h3><p class="stat-value">${data.totalTransactions}</p></div>
                <div class="stat-card green"><h3>Total Collected</h3><p class="stat-value">Rs. ${data.totalCollected.toLocaleString()}</p></div>
                <div class="stat-card purple"><h3>Total Fees Assigned</h3><p class="stat-value">Rs. ${data.totalFeesAssigned.toLocaleString()}</p></div>
                <div class="stat-card orange"><h3>Total Fees Pending</h3><p class="stat-value">Rs. ${data.totalFeesPending.toLocaleString()}</p></div>
                <div class="stat-card red"><h3>Collection Rate</h3><p class="stat-value">${data.collectionRate.toFixed(2)}%</p></div>
        `;
        document.getElementById('report-content').innerHTML = html;
    } catch (err) {
        showToast('Failed to load report');
    }
}

async function showClasswiseReport() {
    try {
        const response = await fetch('/api/reports/classwise');
        const data = await response.json();
        const html = `
            <h3>Class-wise Fee Summary</h3>
            <table class="data-table">
                <thead><tr><th>Class</th><th>Students</th><th>Total Fees</th><th>Total Paid</th><th>Pending</th></tr></thead>
                <tbody>${data.map(c => `
                    <tr>
                        <td>${c.class}</td>
                        <td>${c.totalStudents}</td>
                        <td>Rs. ${c.totalFees.toLocaleString()}</td>
                        <td>Rs. ${c.totalPaid.toLocaleString()}</td>
                        <td>Rs. ${c.totalPending.toLocaleString()}</td>
                    </tr>
                `).join('')}</tbody>
            </table>
        `;
        document.getElementById('report-content').innerHTML = html;
    } catch (err) {
        showToast('Failed to load report');
    }
}

// ===== UTILITIES =====

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
