const officersDB = "accitrack_officers";

document.getElementById("officerLogin")?.addEventListener("submit", e => {
    e.preventDefault();
    const badge = document.getElementById("badge").value;
    const pin = document.getElementById("pin").value;
    const users = JSON.parse(localStorage.getItem(officersDB) || "{}");
    
    if (users[badge] && users[badge].pin === pin) {
        localStorage.setItem("currentUser", JSON.stringify({type: "officer", ...users[badge]}));
    } else {
        alert("Invalid badge or PIN");
    }
});

document.getElementById("officerSignup")?.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const badge = document.getElementById("badge").value;
    const unit = document.getElementById("unit").value;
    const pin = document.getElementById("pin").value;
    const confirm = document.getElementById("confirmPin").value;

    if (pin !== confirm) return alert("PINs don't match");
    if (pin.length !== 4) return alert("PIN must be 4 digits");

    const users = JSON.parse(localStorage.getItem(officersDB) || "{}");
    if (users[badge]) return alert("Badge already registered");

    users[badge] = { name, badge, unit, pin };
    localStorage.setItem(officersDB, JSON.stringify(users));
    alert("Registration successful! You can now login.");
    window.location.href = "officer-login.html";
});

// Role switching
document.querySelectorAll('.role').forEach(role => {
    role.addEventListener('click', function () {
        document.querySelectorAll('.role').forEach(r => r.classList.remove('active'));
        this.classList.add('active');

        if (this.dataset.role === 'officer') {
            document.getElementById('officer-form').style.display = 'block';
            document.getElementById('admin-form').style.display = 'none';
        } else {
            document.getElementById('officer-form').style.display = 'none';
            document.getElementById('admin-form').style.display = 'block';
        }
    });
});

// Officer names database 
const officerNames = {
    "1030": "Manhattan",
    "2002": "Mejiro McQueen",
    "9999": "Test Officer"
};

// Officer Login
document.getElementById('officerLogin').addEventListener('submit', function (e) {
    e.preventDefault();

    const badge = document.getElementById('badgeNumber').value.trim();
    const pin = document.getElementById('officerPin').value;

    if (!badge || !pin) {
        alert('Please enter Badge Number and PIN');
        return;
    }

    if (pin.length !== 4 || isNaN(pin)) {
        alert('PIN must be exactly 4 digits');
        return;
    }

    const officerName = officerNames[badge] || "Officer";

    alert(`Login successful!\nWelcome back, ${officerName} (Badge #${badge})`);

    window.location.href = 'index.html'; // Officer dashboard
});

// Admin Login
document.getElementById('adminLogin').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (!username || !password) {
        alert('Please enter Username and Password');
        return;
    }

    if (username.toLowerCase() === 'admin' && password === 'admin123') {
        alert(`Login successful!\nWelcome back, Administrator ${username} (Badge #2002)`);
        window.location.href = 'admin.html'; // Admin dashboard
    } else {
        alert('Invalid credentials.\n\nDemo login:\nUsername: admin\nPassword: admin123');
    }
});