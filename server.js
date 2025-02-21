const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
const PORT = 3000;

// ✅ Connect to MongoDB Atlas
mongoose
    .connect("mongodb+srv://shadab:nQL3BT5fJCZWX5aR@cluster0.o2mbk.mongodb.net/")
    .then(() => console.log("👌 Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.json()); // Middleware to parse JSON data

// ✅ Get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// ✅ Add a new task
app.post("/tasks", async (req, res) => {
    const title = req.body.title;
    if (!title) {
        return res.status(400).json({ message: "Task title is required" });
    }

    const newTask = new Task({ title });
    await newTask.save();
    res.status(201).json(newTask);
});

// ✅ Update a task (Toggle Completed)
app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

// ✅ Delete a task
app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
