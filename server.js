const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Sample Data
let students = [
    { id: 1, name: "Juan Dela Cruz", course: "BSIT", yearLevel: "1st Year", age: 19, status: "Regular" },
    { id: 2, name: "Maria Santos", course: "BSCS", yearLevel: "2nd Year", age: 20, status: "Irregular" }
];

// ROOT TEST
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

// ADD STUDENT
async function addStudent() {
    const student = {
        name: document.getElementById("name").value,
        course: document.getElementById("course").value,
        yearLevel: document.getElementById("yearLevel").value,
        age: document.getElementById("age").value,
        status: document.getElementById("status").value
    };

    await fetch(`${API}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    loadStudents();
}

// UPDATE STUDENT
async function updateStudent(id) {
    const student = {
        name: document.getElementById("name").value,
        course: document.getElementById("course").value,
        yearLevel: document.getElementById("yearLevel").value,
        age: document.getElementById("age").value,
        status: document.getElementById("status").value
    };

    await fetch(`${API}/students/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    loadStudents();
}

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

async function loadStudents() {
    const res = await fetch(`${API}/students`);
    const data = await res.json();

    let output = "";
    data.forEach(s => {
        output += `
      <li>
        ${s.name} - ${s.course}
        <button onclick="updateStudent(${s.id})">Edit</button>
      </li>
    `;
    });

    document.getElementById("list").innerHTML = output;
}

// PORT (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});