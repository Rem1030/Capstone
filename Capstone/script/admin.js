document.addEventListener("DOMContentLoaded", function () {

    // =============== PAGE NAVIGATION ===============
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const pageId = item.getAttribute('data-page');
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById(pageId)?.classList.add('active');
        });
    });

    // =============== GREETING & LIVE CLOCK ===============
    const hour = new Date().getHours();
    document.getElementById("greeting").textContent = 
        `${hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"}, Admin Mejiro!`;

    function updateClock() {
        const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
        const formatted = new Date(now).toLocaleDateString("en-PH", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
            hour: "numeric", minute: "numeric", hour12: true
        }).replace(",", " •");
        document.getElementById("datetime").textContent = formatted;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // =============== TASK MODAL SYSTEM ===============
    const modal     = document.getElementById("taskModal");
    const openBtn   = document.getElementById("openTaskModal");
    const closeBtn  = document.getElementById("closeModal");
    const saveBtn   = document.getElementById("saveTask");
    const taskList  = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");

    openBtn.onclick = () => modal.style.display = "flex";
    closeBtn.onclick = () => modal.style.display = "none";
    modal.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

    function deleteTask(button) {
        const taskItem = button.closest(".task-item");
        taskItem.style.animation = "fadeOut 0.4s ease forwards";
        setTimeout(() => {
            taskItem.remove();
            taskCount.textContent = taskList.children.length;  
        }, 400);
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = function () { deleteTask(this); };
    });

    saveBtn.onclick = () => {
        const title    = document.getElementById("taskTitle").value.trim();
        const desc     = document.getElementById("taskDesc").value.trim();
        const priority = document.getElementById("taskPriority").value || "low";

        if (!title) {
            alert("Please enter a task title!");
            return;
        }

        const taskHTML = `
            <div class="task-item ${priority}">
                <i class="fa-solid fa-circle-dot"></i>
                <div class="task-content">
                    <strong>${title}</strong>
                    <small>${desc || "No details added"}</small>
                </div>
                ${priority === "high" ? '<span class="task-badge">URGENT</span>' : ""}
                <button class="delete-btn" title="Delete task">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;

        taskList.insertAdjacentHTML("afterbegin", taskHTML);
        taskCount.textContent = taskList.children.length;

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDesc").value = "";
        modal.style.display = "none";

        taskList.firstElementChild.querySelector(".delete-btn").onclick = function () {
            deleteTask(this);
        };
    };

    const pendingReports = [
        { id: "REP-2025-1241", officer: "Officer Goldship", type: "Reckless Imprudence Resulting in Homicide", location: "EDSA, Quezon City", time: "2 hours ago", priority: "" },
        { id: "REP-2025-1239", officer: "Officer Oguri", type: "Hit and Run", location: "420 Rosewood Highway", time: "4 hours ago", priority: "" },
        { id: "REP-2025-1237", officer: "Officer Manhattan", type: "DUI Incident", location: "Grand Bellhart", time: "6 hours ago", priority: "" },
        { id: "REP-2025-1235", officer: "Officer Tachyon", type: "Minor Traffic Accident", location: "City of Tears", time: "8 hours ago", priority: "" }
    ];

   function loadPendingReports() {
    const container = document.getElementById('pending-reports-list');
    const emptyState = document.getElementById('empty-state');

    if (pendingReports.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = pendingReports.map(report => `
        <div class="pending-item">
            <div class="pending-header">
                <i class="fa-solid fa-file-circle-exclamation"></i>
                <div>
                    <span class="report-id">${report.id}</span>
                    <span class="badge ${report.priority}">${report.priority.toUpperCase()}</span>
                </div>
            </div>
            <div class="pending-title">${report.type}</div>
            <div class="pending-meta">
                <span><i class="fa-solid fa-user"></i> ${report.officer}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${report.location}</span>
            </div>
            <div class="pending-footer">
                <small><i class="fa-solid fa-clock"></i> ${report.time}</small>
                <button class="btn-review" onclick="document.getElementById('notifications').classList.add('active'); document.querySelectorAll('.page:not(#notifications)').forEach(p => p.classList.remove('active')); window.scrollTo({top:0,behavior:'smooth'});">
                    Review <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}
loadPendingReports();


    const reportsData = [
        { title: "Traffic Accident – Main St & Oak Ave", officer: "Officer John Smith", date: "Nov 26, 2024 14:45", location: "Main St & Oak Ave, Downtown District", type: "Incident Report", priority: "MEDIUM", video: "assets/videos/traffic-accident.mp4", id: "RPT-2024-1142", summary: "Two-vehicle collision with minor injuries.", incidentDate: "Nov 26, 2024 13:30" },
        { title: "Shoplifting Arrest – Downtown Mall", officer: "Officer Sarah Johnson", date: "Nov 20, 2024 11:20", location: "Downtown Mall, Store #45", type: "Arrest Report", priority: "LOW", video: "assets/videos/shoplifting.mp4", id: "RPT-2024-1140", summary: "Suspect arrested for retail theft, merchandise valued at $247.", incidentDate: "Nov 20, 2024 10:45" },
        { title: "DUI Arrest – Highway 101", officer: "Sgt. Michael Reyes", date: "Dec 07, 2025 02:15", location: "Highway 101, Mile Marker 8", type: "DUI Report", priority: "HIGH", video: "assets/videos/dui-arrest.mp4", id: "RPT-2025-0008", summary: "Driver arrested for driving under the influence.", incidentDate: "Dec 07, 2025 01:40" }
    ];

    let currentReportIndex = null;

    
    document.querySelectorAll('.open-report-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentReportIndex = parseInt(this.getAttribute('data-index'));
            const r = reportsData[currentReportIndex];

            document.getElementById('modalReportTitle').textContent = r.title;
            document.getElementById('modalReportId').textContent = r.id;
            document.getElementById('modalOfficer').textContent = r.officer;
            document.getElementById('modalDate').textContent = r.date;
            document.getElementById('modalLocation').textContent = r.location;
            document.getElementById('modalType').textContent = r.type;
            document.getElementById('modalPriority').textContent = r.priority;
            document.getElementById('modalSummary').textContent = r.summary;

            const video = document.getElementById('evidenceVideo');
            video.querySelector('source').src = r.video;
            video.load();

            document.getElementById('reportDetailModal').style.display = 'flex';

            if (r.status === 'approved' || r.status === 'denied') {
            disableActionButtons();
        } else if (r.status === 'changes') {
            showResubmitButton();
        } else {
            enableActionButtons();
        }
        });
    });

    // OPEN CONFIRMATION MODALS (GLOBAL)
    window.openApproveModal = function() {
        const r = reportsData[currentReportIndex];
        document.getElementById('approveId').textContent = r.id;
        document.getElementById('approveTitle').textContent = r.title;
        document.getElementById('approveOfficer').textContent = r.officer;
        document.getElementById('approveDate').textContent = r.date;
        document.getElementById('approveType').textContent = r.type;
        document.getElementById('approveIncidentDate').textContent = r.incidentDate;
        document.getElementById('approveNote').value = '';
        document.getElementById('approveModal').style.display = 'flex';
    };

    window.openDenyModal = function() {
        const r = reportsData[currentReportIndex];
        document.getElementById('denyId').textContent = r.id;
        document.getElementById('denyTitle').textContent = r.title;
        document.getElementById('denyOfficer').textContent = r.officer;
        document.getElementById('denyDate').textContent = r.date;
        document.getElementById('denyType').textContent = r.type;
        document.getElementById('denyIncidentDate').textContent = r.incidentDate;
        document.getElementById('denyNote').value = '';
        document.getElementById('denyModal').style.display = 'flex';
    };

    window.openRequestChanges = function() {
        const r = reportsData[currentReportIndex];
        document.getElementById('reqId').textContent = r.id;
        document.getElementById('reqTitle').textContent = r.title;
        document.getElementById('reqOfficer').textContent = r.officer;
        document.getElementById('reqDate').textContent = r.date;
        document.getElementById('reqType').textContent = r.type;
        document.getElementById('reqIncidentDate').textContent = r.incidentDate;
        document.getElementById('reqNote').value = '';
        document.getElementById('requestChangesModal').style.display = 'flex';
    };

    // CLOSE ALL MODALS
    window.closeAllModals = function() {
        ['reportDetailModal', 'approveModal', 'denyModal', 'requestChangesModal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        document.getElementById('evidenceVideo').pause();
    };

  
    function updateReportStatus(index, status, note) {
        const badgeEl = document.getElementById(`badge-${index}`);
        const historyEl = document.getElementById(`review-history-${index}`);
        const date = new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        badgeEl.innerHTML = `
            <span class="badge-${status}">${status === 'approved' ? 'APPROVED' : status === 'denied' ? 'DENIED' : 'CHANGES REQUESTED'}</span>
            <span class="badge-${reportsData[index].priority.toLowerCase()}">${reportsData[index].priority}</span>
        `;

        historyEl.style.display = 'block';
        historyEl.innerHTML = `
            <strong>Reviewed by Admin Mejiro</strong> — ${date}<br>
            <small>${note || 'No note added'}</small>
        `;

        // Save status in data
        reportsData[index].status = status;
        reportsData[index].reviewedBy = "Admin Mejiro";
        reportsData[index].reviewDate = date;
        reportsData[index].reviewNote = note || '';
    }

    // FINAL ACTIONS
window.finalApprove = function() {
    const note = document.getElementById('approveNote').value.trim();
    if (!note) {
        alert("Review note is REQUIRED before approving.");
        return;
    }
    updateReportStatus(currentReportIndex, 'approved', note);
    disableActionButtons();
    closeAllModals();
};

window.finalDeny = function() {
    const note = document.getElementById('denyNote').value.trim();
    if (!note) {
        alert("Review note is REQUIRED for denial.");
        return;
    }
    updateReportStatus(currentReportIndex, 'denied', note);
    disableActionButtons();
    closeAllModals();
};

window.finalRequestChanges = function() {
    const note = document.getElementById('reqNote').value.trim();
    if (!note) {
        alert("Review note is REQUIRED when requesting changes.");
        return;
    }
    updateReportStatus(currentReportIndex, 'changes', note);
    showResubmitButton();
    closeAllModals();
};

// Utility functions
window.saveAsPDF = () => alert("Report saved as PDF!");
window.printReport = () => window.print();
window.forwardReport = () => alert("Report forwarded!");
   
    let allReports = [
        { id: "REP-2025-1241", title: "Rear-End Collision", officer: "Sgt. Michael Reyes", badge: "#0891", location: "EDSA Northbound, Quezon City", date: "2025-12-07", time: "09:15", status: "pending", notes: [] },
        { id: "REP-2025-1239", title: "Hit and Run Incident", officer: "PO2 Anna Cruz", badge: "#1045", location: "Commonwealth Ave", date: "2025-12-06", time: "15:22", status: "approved", notes: [{admin:"Admin Mejiro", action:"Approved", note:"Excellent documentation", date:"2025-12-06 16:40"}] },
        { id: "REP-2025-1235", title: "Minor Sideswipe", officer: "PO1 Juan Dela Cruz", badge: "#1123", location: "Katipunan Ave", date: "2025-12-07", time: "07:30", status: "pending", notes: [] },
    ];

    function renderReports(data = allReports) {
        const container = document.getElementById('reportsContainer');
        if (!container) return;
        container.innerHTML = '';

        data.forEach(report => {
            const card = document.createElement('div');
            card.className = `report-card-new ${report.status}`;
            card.innerHTML = `
                <div class="report-card-header">
                    <div class="report-id">${report.id}</div>
                    <span class="status-tag ${report.status}">${report.status === 'pending' ? 'PENDING REVIEW' : report.status.toUpperCase()}</span>
                </div>
                <div class="report-card-body">
                    <h3>${report.title}</h3>
                    <div class="report-info-grid">
                        <div><strong>Officer:</strong> ${report.officer}</div>
                        <div><strong>Badge:</strong> ${report.badge}</div>
                        <div><strong>Location:</strong> ${report.location}</div>
                        <div><strong>Submitted:</strong> ${report.date.replace('2025-', '')} • ${report.time}</div>
                    </div>
                </div>
                <div class="report-card-footer">
                    <div class="report-actions-new">
                        ${report.status === 'pending' ? `
                            <button class="btn-approve-new" onclick="showReviewForm('${report.id}', 'approved')">Approve</button>
                            <button class="btn-reject-new" onclick="showReviewForm('${report.id}', 'rejected')">Reject</button>
                        ` : ''}
                        <button class="btn-view-new" onclick="viewReport('${report.id}')">View Report</button>
                        ${report.status !== 'pending' ? `<button class="btn-download-new" onclick="downloadPDF('${report.id}')">Download PDF</button>` : ''}
                    </div>
                </div>
                <div class="review-form" id="review-${report.id}">
                    <textarea placeholder="Add note for officer (optional)" id="note-${report.id}"></textarea>
                    <div class="form-actions">
                        <button class="btn-submit-review" onclick="submitReview('${report.id}')">Submit Review</button>
                        <button class="btn-cancel-review" onclick="hideReviewForm('${report.id}')">Cancel</button>
                    </div>
                </div>
                ${report.notes.length > 0 ? `
                    <div class="review-history">
                        <strong>Review History:</strong>
                        ${report.notes.map(n => `
                            <div class="review-entry">
                                <span class="review-meta">${n.action} by ${n.admin}</span> — ${n.date}
                                <div class="review-note">${n.note}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }

    window.showReviewForm = function(id, action) {
        document.querySelectorAll('.review-form').forEach(f => f.style.display = 'none');
        document.getElementById(`review-${id}`).style.display = 'block';
        window.currentReviewAction = action;
        window.currentReviewId = id;
    };

    window.hideReviewForm = function(id) {
        document.getElementById(`review-${id}`).style.display = 'none';
    };

    window.submitReview = function(id) {
        const note = document.getElementById(`note-${id}`).value.trim();
        const report = allReports.find(r => r.id === id);
        if (report) {
            report.status = window.currentReviewAction;
            report.notes.push({
                admin: "Admin Mejiro",
                action: window.currentReviewAction === 'approved' ? 'Approved' : 'Rejected',
                note: note || 'No comment',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            });
            renderReports();
        }
    };

    window.viewReport = function(id) {
        const r = allReports.find(r => r.id === id);
        let msg = `REPORT: ${r.id}\nTitle: ${r.title}\nStatus: ${r.status.toUpperCase()}\n\n`;
        if (r.notes.length > 0) {
            msg += "REVIEW HISTORY:\n";
            r.notes.forEach(n => msg += `• ${n.action} by ${n.admin} — ${n.date}\n  "${n.note}"\n`);
        } else msg += "No review notes yet.";
        alert(msg);
    };

    window.downloadPDF = function(id) { alert(`Generating PDF for ${id}...`); };
    window.exportAllAsPDF = function() { alert("Exporting all reports as PDF bundle..."); };

    
    if (document.getElementById('reportsContainer')) renderReports();
});

function saveAsPDF() {
    alert("Report saved as PDF!");
  
}

function printReport() {
    window.print();
}

function forwardReport() {
    alert("Report forwarded to selected recipients.");
    
}

function requestChanges() {
    const note = prompt("Enter requested changes for the officer:");
    if (note) {
        alert("Changes requested:\n" + note);
       
    }
}


window.finalApprove = function() {
    const note = document.getElementById('approveNote').value.trim();
    updateReportStatus(currentReportIndex(), 'approved', note);
    disableActionButtons();
    closeAllModals();
};

window.finalDeny = function() {
    const note = document.getElementById('denyNote').value.trim();
    if (!note) { alert("Review note is REQUIRED for denial."); return; }
    updateReportStatus(currentIndex(), 'denied', note);
    disableActionButtons();
    closeAllModals();
};

window.finalRequestChanges = function() {
    const note = document.getElementById('reqNote').value.trim();
    if (!note) { alert("Review note is REQUIRED."); return; }
    updateReportStatus(currentIndex(), 'changes', note);
    showResubmitButton();
    closeAllModals();
};


window.officerResubmitted = function() {
    if (confirm("Mark this report as resubmitted and ready for re-review?")) {
        const index = currentIndex();
        updateReportStatus(index, 'pending', 'Resubmitted by officer');
        document.querySelector('.btn-resubmit').style.display = 'none';
        enableActionButtons();
        closeAllModals();
    }
};

// Helper functions
function currentIndex() { return currentReportIndex; }

function disableActionButtons() {
    document.querySelectorAll('.btn-approve, .btn-deny, .btn-request-changes').forEach(b => {
        b.disabled = true; b.style.opacity = '0.5'; b.style.cursor = 'not-allowed';
    });
    document.querySelector('.btn-resubmit').style.display = 'none';
}

function enableActionButtons() {
    document.querySelectorAll('.btn-approve, .btn-deny, .btn-request-changes').forEach(b => {
        b.disabled = false; b.style.opacity = '1'; b.style.cursor = 'pointer';
    });
}

function showResubmitButton() {
    document.querySelector('.btn-resubmit').style.display = 'inline-block';
}

window.closeAllModals = function() {
    document.getElementById('reportDetailModal').style.display = 'none';
    document.getElementById('evidenceVideo').pause();   
    document.getElementById('addCertModal').style.display = 'none';
document.getElementById('deleteCertModal').style.display = 'none';

   
    const modals = ['approveModal', 'denyModal', 'requestChangesModal'];
    modals.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}
function openProfileTab(tabName) {
    document.querySelectorAll('.profile-tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.profile-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    event.target.classList.add('active');
}

function openAddCertModal() {
    document.getElementById('addCertModal').style.display = 'flex';
}

function closeAddCertModal() {
    document.getElementById('addCertModal').style.display = 'none';
}

function addNewCertificate() {
    alert("Certification added successfully!");
    closeAddCertModal();
}

function openDeleteCertModal() {
    document.getElementById('deleteCertModal').style.display = 'flex';
}

function closeDeleteCertModal() {
    document.getElementById('deleteCertModal').style.display = 'none';
}

function confirmDeleteCertificate() {
    alert("Certification deleted permanently.");
    closeDeleteCertModal();
}
window.closeAllModals = function() {
    const modals = [
        'reportDetailModal',
        'approveModal',
        'denyModal',
        'requestChangesModal',
        'addCertModal',
        'deleteCertModal',
        'changePasswordModal',
        'backupCodesModal',
        'securityLogModal'
    ];

    modals.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const video = document.getElementById('evidenceVideo');
    if (video && typeof video.pause === 'function') {
        try { video.pause(); } catch(e) { /* ignore */ }
    }
};

document.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('.close-btn');
    if (!btn) return;

    const overlay = btn.closest('.modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';

        const vid = overlay.querySelector('#evidenceVideo');
        if (vid && typeof vid.pause === 'function') try { vid.pause(); } catch(e){}
    } else {
        
        window.closeAllModals();
    }
});

// NOTIFICATIONS DATA 
const notifications = [
    { id:1, title:"New Report Submitted", message:"Officer Goldship submitted a hit-and-run incident report for review.", time:"2 minutes ago", type:"report", unread:true },
    { id:2, title:"Security Alert", message:"Unusual login detected from new device (iPhone 14).", time:"15 minutes ago", type:"security", unread:true },
    { id:3, title:"Report Approved", message:"Your review on REP-2025-1239 has been approved by supervisor.", time:"1 hour ago", type:"success", unread:true },
    { id:4, title:"System Update Complete", message:"AcciTrack v2.4.1 has been successfully deployed.", time:"3 hours ago", type:"system", unread:false },
    { id:5, title:"New Incident Assigned", message:"You have been assigned to review INC-2024-1241 on EDSA.", time:"Yesterday", type:"report", unread:false },
    { id:6, title:"Backup Completed", message:"Daily database backup completed successfully.", time:"2 days ago", type:"system", unread:false },
];

function renderNotifications() {
    const container = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyNotifications');

    if (notifications.length === 0) {
        emptyState.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.unread ? 'unread' : 'read'}" onclick="markAsRead(${notif.id})">
            <div class="notif-icon ${notif.type}">
                ${notif.type === 'report' ? '<i class="fa-solid fa-file-lines"></i>' :
                  notif.type === 'security' ? '<i class="fa-solid fa-shield-halved"></i>' :
                  notif.type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' :
                  '<i class="fa-solid fa-cog"></i>'}
            </div>
            <div class="notif-content">
                <div class="notif-title">${notif.title}</div>
                <div class="notif-message">${notif.message}</div>
                <div class="notif-time">
                    <i class="fa-regular fa-clock"></i> ${notif.time}
                </div>
            </div>
            <div class="notif-unread-dot"></div>
        </div>
    `).join('');
}

function markAsRead(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif && notif.unread) {
        notif.unread = false;
        renderNotifications();
    }
}

document.getElementById('markAllRead').onclick = function() {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
};

// Load on page open
document.addEventListener('DOMContentLoaded', renderNotifications);

// INCIDENT DATA
const incidents = [
    { id:1, officer:"Officer Goldship", location:"EDSA, Quezon City", type:"Hit and Run", video:"assets/videos/incident1.mp4", time:"Dec 12, 2025 • 06:42 AM" },
    { id:2, officer:"Officer Oguri", location:"Commonwealth Ave", type:"Multi-Vehicle Collision", video:"assets/videos/incident2.mp4", time:"Dec 12, 2025 • 03:15 AM" },
    { id:3, officer:"Officer Manhattan", location:"Katipunan Ave", type:"DUI Arrest", video:"assets/videos/incident3.mp4", time:"Dec 11, 2025 • 11:30 PM" }
];

// OPEN INCIDENT MODAL
function openIncidentModal(id) {
    const incident = incidents.find(i => i.id === id);
    if (!incident) return;

    document.getElementById('modalOfficer').textContent = incident.officer;
    document.getElementById('modalLocation').textContent = incident.location;
    document.getElementById('modalType').textContent = incident.type;
    document.getElementById('modalDateTime').textContent = incident.time;

    const video = document.getElementById('incidentVideo');
    video.querySelector('source').src = incident.video;
    video.load();
    video.play().catch(() => {}); 

    document.getElementById('incidentModal').style.display = 'flex';
}

//closeAllModals() FUNCTION
window.closeAllModals = function() {
    const modals = [
        'reportDetailModal','approveModal','denyModal','requestChangesModal',
        'addCertModal','deleteCertModal','changePasswordModal',
        'backupCodesModal','securityLogModal','incidentModal'  
    ];
    modals.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    document.getElementById('incidentVideo')?.pause();
};

// ==================== NOTIFICATIONS TAB====================

// Notification data 
const notificationDetails = [
    { id: 1, officer: "Officer Goldship", location: "EDSA Northbound", type: "Hit and Run", dateTime: "December 21, 2025 • 10:30 AM", video: "assets/videos/incident-089.mp4" },
    { id: 2, officer: "Officer Oguri", location: "EDSA Northbound", type: "Multi-Vehicle Collision", dateTime: "December 21, 2025 • 07:45 AM", video: "assets/videos/incident-089.mp4" },
    { id: 3, officer: "Officer Manhattan", location: "Quezon Avenue", type: "DUI / DWI", dateTime: "December 20, 2025 • 11:20 PM", video: "assets/videos/incident-089.mp4" }
];

// Show Incident Modal with correct data
function showIncidentModal(id) {
    const detail = notificationDetails.find(n => n.id === id);
    if (!detail) return;

    // Fill modal fields
    document.getElementById('modalOfficer').textContent = detail.officer;
    document.getElementById('modalLocation').textContent = detail.location;
    document.getElementById('modalType').textContent = detail.type;
    document.getElementById('modalDateTime').textContent = detail.dateTime;

    // Load video
    const video = document.getElementById('incidentVideo');
    const source = video.querySelector('source');
    source.src = detail.video;
    video.load();

    // Show modal
    document.getElementById('incidentModal').style.display = 'flex';
}

// Close modal 
function closeIncidentModal() {
    document.getElementById('incidentModal').style.display = 'none';
}

// Mark as Read 
function markAsRead(btn) {
    const card = btn.closest('.notif-card');
    card.style.opacity = '0.6';
    btn.textContent = 'Read';
    btn.disabled = true;
}

// Delete notification 
function deleteNotification(btn) {
    const card = btn.closest('.notif-card');
    card.style.transition = 'all 0.4s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-20px)';
    setTimeout(() => card.remove(), 400);
}

// Simple function to switch pages 
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } else {
        console.warn(`Page #${pageId} not found`);
    }

    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        }
    });
}

// Tab Switching 
function openProfileTab(tabName) {
    document.querySelectorAll('.profile-tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.profile-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    event.target.classList.add('active');
}

// Edit Modal Functions
function openEditModal(type) {
    const modalId = `edit${type}Modal`;
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
    else console.error("Modal not found:", modalId);
}

function closeEditModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function submitChanges(type) {
    closeEditModal(`edit${type}Modal`);
    document.getElementById('submitConfirmModal').style.display = 'flex';
}

// Close modals 
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeEditModal(overlay.id);
    });
});

// Sample pending requests data 
const pendingRequests = [
    {
        id: 1,
        officer: "Officer John Martinez",
        badge: "#4521",
        department: "Patrol Division",
        time: "2h ago",
        type: "Information Change",
        priority: "high",
        changes: 2,
        submitted: "12/31/2025, 1:58 PM",
        phoneCurrent: "+1 (555) 123-4567",
        phoneNew: "+1 (555) 987-6543",
        reason: "New number required for emergency contact"
    },
    {
        id: 2,
        officer: "Officer Sarah Chen",
        badge: "#4892",
        department: "Detective Bureau",
        time: "5h ago",
        type: "Document Upload",
        priority: "medium",
        changes: 2,
        documents: ["Advanced_Firearms_Certification.pdf", "Training_Completion_Certificate.pdf"]
    },
];

// Function to render the list
function renderPendingList() {
    const container = document.getElementById('pending-list');
    container.innerHTML = '';

    pendingRequests.forEach(req => {
        const item = document.createElement('div');
        item.className = 'pending-item';
        item.onclick = () => showRequestDetails(req.id);

        item.innerHTML = `
            <div class="pending-item-header">
                <div class="pending-item-avatar">${req.officer.split(' ').map(n => n[0]).join('')}</div>
                <div class="pending-item-info">
                    <strong>${req.officer}</strong>
                    <small>${req.badge} • ${req.department}</small>
                </div>
            </div>
            <div class="pending-item-meta">
                <span class="badge-type badge-${req.priority}">${req.type}</span>
                ${req.priority === 'high' ? '<span class="badge-type badge-high">HIGH</span>' : 
                  req.priority === 'medium' ? '<span class="badge-type badge-medium">MEDIUM</span>' : ''}
                <span class="time-ago"><i class="fa-regular fa-clock"></i> ${req.time}</span>
            </div>
        `;

        container.appendChild(item);
    });
}

// Show details in right panel when item clicked
function showRequestDetails(id) {
    const req = pendingRequests.find(r => r.id === id);
    if (!req) return;

    const panel = document.getElementById('request-details-panel');
    panel.innerHTML = `
        <div class="request-details-header">
            <h3 style="margin:0; font-size:22px; color:#0f172a;">Request Details</h3>
            <span style="background:#f97316; color:white; padding:6px 16px; border-radius:30px; font-weight:700;">${req.priority.toUpperCase()}</span>
        </div>

        <div class="request-details-section">
            <h4>Officer Information</h4>
            <div class="request-details-grid">
                <div class="detail-row"><span class="detail-label">Officer Name</span><span class="detail-value">${req.officer}</span></div>
                <div class="detail-row"><span class="detail-label">Badge Number</span><span class="detail-value">${req.badge}</span></div>
                <div class="detail-row"><span class="detail-label">Department</span><span class="detail-value">${req.department}</span></div>
                <div class="detail-row"><span class="detail-label">Request ID</span><span class="detail-value">PR-00${req.id}</span></div>
                <div class="detail-row"><span class="detail-label">Submitted</span><span class="detail-value">${req.submitted || 'N/A'}</span></div>
            </div>
        </div>

        ${req.type === 'Information Change' ? `
        <div class="request-details-section">
            <h4>Requested Changes</h4>
            <div class="detail-row"><span class="detail-label">Phone Number</span>
                <span class="detail-value">Current: ${req.phoneCurrent || 'N/A'} <br> New: ${req.phoneNew || 'N/A'}</span>
            </div>
            <p style="margin-top:12px; color:#64748b;">Reason: ${req.reason || 'Not provided'}</p>
        </div>` : ''}

        ${req.documents ? `
        <div class="request-details-section">
            <h4>Uploaded Documents</h4>
            ${req.documents.map(doc => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #e2e8f0;">
                    <span><i class="fa-solid fa-file-pdf" style="color:#dc2626;"></i> ${doc}</span>
                    <button style="background:#f1f5f9; border:none; padding:6px 12px; border-radius:8px; cursor:pointer;">View</button>
                </div>
            `).join('')}
        </div>` : ''}

        <div class="request-details-section">
            <h4>Admin Review Notes</h4>
            <textarea style="width:100%; height:120px; padding:12px; border:1px solid #cbd5e1; border-radius:12px; resize:none;" placeholder="Add notes about your decision..."></textarea>
        </div>

        <div class="action-buttons">
            <button class="btn-reject">× Reject</button>
            <button class="btn-approve">✓ Approve</button>
        </div>
    `;

    // Highlight selected item
    document.querySelectorAll('.pending-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Load list when tab is opened
document.addEventListener('DOMContentLoaded', () => {
  

    // Call this when Pending Reviews tab is activated
    const pendingTab = document.querySelector('.profile-tab[onclick*="pending-reviews"]');
    if (pendingTab) {
        pendingTab.addEventListener('click', () => {
            renderPendingList();
        });
    }
});
