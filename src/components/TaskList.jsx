"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaRegListAlt } from "react-icons/fa"; // Added icons for add task and list

export default function TaskList() {
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
  }

  return (
    <main className="px-4 py-8 sm:px-6 md:py-12 text-green-100 font-inter">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold py-2 my-2 text-green-300">Tasks</h2>
        {loading ? (
          <p className="text-green-300 text-lg text-center animate-pulse">
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-green-300 italic text-lg text-center">
            No tasks yet. Start by adding one above!
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task._id}>
                <Link
                  href={`/tasks/${task._id}`}
                  className="block bg-green-800/60 hover:bg-green-700/60 transition duration-300 border border-green-700 p-5 rounded-xl shadow-lg transform hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <span className="text-xl font-bold text-lime-200 mb-1 sm:mb-0">
                      {task.title}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium capitalize ${
                        task.status === "done"
                          ? "bg-lime-500 text-black"
                          : "bg-green-700 text-lime-300 border border-green-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-green-300 text-sm mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <p className="text-green-400 text-xs mt-1">
                      Due: {new Date(task.dueDate).toLocaleString()}
                    </p>
                  )}
                  <p className="text-lime-400 text-sm mt-3 inline-flex items-center group">
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
                      ></path>
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
