"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaChartLine, FaTimes } from "react-icons/fa"; // Added icons
import { MdOutlineDateRange } from "react-icons/md"; // Icon for day number
import { useSession } from "next-auth/react";

// Custom Error Message Component
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-400 bg-red-900/30 border border-red-700 p-3 rounded-md mb-6 text-center">
      {message}
    </p>
  );
};

export default function ProgressListPage() {
  const { status } = useSession();

  const [progresses, setProgresses] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({
    dayNumber: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProgresses();
  }, []);

  const fetchProgresses = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await fetch("/api/v1/progress");
      if (!res.ok) throw new Error("Failed to fetch progress entries.");
      const data = await res.json();
      setProgresses(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load progress entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.dayNumber || !form.title.trim()) {
      setError("Day Number and Title are required.");
      return;
    }
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading for the creation process
    try {
      const res = await fetch("/api/v1/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newProgress = await res.json();
        // Optimistic update: Add new progress to the list immediately
        setProgresses((prev) => [...prev, newProgress]);
        setForm({ dayNumber: "", title: "", description: "" }); // Clear form
        setShowDrawer(false); // Close drawer
        // Optionally, navigate after a short delay or just let the list update
        // router.push(`/progress/${newProgress._id}`);
      } else {
        throw new Error("Failed to create progress entry.");
      }
    } catch (err) {
      console.error("Create progress error:", err);
      setError("Could not create progress entry. Please try again.");
    } finally {
      setLoading(false); // End loading for the creation process
    }
  };

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
    <div className="min-h-screen px-4 py-8 sm:px-6 md:py-12 text-green-100 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-lime-300 flex items-center gap-4">
            <FaChartLine className="text-lime-400" /> Daily Progress
          </h1>
          <button
            onClick={() => setShowDrawer(true)}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-5 py-2 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <FaPlus /> Add Progress
          </button>
        </div>

        <ErrorMessage message={error} />

        {loading ? (
          <p className="text-green-300 text-lg text-center animate-pulse">
            Loading progress entries...
          </p>
        ) : progresses.length === 0 ? (
          <p className="text-green-300 italic text-lg text-center">
            No progress entries yet. Add one to start tracking!
          </p>
        ) : (
          <ul className="space-y-4">
            {progresses.map((item) => (
              <li
                key={item._id}
                onClick={() => router.push(`/progress/${item._id}`)}
                className="bg-green-800/60 border border-green-700 rounded-xl p-5 shadow-lg cursor-pointer transition duration-300 hover:bg-green-700/60 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-lime-200 flex items-center gap-2">
                    <MdOutlineDateRange className="text-lime-400" /> Day{" "}
                    {item.dayNumber}
                  </h3>
                  <span className="text-sm text-green-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-lg font-semibold text-green-100 mb-2">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-green-300 text-sm line-clamp-2">
                    {item.description}
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
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex justify-end z-50 animate-slide-in-right">
          <div className="w-full sm:w-96 bg-black/60 border-l border-green-700 p-6 h-full shadow-2xl relative">
            <button
              onClick={() => setShowDrawer(false)}
              className="absolute top-4 right-4 text-green-300 hover:text-red-400 transition duration-300 text-2xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-lime-200 mb-6">
              Add New Progress
            </h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Day Number (e.g., 1, 2, 3)"
                className="w-full px-4 py-2 rounded-lg bg-green-800/70 border border-green-600 placeholder-green-400 text-green-100 focus:outline-none focus:ring-2 focus:ring-lime-500 transition duration-200"
                value={form.dayNumber}
                onChange={(e) =>
                  setForm({ ...form, dayNumber: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Title (e.g., Project Kick-off, Feature X Completed)"
                className="w-full px-4 py-2 rounded-lg bg-green-800/70 border border-green-600 placeholder-green-400 text-green-100 focus:outline-none focus:ring-2 focus:ring-lime-500 transition duration-200"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Short Description (e.g., Outlined initial project scope and team roles.)"
                className="w-full px-4 py-2 rounded-lg bg-green-800/70 border border-green-600 placeholder-green-400 text-green-100 focus:outline-none focus:ring-2 focus:ring-lime-500 transition duration-200 resize-y"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDrawer(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-2 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-5 py-2 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Progress
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
