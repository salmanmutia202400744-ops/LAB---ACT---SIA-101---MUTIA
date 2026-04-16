const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = "https://dxyhdmtgvkrzgmwsejkv.supabase.co";
const supabaseKey = "sb_publishable_pNNLiIG50JZRwxUgEcE_uA_vxkkADyd";
const supabase = createClient(supabaseUrl, supabaseKey);

// ROOT
app.get("/", (req, res) => {
  res.send("Student API with Supabase is running");
});


app.get("/api/students", async (req, res) => {
  const { data, error } = await supabase.from("students").select("*");

  if (error) return res.status(500).json(error);

  res.json(data);
});


app.get("/api/students/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ message: "Not found" });

  res.json(data);
});


app.post("/api/students", async (req, res) => {
  const { name, course, yearLevel, age, status } = req.body;

  const { data, error } = await supabase
    .from("students")
    .insert([{ name, course, yearLevel, age, status }])
    .select();

  if (error) return res.status(400).json(error);

  res.status(201).json(data);
});


app.put("/api/students/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("students")
    .update(req.body)
    .eq("id", req.params.id)
    .select();

  if (error) return res.status(400).json(error);

  res.json(data);
});


app.delete("/api/students/:id", async (req, res) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json(error);

  res.json({ message: "Deleted successfully" });
});


app.get("/api/search", async (req, res) => {
  const q = req.query.name;

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .ilike("name", `%${q}%`);

  res.json(data);
});


app.get("/api/random", async (req, res) => {
  const { data } = await supabase.from("students").select("*");

  const random = data[Math.floor(Math.random() * data.length)];
  res.json(random);
});


app.get("/api/stats", async (req, res) => {
  const { data } = await supabase.from("students").select("*");

  res.json({
    total: data.length,
    regular: data.filter(s => s.status === "Regular").length
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});