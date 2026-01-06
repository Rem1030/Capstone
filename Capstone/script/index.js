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

    // Elements
    const modal     = document.getElementById("taskModal");
    const openBtn   = document.getElementById("openTaskModal");
    const closeBtn  = document.getElementById("closeModal");
    const saveBtn   = document.getElementById("saveTask");
    const taskList  = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");

    // Modal Controls
    openBtn.onclick = () => modal.style.display = "flex";
    closeBtn.onclick = () => modal.style.display = "none";
    modal.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

    // DELETE FUNCTION 
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

    // SAVE NEW TASK 
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

        // Clear form
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDesc").value = "";
        modal.style.display = "none";

     
        taskList.firstElementChild.querySelector(".delete-btn").onclick = function () {
            deleteTask(this);
        };
    };
});
// TAB SWITCHING 
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;

      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(tab).classList.add('active');
    });
  });
});

  document.querySelectorAll('nav a').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

    const completed = localStorage.getItem("preduty_2025");
    const allDone = completed && Object.keys(JSON.parse(completed)).length === 12 
                    && Object.values(JSON.parse(completed)).every(v => v);

  
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

// TAB SWITCHING 
        function openProfileTab(tabName) {
            document.querySelectorAll('.profile-tab-content').forEach(tab => tab.style.display = 'none');
            document.querySelectorAll('.profile-tab').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabName).style.display = 'block';
            event.target.classList.add('active');
        }

        // EDIT MODAL FUNCTIONS
        function openEditModal(type) {
            const modalId = `edit${type}Modal`;
            document.getElementById(modalId).style.display = 'flex';
        }

        function closeEditModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function submitChanges(type) {
            closeEditModal(`edit${type}Modal`);
            document.getElementById('submitConfirmModal').style.display = 'flex';
        }

        // Close modals when clicking outside
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) closeEditModal(overlay.id);
            });
        });

function openEditModal(type) {
    const modalId = `edit${type}Modal`;
    document.getElementById(modalId).style.display = 'flex';
}

function closeEditModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function submitChanges(type) {
    closeEditModal(`edit${type}Modal`);
    document.getElementById('submitConfirmModal').style.display = 'flex';
}