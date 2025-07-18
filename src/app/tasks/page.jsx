"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaRegListAlt } from "react-icons/fa"; // Added icons for add task and list
import LoginFirst from "@/components/LoginFirst";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function TasksPage() {
  const { status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    if (status === "authenticated") {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
        setError("");
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Could not load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (status === "unauthenticated") {
      toast.error("Login First");
    }
  }

  async function createTask() {
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/v1/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description, dueDate }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create task");
      setTitle("");
      setDescription("");
      setDueDate("");
      setError(""); // Clear any previous errors
      fetchTasks();
    } catch (err) {
      console.error("Create task error:", err);
      setError("Could not create task. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginFirst />;
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 md:py-14 font-inter text-white bg-gradient-to-br from-[#0e0e1a] via-[#111827] to-[#0e0e1a]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-300 mb-10 text-center flex items-center justify-center gap-3">
          <FaRegListAlt className="text-indigo-400" /> Task Manager
        </h1>

        {/* Add Task Section */}
        <div className="bg-[#1f2937] border border-[#374151] p-6 rounded-2xl shadow-xl mb-12 space-y-5">
          <h2 className="text-2xl font-semibold text-indigo-200">
            Add New Task
          </h2>

          <input
            type="text"
            placeholder="Task Title (e.g., Finish project report)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-[#111827] border border-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 rounded-md bg-[#111827] border border-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
          />

          <div>
            <label
              htmlFor="dueDate"
              className="block text-gray-400 text-sm mb-1"
            >
              Due Date (optional):
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-[#111827] border border-[#374151] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            onClick={createTask}
            className="w-full mt-4 px-5 py-3 rounded-lg font-medium bg-indigo-500 hover:bg-indigo-400 text-white shadow-md hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            <FaPlus /> Create Task
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-300 bg-red-900/30 border border-red-700 px-4 py-3 rounded-md mb-8 text-center text-sm shadow-sm">
            {error}
          </p>
        )}

        {/* Task List */}
        {loading ? (
          <p className="text-indigo-300 text-lg text-center animate-pulse">
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400 italic text-lg text-center">
            No tasks yet. Start by adding one above!
          </p>
        ) : (
          <ul className="space-y-5">
            {tasks.map((task) => (
              <li key={task._id}>
                <Link
                  href={`/tasks/${task._id}`}
                  className="block bg-[#1e293b] hover:bg-[#334155] transition-all duration-300 border border-[#475569] p-5 rounded-xl shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <span className="text-xl font-semibold text-indigo-200">
                      {task.title}
                    </span>
                    <span
                      className={`mt-2 sm:mt-0 px-3 py-1 text-xs sm:text-sm rounded-full font-medium capitalize ${
                        task.status === "done"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-700 text-indigo-300 border border-gray-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <p className="text-indigo-400 text-xs">
                      Due: {new Date(task.dueDate).toLocaleString()}
                    </p>
                  )}

                  <p className="text-indigo-300 text-sm mt-3 inline-flex items-center group">
                    View Details
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
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
