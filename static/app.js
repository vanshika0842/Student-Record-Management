
const API = "/students";

const table = document.querySelector("#studentTable");
const form = document.querySelector("#studentForm");
const dialog = document.querySelector("#studentDialog");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const notice = document.querySelector("#notice");

let students = [];
let editingId = null;
let noticeTimer;

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const data = await response.json();
            message = typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail ?? data);
        } catch {}

        throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function showNotice(message, isError = false) {
    clearTimeout(noticeTimer);
    notice.textContent = message;
    notice.classList.toggle("error", isError);
    notice.hidden = false;

    noticeTimer = setTimeout(() => {
        notice.hidden = true;
    }, 4500);
}

function formatDate(value) {
    if (!value) return "—";
    const parts = value.split("-");
    if (parts.length !== 3) return escapeHTML(value);
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function renderStats() {
    const courses = new Set(
        students.map(s => s.course).filter(Boolean)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - 30);

    const recent = students.filter(s => {
        if (!s.enrollment_date) return false;
        const date = new Date(`${s.enrollment_date}T00:00:00`);
        return !Number.isNaN(date.getTime())
            && date >= cutoff && date <= today;
    });

    document.querySelector("#totalStudents").textContent =
        students.length;

    document.querySelector("#totalCourses").textContent =
        courses.size;

    document.querySelector("#recentStudents").textContent =
        recent.length;
}

function renderCourseOptions() {
    const previous = courseFilter.value;
    const courses = [...new Set(
        students.map(s => s.course).filter(Boolean)
    )].sort();

    courseFilter.innerHTML = '<option value="">All courses</option>';

    for (const course of courses) {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseFilter.appendChild(option);
    }

    courseFilter.value = courses.includes(previous) ? previous : "";
}

function renderStudents() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    const filtered = students.filter(student => {
        const matchesName = (student.name || "")
            .toLowerCase().includes(query);

        const matchesCourse = !selectedCourse
            || student.course === selectedCourse;

        return matchesName && matchesCourse;
    });

    document.querySelector("#recordCount").textContent =
        `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;

    document.querySelector("#tableSummary").textContent =
        `Showing ${filtered.length} of ${students.length} students`;

    if (filtered.length === 0) {
        table.innerHTML = `
            <tr><td colspan="6" class="empty-cell">
                No students found. Try another search or add a student.
            </td></tr>`;
        return;
    }

    table.innerHTML = filtered.map(student => {
        const name = escapeHTML(student.name);
        const course = escapeHTML(student.course || "Not specified");
        const email = escapeHTML(student.email);
        const initial = escapeHTML(
            (student.name || "?").trim().charAt(0).toUpperCase()
        );

        return `
            <tr>
                <td>
                    <div class="student-cell">
                        <div class="student-avatar">${initial}</div>
                        <div>
                            <div class="student-name">${name}</div>
                            <div class="student-id">ID: ${student.id}</div>
                        </div>
                    </div>
                </td>
                <td><span class="course-pill">${course}</span></td>
                <td>${formatDate(student.date_of_birth)}</td>
                <td>${email}</td>
                <td>${formatDate(student.enrollment_date)}</td>
                <td>
                    <div class="action-group">
                        <button class="action-btn"
                            data-action="edit" data-id="${student.id}"
                            aria-label="Edit ${name}">Edit</button>
                        <button class="action-btn delete"
                            data-action="delete" data-id="${student.id}"
                            aria-label="Delete ${name}">Delete</button>
                    </div>
                </td>
            </tr>`;
    }).join("");
}

async function loadStudents() {
    table.innerHTML = `
        <tr><td colspan="6" class="empty-cell">
            Loading student records...
        </td></tr>`;

    try {
        // Fetch all matching API records; search locally for instant feedback.
        students = await request(API);
        renderStats();
        renderCourseOptions();
        renderStudents();
    } catch (error) {
        table.innerHTML = `
            <tr><td colspan="6" class="empty-cell">
                Could not load records. Check that the backend is running.
            </td></tr>`;
        showNotice(error.message, true);
    }
}

function openCreateDialog() {
    editingId = null;
    form.reset();

    document.querySelector("#dialogTitle").textContent =
        "Add a student";

    document.querySelector("#saveBtn").textContent =
        "Save student";

    const dob = form.elements.date_of_birth;
    const enrollment = form.elements.enrollment_date;

    dob.max = new Date().toISOString().slice(0, 10);
    enrollment.max = new Date().toISOString().slice(0, 10);

    dialog.showModal();
}

function openEditDialog(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    editingId = id;
    form.reset();

    for (const field of form.elements) {
        if (field.name && student[field.name] != null) {
            field.value = student[field.name];
        }
    }

    document.querySelector("#dialogTitle").textContent =
        "Edit student";

    document.querySelector("#saveBtn").textContent =
        "Save changes";

    dialog.showModal();
}

document.querySelector("#addStudentBtn").addEventListener(
    "click", openCreateDialog
);

document.querySelector("#closeDialog").addEventListener(
    "click", () => dialog.close()
);

document.querySelector("#cancelBtn").addEventListener(
    "click", () => dialog.close()
);

document.querySelector("#refreshBtn").addEventListener(
    "click", loadStudents
);

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

table.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    if (!Number.isInteger(id)) return;

    if (button.dataset.action === "edit") {
        openEditDialog(id);
        return;
    }

    if (button.dataset.action === "delete") {
        const student = students.find(s => s.id === id);
        if (!student) return;

        if (!confirm(`Delete student "${student.name}"? This cannot be undone.`)) {
            return;
        }

        button.disabled = true;

        try {
            await request(`${API}/${id}`, { method: "DELETE" });
            showNotice("Student deleted successfully.");
            await loadStudents();
        } catch (error) {
            showNotice(error.message, true);
        } finally {
            button.disabled = false;
        }
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();

    const saveButton = document.querySelector("#saveBtn");
    saveButton.disabled = true;

    const payload = Object.fromEntries(new FormData(form).entries());

    // Optional fields must be null when blank for the Pydantic schemas.
    for (const key of [
        "phone", "course", "address", "enrollment_date"
    ]) {
        if (!payload[key]) payload[key] = null;
    }

    try {
        if (editingId === null) {
            await request(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            showNotice("Student registered successfully.");
        } else {
            await request(`${API}/${editingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            showNotice("Student updated successfully.");
        }

        dialog.close();
        await loadStudents();
    } catch (error) {
        showNotice(error.message, true);
    } finally {
        saveButton.disabled = false;
    }
});

loadStudents();
