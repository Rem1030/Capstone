document.addEventListener("DOMContentLoaded", function () {

    // Greeting
    const hour = new Date().getHours();
    document.getElementById("greeting").textContent = 
        `${hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"}, Officer Manhattan!`;

    // Live Clock
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
    });

const accidentTypes = [
    { type: "Minor Traffic Accident",          icon: "fa-solid fa-car-burst",           color: "blue" },
    { type: "Reckless Driving",               icon: "fa-solid fa-gauge-high",          color: "#f97316" },
    { type: "DUI / DWI",                      icon: "fa-solid fa-wine-bottle",         color: "green" },
    { type: "Hit & Run",                      icon: "fa-solid fa-person-running",      color: "brown" },
    { type: "Multi-Vehicle Pileup",           icon: "fa-solid fa-car-crash",           color: "red" },
    { type: "Reckless Imprudence Resulting in Homicide", icon: "fa-solid fa-skull-crossbones", color: "black" }
];


const reportNotifications = [
    {
        accidentType: "Reckless Driving",
        officer: "Officer Manhattan Cafe",
        location: "EDSA cor. Quezon Ave, Quezon City",
        status: "pending",
        time: "30 minutes ago"
    },
    {
        accidentType: "DUI / DWI",
        officer: "Officer Manhattan Cafe",
        location: "Commonwealth Ave, near UP Diliman",
        status: "approved",
        time: "2 hours ago"
    },
    {
        accidentType: "Hit & Run",
        officer: "Officer Manhattan Cafe",
        location: "C5 Road, Pasig City",
        status: "denied",
        reason: "CCTV footage unclear • No plate captured",
        time: "1 day ago"
    },
    {
        accidentType: "Minor Traffic Accident",
        officer: "Officer Manhattan Cafe",
        location: "Katipunan Ave, Quezon City",
        status: "pending",
        time: "4 hours ago"
    },
    {
        accidentType: "Multi-Vehicle Pileup",
        officer: "Officer Manhattan Cafe",
        location: "Skyway Stage 3, Makati",
        status: "approved",
        time: "6 hours ago"
    },
    {
        accidentType: "Reckless Imprudence Resulting in Homicide",
        officer: "Officer Manhattan Cafe",
        location: "Macapagal Blvd, Pasay City",
        status: "pending",
        time: "12 hours ago"
    }
];

function renderReportNotifications() {
    const container = document.getElementById("reportNotifications");
    container.innerHTML = "";

    reportNotifications.forEach((report, index) => {
        const accident = accidentTypes.find(a => a.type === report.accidentType) || accidentTypes[0];

        const card = document.createElement("div");
        card.className = `report-card ${report.status}`;
        card.style.cursor = "pointer";

        card.innerHTML = `
            <div class="report-icon ${report.status}">
                <i class="${accident.icon}" style="color: ${accident.color};"></i>
            </div>
            <div class="report-content">
                <h3>${report.accidentType}</h3>
                <p><strong>Officer:</strong> ${report.officer} • <strong>Location:</strong> ${report.location}</p>
                ${report.reason ? `<small>Reason: ${report.reason}</small>` : ""}
            </div>
            <div class="report-meta">
                <div class="status-badge ${report.status}">
                    <i class="fa-solid ${report.status === 'pending' ? 'fa-clock' : report.status === 'approved' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${report.status.toUpperCase()}
                </div>
                <div class="time-ago">${report.time}</div>
            </div>
        `;

        // CLICK TO OPEN MODAL
        card.addEventListener("click", () => openReportModal(report, accident));

        container.appendChild(card);
    });
}

// MODAL FUNCTION
function openReportModal(report, accident) {
    const modal = document.getElementById("reportModal");
    const title = document.getElementById("modalTitle");
    const statusEl = document.getElementById("modalStatus");
    const icon = document.getElementById("modalIcon");
    const details = document.getElementById("modalDetails");

    title.textContent = report.accidentType;
    statusEl.textContent = report.status.toUpperCase();
    statusEl.className = `modal-status-text ${report.status}`;
    icon.className = `modal-icon-large ${report.status}`;
    icon.innerHTML = `<i class="${accident.icon}" style="color: ${accident.color};"></i>`;

    let content = "";

    if (report.status === "pending") {
        content = `
            <div class="detail-row"><span class="detail-label">Submitted By</span><span class="detail-value">${report.officer}</span></div>
            <div class="detail-row"><span class="detail-label">Submission Date</span><span class="detail-value">Nov 28, 2025 • 4:32 PM</span></div>
            <div class="detail-row"><span class="detail-label">Accident Date & Time</span><span class="detail-value">Nov 28, 2025 • 3:15 PM</span></div>
            <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${report.location}</span></div>
            <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value pending">Waiting for Admin Review</span></div>
        `;
    } else if (report.status === "approved") {
        content = `
            <div class="detail-row"><span class="detail-label">Approved By</span><span class="detail-value">Sgt. Delgado</span></div>
            <div class="detail-row"><span class="detail-label">Approved On</span><span class="detail-value">Nov 28, 2025 • 5:45 PM</span></div>
            <div class="detail-row"><span class="detail-label">Officer</span><span class="detail-value">${report.officer}</span></div>
            <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${report.location}</span></div>
            <div class="detail-row"><span class="detail-label">Note</span><span class="detail-value">Report complete and verified</span></div>
        `;
    } else if (report.status === "denied") {
        content = `
            <div class="detail-row"><span class="detail-label">Denied By</span><span class="detail-value">Lt. Symboli Rudolph</span></div>
            <div class="detail-row"><span class="detail-label">Denied On</span><span class="detail-value">Nov 27, 2025 • 11:20 AM</span></div>
            <div class="detail-row"><span class="detail-label">Officer</span><span class="detail-value">${report.officer}</span></div>
            <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${report.location}</span></div>
            <div class="reason-box">
                <strong>Reason for Denial:</strong><br>
                ${report.reason || "No reason provided"}
            </div>
        `;
    }

    details.innerHTML = content;
    modal.classList.add("show");
}

// Close modal
document.getElementById("closeModal").onclick = () => document.getElementById("reportModal").classList.remove("show");
document.getElementById("closeBtn").onclick = () => document.getElementById("reportModal").classList.remove("show");
document.querySelector(".modal-overlay").onclick = (e) => {
    if (e.target === document.querySelector(".modal-overlay")) {
        document.getElementById("reportModal").classList.remove("show");
    }
};
// Auto-run on load
document.addEventListener("DOMContentLoaded", renderReportNotifications);