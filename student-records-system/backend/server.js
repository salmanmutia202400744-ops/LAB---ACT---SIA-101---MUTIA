const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let students = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    course: 'BSIT',
    yearLevel: '1st Year',
    age: 19,
    status: 'Regular',
  },
  {
    id: 2,
    name: 'Maria Santos',
    course: 'BSCS',
    yearLevel: '2nd Year',
    age: 20,
    status: 'Irregular',
  },
  {
    id: 3,
    name: 'Pedro Cruz',
    course: 'BSIS',
    yearLevel: '3rd Year',
    age: 21,
    status: 'Regular',
  },
  {
    id: 4,
    name: 'Ana Reyes',
    course: 'BSIT',
    yearLevel: '4th Year',
    age: 22,
    status: 'Regular',
  },
];

app.get('/api/students', (req, res) => res.json(students));

app.get('/api/students/:id', (req, res) => {
  const student = students.find((s) => s.id == req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

app.post('/api/students', (req, res) => {
  const { name, course, yearLevel, age, status } = req.body;
  if (!name || !course)
    return res.status(400).json({ message: 'Missing fields' });
  const newStudent = {
    id: students.length + 1,
    name,
    course,
    yearLevel,
    age,
    status,
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req, res) => {
  const student = students.find((s) => s.id == req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  Object.assign(student, req.body);
  res.json(student);
});

app.delete('/api/students/:id', (req, res) => {
  students = students.filter((s) => s.id != req.params.id);
  res.json({ message: 'Deleted successfully' });
});

app.get('/api/students/year/:yearLevel', (req, res) => {
  res.json(students.filter((s) => s.yearLevel === req.params.yearLevel));
});

app.get('/api/search', (req, res) => {
  const q = (req.query.name || '').toLowerCase();
  res.json(students.filter((s) => s.name.toLowerCase().includes(q)));
});

app.get('/api/stats', (req, res) =>
  res.json({ totalStudents: students.length })
);

app.get('/api/random', (req, res) => {
  const random = students[Math.floor(Math.random() * students.length)];
  res.json(random);
});

app.get('/api/regular', (req, res) => {
  res.json(students.filter((s) => s.status === 'Regular'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
