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