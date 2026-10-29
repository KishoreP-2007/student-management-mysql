const form = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
const studentIdInput = document.getElementById("student-id");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const formTitle = document.getElementById("form-title");
const message = document.getElementById("message");

let students = [];

function showMessage(text) {
    message.textContent = text;
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    return cell;
}

async function loadStudents() {
    try {
        students = await apiRequest("/api/students");
        studentList.replaceChildren();

        if (students.length === 0) {
            const row = document.createElement("tr");
            const cell = createCell("No students found");
            cell.colSpan = 5;
            row.appendChild(cell);
            studentList.appendChild(row);
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");
            row.appendChild(createCell(student.id));
            row.appendChild(createCell(student.name));
            row.appendChild(createCell(student.email));
            row.appendChild(createCell(student.course));

            const actions = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-button";
            editButton.addEventListener("click", () => editStudent(student.id));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";
            deleteButton.addEventListener("click", () => deleteStudent(student.id));

            actions.append(editButton, deleteButton);
            row.appendChild(actions);
            studentList.appendChild(row);
        });
    } catch (error) {
        showMessage(error.message);
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = studentIdInput.value;
    const student = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        course: courseInput.value.trim()
    };

    submitButton.disabled = true;

    try {
        if (id) {
            await apiRequest(`/api/students/${id}`, {
                method: "PUT",
                body: JSON.stringify(student)
            });
            showMessage("Student updated successfully");
        } else {
            await apiRequest("/api/students", {
                method: "POST",
                body: JSON.stringify(student)
            });
            showMessage("Student added successfully");
        }

        resetForm();
        await loadStudents();
    } catch (error) {
        showMessage(error.message);
    } finally {
        submitButton.disabled = false;
    }
});

function editStudent(id) {
    const student = students.find(item => item.id === id);
    if (!student) return;

    studentIdInput.value = student.id;
    nameInput.value = student.name;
    emailInput.value = student.email;
    courseInput.value = student.course;

    formTitle.textContent = "Edit Student";
    submitButton.textContent = "Update Student";
    cancelButton.hidden = false;
    nameInput.focus();
}

async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        await apiRequest(`/api/students/${id}`, { method: "DELETE" });
        showMessage("Student deleted successfully");
        await loadStudents();
    } catch (error) {
        showMessage(error.message);
    }
}

function resetForm() {
    form.reset();
    studentIdInput.value = "";
    formTitle.textContent = "Add Student";
    submitButton.textContent = "Add Student";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);

loadStudents();
