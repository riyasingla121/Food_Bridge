// LOGIN
let login = document.getElementById("loginPage");
let app = document.getElementById("mainApp");

document.getElementById("loginForm").onsubmit = function(e) {
    e.preventDefault();
    login.style.display = "none";
    app.style.display = "flex";
};

document.getElementById("guestButton").onclick = function() {
    login.style.display = "none";
    app.style.display = "flex";
};

document.getElementById("logoutButton").onclick = function() {
    app.style.display = "none";
    login.style.display = "flex";
};


// NAVIGATION
let buttons = document.querySelectorAll("[data-page]");
let pages = document.querySelectorAll(".page");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function() {
        for (let j = 0; j < pages.length; j++) {
            pages[j].classList.remove("active");
            buttons[j].classList.remove("active");
        }

        document.getElementById(this.dataset.page).classList.add("active");
        this.classList.add("active");
    };
}


// SAVE AND LOAD DATA
let tableIDs = [
    "centersTable",
    "mealsTable",
    "volunteersTable",
    "suppliesTable",
    "scheduleTable",
    "trackingTable"
];

function saveData() {
    for (let id of tableIDs) {
        localStorage.setItem(id, document.getElementById(id).innerHTML);
    }
}

function loadData() {
    for (let id of tableIDs) {
        let saved = localStorage.getItem(id);

        if (saved !== null) {
            document.getElementById(id).innerHTML = saved;
        }
    }
}


// RESET DATA
document.getElementById("resetButton").onclick = function() {
    if (confirm("Are you sure you want to clear all records?")) {
        for (let id of tableIDs) {
            localStorage.removeItem(id);
            document.getElementById(id).innerHTML = "";
        }

        updateDashboard();
    }
};


// ADD TABLE ROW
function addRow(id, data) {
    let row = document.getElementById(id).insertRow();

    for (let item of data) {
        row.insertCell().textContent = item;
    }
}


// COMMON FORMS
function addForm(form, table, fields) {
    document.getElementById(form).onsubmit = function(e) {
        e.preventDefault();

        let data = fields.map(id => document.getElementById(id).value);

        addRow(table, data);
        this.reset();
        updateDashboard();
    };
}

addForm("centerForm", "centersTable",
["centerName", "centerLocation", "centerContact", "centerMeals"]);

addForm("mealForm", "mealsTable",
["mealCenter", "mealRequired", "mealArranged"]);

addForm("volunteerForm", "volunteersTable",
["volunteerName", "volunteerContact", "volunteerCenter"]);

addForm("supplyForm", "suppliesTable",
["foodName", "foodQuantity", "foodStatus"]);

addForm("scheduleForm", "scheduleTable",
["scheduleCenter", "scheduleDate", "scheduleTime", "scheduleMeals"]);


// COMPLETION TRACKING
document.getElementById("trackingForm").onsubmit = function(e) {
    e.preventDefault();

    let center = document.getElementById("trackingCenter").value;
    let target = Number(document.getElementById("trackingTarget").value);
    let done = Number(document.getElementById("trackingDistributed").value);

    if (done > target) {
        alert("Distributed meals cannot exceed target!");
        return;
    }

    let percent = Math.round(done / target * 100);

    addRow("trackingTable", [
        center, target, done, target - done, percent + "%"
    ]);

    this.reset();
    updateDashboard();
};


// DASHBOARD
function updateDashboard() {
    let centers = document.getElementById("centersTable").rows;
    let meals = document.getElementById("mealsTable").rows;
    let volunteers = document.getElementById("volunteersTable").rows;
    let supplies = document.getElementById("suppliesTable").rows;
    let tracking = document.getElementById("trackingTable").rows;

    let required = 0, arranged = 0, available = 0;
    let needed = 0, done = 0, target = 0;

    for (let row of centers)
        required += Number(row.cells[3].textContent);

    for (let row of meals)
        arranged += Number(row.cells[2].textContent);

    for (let row of supplies) {
        if (row.cells[2].textContent == "Available")
            available += Number(row.cells[1].textContent);
        else
            needed += Number(row.cells[1].textContent);
    }

    for (let row of tracking) {
        target += Number(row.cells[1].textContent);
        done += Number(row.cells[2].textContent);
    }

    document.getElementById("totalCenters").textContent = centers.length;
    document.getElementById("totalMeals").textContent = required;
    document.getElementById("availableMeals").textContent = arranged;
    document.getElementById("totalVolunteers").textContent = volunteers.length;
    document.getElementById("availableSupplies").textContent = available;
    document.getElementById("totalDistributed").textContent = done;

    document.getElementById("supplyOverview").textContent =
        "Available: " + available + " | Needed: " + needed;

    let percent = target ? Math.round(done / target * 100) : 0;

    document.getElementById("progressText").textContent =
        done + " of " + target + " meals distributed (" + percent + "%)";

    document.getElementById("progressFill").style.width = percent + "%";

    saveData();
}


// LOAD SAVED DATA
loadData();
updateDashboard();