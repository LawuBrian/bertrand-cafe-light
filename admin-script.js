/**
 * Admin Dashboard Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initNavigation();
    initDashboard();
    setCurrentDate();
});

/**
 * Login Handler
 */
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if already logged in
    if (localStorage.getItem('bertrand_admin_logged_in') === 'true') {
        showDashboard();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin123' && password === 'admin123') {
                localStorage.setItem('bertrand_admin_logged_in', 'true');
                showDashboard();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('bertrand_admin_logged_in');
            showLogin();
        });
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'flex';
    }

    function showLogin() {
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
    }
}

/**
 * Navigation
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    const viewAllLinks = document.querySelectorAll('.view-all');

    const titles = {
        'overview': 'Dashboard',
        'reservations': 'Reservations',
        'lounges': 'Lounge Management',
        'menu': 'Menu Items',
        'waitlist': 'Waitlist'
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });

    viewAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });

    function switchSection(sectionId) {
        // Update nav
        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

        // Update sections
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`section-${sectionId}`)?.classList.add('active');

        // Update title
        if (pageTitle) {
            pageTitle.textContent = titles[sectionId] || 'Dashboard';
        }
    }
}

/**
 * Dashboard Data
 */
function initDashboard() {
    loadReservations();
    loadWaitlist();
    updateStats();
}

/**
 * Set Current Date
 */
function setCurrentDate() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

/**
 * Load Reservations
 */
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('bertrand_reservations') || '[]');
    const tableBody = document.getElementById('reservationsTableBody');
    const recentDiv = document.getElementById('recentReservations');

    if (reservations.length === 0) {
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No reservations found</td></tr>';
        }
        if (recentDiv) {
            recentDiv.innerHTML = '<p class="empty-state">No reservations yet</p>';
        }
        return;
    }

    // Populate table
    if (tableBody) {
        tableBody.innerHTML = reservations.map(r => `
            <tr>
                <td>${r.firstName} ${r.lastName}</td>
                <td>${r.type || 'Dining'}</td>
                <td>${r.date}</td>
                <td>${r.time}</td>
                <td>${r.guests}</td>
                <td><span class="status-badge ${r.status}">${r.status}</span></td>
                <td>
                    <button class="btn-icon edit" onclick="editReservation('${r.id}')">✏️</button>
                    <button class="btn-icon delete" onclick="deleteReservation('${r.id}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // Populate recent
    if (recentDiv) {
        const recent = reservations.slice(-3).reverse();
        recentDiv.innerHTML = recent.map(r => `
            <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(184, 149, 108, 0.1);">
                <strong>${r.firstName} ${r.lastName}</strong>
                <span style="color: #8a8070; font-size: 0.85rem;"> - ${r.date} at ${r.time}</span>
            </div>
        `).join('');
    }
}

/**
 * Load Waitlist
 */
function loadWaitlist() {
    const waitlist = JSON.parse(localStorage.getItem('bertrand_waitlist') || '[]');
    const tableBody = document.getElementById('waitlistTableBody');

    if (waitlist.length === 0) {
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No waitlist signups yet</td></tr>';
        }
        return;
    }

    if (tableBody) {
        tableBody.innerHTML = waitlist.map(w => `
            <tr>
                <td>${w.name}</td>
                <td>${w.email}</td>
                <td>${w.timePreference || '-'}</td>
                <td>${new Date(w.timestamp).toLocaleDateString()}</td>
                <td>
                    <button class="btn-icon delete" onclick="deleteWaitlistEntry('${w.email}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
}

/**
 * Update Stats
 */
function updateStats() {
    const reservations = JSON.parse(localStorage.getItem('bertrand_reservations') || '[]');
    const waitlist = JSON.parse(localStorage.getItem('bertrand_waitlist') || '[]');
    const today = new Date().toISOString().split('T')[0];

    const todayReservations = reservations.filter(r => r.date === today).length;

    document.getElementById('todayReservations').textContent = todayReservations;
    document.getElementById('waitlistCount').textContent = waitlist.length;
}

/**
 * Delete Reservation
 */
function deleteReservation(id) {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    let reservations = JSON.parse(localStorage.getItem('bertrand_reservations') || '[]');
    reservations = reservations.filter(r => r.id != id);
    localStorage.setItem('bertrand_reservations', JSON.stringify(reservations));

    loadReservations();
    updateStats();
}

/**
 * Delete Waitlist Entry
 */
function deleteWaitlistEntry(email) {
    if (!confirm('Are you sure you want to remove this entry?')) return;

    let waitlist = JSON.parse(localStorage.getItem('bertrand_waitlist') || '[]');
    waitlist = waitlist.filter(w => w.email !== email);
    localStorage.setItem('bertrand_waitlist', JSON.stringify(waitlist));

    loadWaitlist();
    updateStats();
}

/**
 * Export Waitlist
 */
document.getElementById('exportWaitlistBtn')?.addEventListener('click', () => {
    const waitlist = JSON.parse(localStorage.getItem('bertrand_waitlist') || '[]');
    if (waitlist.length === 0) {
        alert('No data to export');
        return;
    }

    const csv = 'Name,Email,Time Preference,Date\n' +
        waitlist.map(w => `${w.name},${w.email},${w.timePreference || ''},${w.timestamp}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bertrand_waitlist.csv';
    a.click();
});
