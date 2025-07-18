"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
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
    <section className="px-4 py-10 sm:px-6 md:py-14 text-white font-inter bg-transparent">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-lime-400 border-b border-gray-700 pb-2">
          Your Tasks
        </h2>

        {loading ? (
          <p className="text-cyan-300 text-center text-lg animate-pulse">
            Loading tasks...
          </p>
        ) : error ? (
          <p className="text-red-400 text-center text-lg">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400 italic text-center text-lg">
            No tasks yet. Add your first task to get started!
          </p>
        ) : (
          <ul className="space-y-5">
            {tasks.map((task) => (
              <li key={task._id}>
                <Link
                  href={`/tasks/${task._id}`}
                  className="block p-6 rounded-xl bg-[#1c1e26] border border-gray-700 hover:border-lime-400 shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-lime-300 group-hover:underline">
                      {task.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide capitalize ${
                        task.status === "done"
                          ? "bg-lime-500 text-black"
                          : "bg-gray-800 text-lime-300 border border-lime-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {task.dueDate && (
                    <p className="text-gray-500 text-xs">
                      📅 Due:{" "}
                      <span className="text-gray-300">
                        {new Date(task.dueDate).toLocaleString()}
                      </span>
                    </p>
                  )}

                  <p className="text-lime-400 text-sm mt-4 inline-flex items-center group-hover:translate-x-1 transition-transform">
                    View Details
                    <svg
                      className="w-4 h-4 ml-2 transition-transform transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
    </section>
  );
}
