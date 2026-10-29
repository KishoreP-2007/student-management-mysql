const express = require("express");
const path = require("path");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// GET: View all students
app.get("/api/students", async (req, res) => {
    try {
        const [students] = await db.execute(
            "SELECT * FROM students ORDER BY id DESC"
        );
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch students" });
    }
});

// POST: Add a student
app.post("/api/students", async (req, res) => {
    try {
        const { name, email, course } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof course !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !course.trim()
        ) {
            return res.status(400).json({
                message: "Name, email, and course are required"
            });
        }

        const [result] = await db.execute(
            "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
            [name.trim(), email.trim(), course.trim()]
        );

        res.status(201).json({
            message: "Student added successfully",
            id: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This email already exists"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Failed to add student" });
    }
});

// PUT: Update a student
app.put("/api/students/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, course } = req.body;

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof course !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !course.trim()
        ) {
            return res.status(400).json({
                message: "Name, email, and course are required"
            });
        }

        const [result] = await db.execute(
            `UPDATE students
             SET name = ?, email = ?, course = ?
             WHERE id = ?`,
            [name.trim(), email.trim(), course.trim(), id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated successfully" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This email already exists"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Failed to update student" });
    }
});

// DELETE: Delete a student
app.delete("/api/students/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const [result] = await db.execute(
            "DELETE FROM students WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete student" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
