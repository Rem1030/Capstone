document.addEventListener("DOMContentLoaded", function () {

    // ——— GREETING & LIVE CLOCK ———
    const hour = new Date().getHours();
    const greetingEl = document.getElementById("greeting");
    if (greetingEl) {
        greetingEl.textContent = 
            `${hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"}, Officer Manhattan!`;
    }

    function updateClock() {
        const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
        const formatted = new Date(now).toLocaleDateString("en-PH", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
            hour: "numeric", minute: "numeric", hour12: true
        }).replace(",", " at");
        const datetimeEl = document.getElementById("datetime");
        if (datetimeEl) datetimeEl.textContent = formatted;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ——— ICON MAPPING ———
    const accidentIcons = {
        "Minor Traffic Accident":                { icon: "fa-car-burst",        color: "#3b82f6" },
        "Reckless Driving":                      { icon: "fa-gauge-high",       color: "#f97316" },
        "DUI / DWI":                             { icon: "fa-wine-bottle",      color: "#ec4899" },
        "Hit & Run":                             { icon: "fa-person-running",   color: "#8b55cf6" },
        "Multi-Vehicle Pileup":                  { icon: "fa-car-crash",        color: "#dc2626" },
        "Reckless Imprudence Resulting in Homicide": { icon: "fa-skull-crossbones", color: "#991b1b" }
    };

    // ——— MODAL: NEW REPORT ———
    window.openReportModal = function() {
        document.getElementById("reportModal").classList.add("active");
        document.getElementById("reportDateTime").value = new Date().toLocaleString('en-PH', {
            dateStyle: 'medium', timeStyle: 'medium'
        });
    };

    window.closeReportModal = function() {
        document.getElementById("reportModal").classList.remove("active");
        document.getElementById("videoPreview").innerHTML = "";
        document.getElementById("videoUpload").value = "";
        window.currentVideoURL = null;
    };

    // Video upload preview
    document.getElementById("videoDropArea")?.addEventListener("click", () => 
        document.getElementById("videoUpload").click()
    );

    document.getElementById("videoUpload")?.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            window.currentVideoURL = url;
            document.getElementById("videoPreview").innerHTML = `
                <video controls style="width:100%;max-height:300px;border-radius:12px;margin-top:12px;">
                    <source src="${url}" type="${file.type}">
                </video>
                <p style="margin:8px 0 0;color:#475569;"><strong>${file.name}</strong> (${(file.size/1024/1024).toFixed(2)} MB)</p>`;
        }
    });

    // ——— SUBMIT REPORT → ADD TO LIST ———
    window.submitReport = function() {
        const officer   = document.getElementById("officerName").value;
        const datetime  = document.getElementById("reportDateTime").value;
        const location  = document.getElementById("location").value.trim();
        const type      = document.getElementById("accidentType").value;

        if (!location || !type) {
            alert("Please fill in Location and Type of Accident");
            return;
        }

        const caseNum = type.substring(0,3).toUpperCase() + "-" + 
                        new Date().getFullYear() + "-" + 
                        String(Math.floor(Math.random()*9999)+1000).padStart(4, '0');

        const iconInfo = accidentIcons[type] || accidentIcons["Minor Traffic Accident"];

        const newRow = document.createElement("div");
        newRow.className = "report-row pending";
        newRow.style.animation = "slideIn 0.5s ease";
        newRow.innerHTML = `
            <i class="fa-solid ${iconInfo.icon}" style="color:${iconInfo.color};"></i>
            <div class="report-details">
                <strong>${type}</strong>
                <p>${officer} • ${datetime.split(",")[0]} • ${location}</p>
            </div>
            <span class="status" style="background:#fef3c7;color:#92400e;">PENDING REVIEW</span>
        `;

        // Store data for detail view
        newRow.dataset.type = type;
        newRow.dataset.officer = officer;
        newRow.dataset.datetime = datetime;
        newRow.dataset.location = location;
        newRow.dataset.casenumber = caseNum;
        newRow.dataset.video = window.currentVideoURL || "";
        newRow.dataset.status = "pending";

        // Make clickable
        newRow.onclick = () => openDetailModal(newRow.dataset);

        document.querySelector(".recent-reports").insertBefore(newRow, document.querySelector(".recent-reports").firstChild);

        alert(`Report ${caseNum} submitted successfully!`);
        closeReportModal();
        document.getElementById("location").value = "";
        document.getElementById("accidentType").value = "";
    };

    // ——— DETAIL MODAL ———
    window.openDetailModal = function(data) {
        const iconInfo = accidentIcons[data.type] || accidentIcons["Minor Traffic Accident"];
        let statusHTML = "";
        if (data.status === "pending") {
            statusHTML = `<div class="status-pending"><i class="fa-solid fa-clock"></i><div><strong>Pending Review</strong><p>Waiting for Chief Officer or Admin approval</p></div></div>`;
        } else if (data.status === "completed") {
            statusHTML = `<div class="status-approved"><i class="fa-solid fa-circle-check"></i><div><strong>Approved by Chief A. Reyes</strong><p>Approved on Nov 27, 2025 at 3:45 PM</p></div></div>`;
        }

        const videoHTML = data.video ? `
            <div class="video-section">
                <strong><i class="fa-solid fa-video"></i> Video Evidence</strong>
                <video controls style="width:100%;max-height:400px;border-radius:12px;margin-top:12px;">
                    <source src="${data.video}">
                </video>
            </div>` : "<p><em>No video attached</em></p>";

        document.getElementById("detailContent").innerHTML = `
            <div style="text-align:center;margin-bottom:24px;">
                <i class="fa-solid ${iconInfo.icon} fa-4x" style="color:${iconInfo.color};"></i>
                <h2 style="margin:16px 0 8px;">${data.type}</h2>
                <p style="color:#64748b;">Case #${data.casenumber}</p>
            </div>
            <div class="detail-grid">
                <div><strong>Officer</strong><p>${data.officer}</p></div>
                <div><strong>Date & Time</strong><p>${data.datetime}</p></div>
                <div><strong>Location</strong><p>${data.location}</p></div>
                <div><strong>Submitted</strong><p>${new Date().toLocaleString('en-PH')}</p></div>
            </div>
            <div style="margin:32px 0;padding:20px;background:#f8fafc;border-radius:16px;">${statusHTML}</div>
            ${videoHTML}
        `;

        document.getElementById("detailModal").classList.add("active");
    };

    window.closeDetailModal = function() {
        document.getElementById("detailModal").classList.remove("active");
    };

    // ——— ANIMATION ———
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        @keyframes slideIn { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        .status-pending, .status-approved { display:flex; align-items:center; gap:16px; padding:16px; border-radius:12px; }
        .status-pending { background:#fffbeb; border:1px solid #fcd34d; }
        .status-approved { background:#f0fdf4; border:1px solid #86efac; }
        .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:24px 0; font-size:15px; }
        .detail-grid p { margin:6px 0 0; color:#475569; }
    `;
    document.head.appendChild(animStyle);
});