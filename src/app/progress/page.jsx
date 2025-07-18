"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaChartLine, FaTimes } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { useSession } from "next-auth/react";
import LoginFirst from "@/components/LoginFirst";
import toast from "react-hot-toast";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-400 bg-red-900/20 border border-red-700 p-3 rounded-md mb-6 text-center">
      {message}
    </p>
  );
};

export default function ProgressListPage() {
  const { status } = useSession();
  const router = useRouter();

  const [progresses, setProgresses] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({ dayNumber: "", title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgresses();
  }, []);

  const fetchProgresses = async () => {
    if (status === "authenticated") {
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
    } else if (status === "unauthenticated") {
      toast.error("Login first");
    }
  };

  const handleCreate = async () => {
    if (!form.dayNumber || !form.title.trim()) {
      setError("Day Number and Title are required.");
      return;
    }

    try {
      const res = await fetch("/api/v1/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newProgress = await res.json();
        setProgresses((prev) => [...prev, newProgress]);
        setForm({ dayNumber: "", title: "", description: "" });
        setShowDrawer(false);
      } else {
        throw new Error("Failed to create progress entry.");
      }
    } catch (err) {
      console.error("Create error:", err);
      setError("Could not create progress entry. Try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <span className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") return <LoginFirst />;

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 py-10 sm:px-6 md:py-14 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-400 flex items-center gap-3">
            <FaChartLine /> Daily Progress
          </h1>
          <button
            onClick={() => setShowDrawer(true)}
            className="bg-lime-500 hover:bg-lime-400 text-black font-medium px-4 py-2 rounded-lg transition hover:scale-105 shadow-md flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

        <ErrorMessage message={error} />

        {loading ? (
          <p className="text-lime-300 text-lg text-center animate-pulse">Loading entries...</p>
        ) : progresses.length === 0 ? (
          <p className="text-gray-400 italic text-center">No progress yet. Add your first update.</p>
        ) : (
          <ul className="space-y-4">
            {progresses.map((item) => (
              <li
                key={item._id}
                onClick={() => router.push(`/progress/${item._id}`)}
                className="bg-[#1c1e26] border border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md cursor-pointer transition hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-lime-300 flex items-center gap-2">
                    <MdOutlineDateRange /> Day {item.dayNumber}
                  </h3>
                  <span className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-lg font-medium text-gray-100 mb-1">{item.title}</p>
                {item.description && <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>}
                <p className="text-lime-500 text-sm mt-3 flex items-center group">
                  View Details
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showDrawer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-end z-50 animate-slide-in-right">
          <div className="w-full sm:w-96 bg-[#15171f] border-l border-lime-500 p-6 h-full shadow-2xl relative">
            <button
              onClick={() => setShowDrawer(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition text-xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-lime-300 mb-6">Add Progress</h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Day Number"
                className="w-full px-4 py-2 rounded-md bg-[#2a2d3a] border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-lime-400 focus:outline-none"
                value={form.dayNumber}
                onChange={(e) => setForm({ ...form, dayNumber: e.target.value })}
              />
              <input
                type="text"
                placeholder="Title"
                className="w-full px-4 py-2 rounded-md bg-[#2a2d3a] border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-lime-400 focus:outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-2 rounded-md bg-[#2a2d3a] border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-lime-400 focus:outline-none resize-y"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDrawer(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md transition hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-5 py-2 rounded-md transition hover:scale-105 shadow"
              >
                Save
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
