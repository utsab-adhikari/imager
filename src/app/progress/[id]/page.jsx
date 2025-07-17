"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaRegTrashAlt,
  FaPlus,
  FaSave,
  FaTimes,
  FaListUl,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { FaDotCircle } from "react-icons/fa";
import toast from "react-hot-toast";

// 💡 Custom Error Display
const ErrorMessage = ({ message }) =>
  message ? (
    <div className="text-red-300 bg-red-800/40 border border-red-600 p-3 rounded-md text-sm text-center">
      {message}
    </div>
  ) : null;

// 💡 Confirm Modal
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
    <div className="bg-green-900 border border-green-700 text-green-100 p-6 rounded-lg shadow-2xl w-[90%] max-w-md">
      <p className="text-lg font-semibold mb-6 text-center">{message}</p>
      <div className="flex justify-around gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition duration-200"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold transition duration-200"
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
      if (!res.ok) throw new Error("Failed to load progress");
      const data = await res.json();
      setProgress(data);
      setContent(data.content || []);
    } catch (err) {
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
    setContent([...content, newBullet.trim()]);
    setNewBullet("");
  };

  const removeBullet = (i) =>
    setContent(content.filter((_, index) => index !== i));

  const deleteProgress = async () => {
    try {
      const res = await fetch(`/api/v1/progress?id=${id}`, { method: "DELETE" });
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
      <div className="text-center py-32 text-green-300 animate-pulse">
        Loading progress entry...
      </div>
    );

  if (!progress)
    return (
      <div className="text-center py-32 text-red-300 text-lg">
        Progress entry not found.
      </div>
    );

  return (
    <main className="px-4 py-8 sm:px-6 md:py-12 text-green-100 max-w-4xl mx-auto font-inter space-y-10">
      {error && <ErrorMessage message={error} />}

      {/* Header */}
      <section className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-lg space-y-2">
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
          <p className="text-green-300">{progress.description}</p>
        )}
        <p className="text-green-400 text-sm">
          Created: {new Date(progress.createdAt).toLocaleDateString()}
        </p>
      </section>

      {/* Log Entries */}
      <section className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-lime-200">
          <FaListUl className="text-2xl" /> Daily Progress
        </h2>

        {content.length > 0 ? (
          <ul className="space-y-2">
            {content.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-green-700/50 border border-green-600 p-3 rounded-md"
              >
                <span className="flex gap-3 items-center text-green-100">
                  <FaDotCircle className="text-lime-400" /> {item}
                </span>
                <button
                  onClick={() => removeBullet(i)}
                  className="text-red-400 hover:text-red-300 text-lg"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-400 italic">No entries yet.</p>
        )}

        {/* Add Bullet Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newBullet}
            onChange={(e) => setNewBullet(e.target.value)}
            placeholder="Add a bullet point..."
            className="flex-1 px-4 py-2 rounded-md bg-green-800/70 border border-green-600 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
          <button
            onClick={addBullet}
            className="bg-lime-500 hover:bg-lime-400 text-black px-5 py-2 rounded-md font-semibold flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

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
