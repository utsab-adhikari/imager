"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaRegTrashAlt,
  FaPlus,
  FaSave,
  FaTimes,
  FaListUl,
  FaDotCircle,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import toast from "react-hot-toast";

// ✅ Error Message
const ErrorMessage = ({ message }) =>
  message ? (
    <div className="text-red-300 bg-red-800/40 border border-red-600 p-3 rounded-md text-sm text-center">
      {message}
    </div>
  ) : null;

// ✅ Confirm Modal
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
    <div className="bg-[#1c1e26] border border-lime-500 text-white p-6 rounded-lg shadow-2xl w-[90%] max-w-md">
      <p className="text-lg font-semibold mb-6 text-center">{message}</p>
      <div className="flex justify-around gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default function ProgressDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [progress, setProgress] = useState(null);
  const [content, setContent] = useState([]);
  const [newBullet, setNewBullet] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/progress?id=${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProgress(data);
      setContent(data.content || []);
    } catch {
      setError("Could not load progress entry.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProgress();
  }, [id, fetchProgress]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/progress?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      toast.success("Progress saved!");
    } catch {
      setError("Could not save. Try again.");
    }
  };

  const addBullet = () => {
    if (!newBullet.trim()) return;
    setContent((prev) => [...prev, newBullet.trim()]);
    setNewBullet("");
  };

  const removeBullet = (i) =>
    setContent((prev) => prev.filter((_, index) => index !== i));

  const deleteProgress = async () => {
    try {
      const res = await fetch(`/api/v1/progress?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Progress deleted.");
      router.push("/progress");
    } catch {
      setError("Failed to delete progress.");
    } finally {
      setShowModal(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-32 text-lime-300 animate-pulse">
        Loading progress entry...
      </div>
    );

  if (!progress)
    return (
      <div className="text-center py-32 text-red-400 text-lg">
        Progress entry not found.
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0f1117] px-4 py-10 sm:px-6 md:py-14 text-white max-w-4xl mx-auto font-sans space-y-10">
      {error && <ErrorMessage message={error} />}

      {/* Header */}
      <section className="bg-[#1c1e26] border border-lime-500 p-6 rounded-xl shadow-md space-y-2">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl sm:text-3xl font-bold text-lime-300 flex items-center gap-3">
            <MdOutlineDateRange className="text-3xl" />
            Day {progress.dayNumber}: {progress.title}
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2"
          >
            <FaRegTrashAlt /> Delete
          </button>
        </div>
        {progress.description && (
          <p className="text-gray-300">{progress.description}</p>
        )}
        <p className="text-gray-500 text-sm">
          Created: {new Date(progress.createdAt).toLocaleDateString()}
        </p>
      </section>

      {/* Bullet Entries */}
      <section className="bg-[#1c1e26] border border-gray-700 p-6 rounded-xl shadow space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-lime-300 flex items-center gap-2">
            <FaListUl /> Daily Log
          </h2>
        </div>

        {content.length > 0 ? (
          <ul className="space-y-3">
            {content.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-[#2a2d3a] border border-gray-600 px-4 py-3 rounded-md"
              >
                <span className="flex items-center gap-3 text-gray-100">
                  <FaDotCircle className="text-lime-400" />
                  {item}
                </span>
                <button
                  onClick={() => removeBullet(i)}
                  className="text-red-400 hover:text-red-300"
                  title="Remove bullet"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No log entries yet.</p>
        )}

        {/* Add Bullet Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newBullet}
            onChange={(e) => setNewBullet(e.target.value)}
            placeholder="Add a bullet point..."
            className="flex-1 px-4 py-2 rounded-md bg-[#2a2d3a] border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-lime-400 focus:outline-none"
          />
          <button
            onClick={addBullet}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-5 py-2 rounded-md flex items-center gap-2 transition hover:scale-105"
          >
            <FaPlus /> Add
          </button>
        </div>

        {/* 🔔 Save Warning */}
        <p className="text-yellow-300 bg-yellow-900/30 border border-yellow-700 px-4 py-2 rounded-md text-sm mt-4">
          ⚠️ Don't forget to <strong>save</strong> after adding or deleting
          entries.
        </p>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-bold flex items-center justify-center gap-2 transition hover:scale-105"
        >
          <FaSave /> Save Progress
        </button>
      </section>

      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete this progress entry?"
          onConfirm={deleteProgress}
          onCancel={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
