"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function createTask() {
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/v1/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create task");

      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Create task error:", err);
      setError("Could not create task.");
    }
  }

  return (
    <main className="min-h-screen bg-green-900/10 px-6 py-10 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-lime-300 mb-8">
          📝 Task Manager
        </h1>

        {/* Task Creation */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
          <input
            type="text"
            placeholder="Enter new task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-green-800/60 border border-green-700 placeholder-green-400 text-green-100 focus:outline-none w-full sm:w-auto"
          />
          <button
            onClick={createTask}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-5 py-2 rounded transition"
          >
            + Create Task
          </button>
        </div>

        {/* Error or Loading */}
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {loading ? (
          <p className="text-green-300">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-green-300 italic">No tasks yet. Start by creating one!</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task._id}>
                <Link
                  href={`/tasks/${task._id}`}
                  className="block bg-green-800/60 hover:bg-green-700/60 transition border border-green-700 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-lime-200">{task.title}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        task.status === "done"
                          ? "bg-lime-500 text-black"
                          : "bg-green-700 text-lime-300"
                      }`}
                    >
                      {task.status || "todo"}
                    </span>
                  </div>
                  <p className="text-green-300 text-sm mt-1 underline">
                    View Details →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
