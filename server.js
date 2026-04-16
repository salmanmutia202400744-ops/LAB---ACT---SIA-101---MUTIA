const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// DATA
let students = [
    { id: 1, name: "Juan Dela Cruz", course: "BSIT", yearLevel: "1st Year", age: 19, status: "Regular" },
    { id: 2, name: "Maria Santos", course: "BSCS", yearLevel: "2nd Year", age: 20, status: "Irregular" }
];

// ROOT
app.get("/", (req, res) => {
    res.send("Student Records API is running");
});

// GET ALL
app.get("/api/students", (req, res) => {
    res.json(students);
});

// GET BY ID
app.get("/api/students/:id", (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
});

// ADD STUDENT (FIXED)
app.post("/api/students", (req, res) => {
    const { name, course, yearLevel, age, status } = req.body;

    if (!name || !course) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const newStudent = {
        id: students.length + 1,
        name,
        course,
        yearLevel,
        age,
        status
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
});

// UPDATE STUDENT
app.put("/api/students/:id", (req, res) => {
    const student = students.find(s => s.id == req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    Object.assign(student, req.body);
    res.json(student);
});

// DELETE STUDENT
app.delete("/api/students/:id", (req, res) => {
    students = students.filter(s => s.id != req.params.id);
    res.json({ message: "Deleted successfully" });
});

// SEARCH
app.get("/api/search", (req, res) => {
    const q = (req.query.name || "").toLowerCase();
    const result = students.filter(s => s.name.toLowerCase().includes(q));
    res.json(result);
});

// RANDOM
app.get("/api/random", (req, res) => {
    const random = students[Math.floor(Math.random() * students.length)];
    res.json(random);
});

// STATS
app.get("/api/stats", (req, res) => {
    res.json({
        total: students.length,
        regular: students.filter(s => s.status === "Regular").length
    });
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});