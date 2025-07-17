"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaRegTrashAlt, FaPlus, FaSave, FaTimes, FaListUl, FaArrowLeft } from 'react-icons/fa'; // Added icons
import { MdOutlineDateRange } from 'react-icons/md';
import { FaDotCircle } from "react-icons/fa";

// Custom Error Message Component (reused)
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-400 bg-red-900/30 border border-red-700 p-3 rounded-md mb-6 text-center">
      {message}
    </p>
  );
};

// Custom Confirmation Modal Component (reused)
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-green-800 border border-green-700 rounded-lg p-6 shadow-2xl max-w-sm w-full text-green-100">
        <p className="text-lg font-semibold mb-6 text-center">{message}</p>
        <div className="flex justify-around gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-md"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProgressDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [newBullet, setNewBullet] = useState('');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchProgressData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/progress?id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch progress details.');
      const data = await res.json();
      setProgress(data);
      setContent(data.content || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not load progress details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProgressData();
  }, [id, fetchProgressData]);

  const handleSave = async () => {
    setError('');
    const originalContent = content; // For rollback
    try {
      const res = await fetch(`/api/v1/progress?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error('Failed to save progress.');
      }
      // Optionally, show a success message
    } catch (err) {
      console.error('Save progress error:', err);
      setError('Could not save progress. Please try again.');
      setContent(originalContent); // Rollback on error
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    setError('');
    try {
      const res = await fetch(`/api/v1/progress?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/progress');
      } else {
        throw new Error('Failed to delete progress.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Could not delete progress. Please try again.');
    }
  };

  const addBullet = () => {
    if (newBullet.trim() !== '') {
      const updatedContent = [...content, newBullet.trim()];
      setContent(updatedContent);
      setNewBullet('');
      // Optimistically save after adding, or wait for explicit save
      // handleSave(); // Uncomment if you want immediate save on add
    }
  };

  const removeBullet = (indexToRemove) => {
    const originalContent = content; // For rollback
    const updatedContent = content.filter((_, i) => i !== indexToRemove);
    setContent(updatedContent);
    // Optimistically save after removing, or wait for explicit save
    // handleSave(); // Uncomment if you want immediate save on remove

    // If you want to handle API call for remove immediately:
    // try {
    //   // Make API call to remove from backend
    //   // If it fails, setContent(originalContent) and show error
    // } catch (err) { ... }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-green-200 flex items-center justify-center font-inter">
        <p className="text-xl animate-pulse">Loading progress details...</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen text-red-400 flex items-center justify-center font-inter">
        <p className="text-xl">Progress entry not found 😔</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 md:py-12 text-green-100 font-inter">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/progress" className="inline-flex items-center text-lime-400 hover:text-lime-300 transition duration-300 text-base font-medium group">
          <FaArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Progress List
        </Link>

        <ErrorMessage message={error} />

        {/* Progress Detail Card */}
        <div className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-extrabold text-lime-300 flex items-center gap-3">
              <MdOutlineDateRange className="text-4xl" /> Day {progress.dayNumber}: {progress.title}
            </h1>
            <button
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              <FaRegTrashAlt /> Delete
            </button>
          </div>
          {progress.description && (
            <p className="text-base text-green-300 mb-4">{progress.description}</p>
          )}
          <p className="text-green-400 text-sm">
            Created on: {new Date(progress.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Progress Content Section */}
        <div className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-lime-200 mb-4 flex items-center gap-2">
            <FaListUl className="text-3xl" /> Daily Log
          </h2>

          {content.length === 0 ? (
            <p className="text-green-400 text-base italic mb-6">No log entries yet. Add your first bullet point!</p>
          ) : (
            <ul className="space-y-3 mb-6">
              {content.map((bullet, index) => (
                <li
                  key={index}
                  className="bg-green-700/50 border border-green-600 p-4 rounded-md flex justify-between items-center shadow-md transition duration-300 hover:bg-green-700/70"
                >
                  <span className="text-green-100 text-base flex-1 pr-4 flex felx-nowrap items-center gap-3"><FaDotCircle/>{bullet}</span>
                  <button
                    className="text-red-400 hover:text-red-300 transition duration-300 text-xl p-1 rounded-full hover:bg-red-900/30"
                    onClick={() => removeBullet(index)}
                    aria-label="Remove bullet point"
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={newBullet}
              onChange={(e) => setNewBullet(e.target.value)}
              placeholder="Add a new log entry..."
              className="flex-1 px-4 py-2 rounded-lg bg-green-800/70 border border-green-600 placeholder-green-400 text-green-100 focus:outline-none focus:ring-2 focus:ring-lime-500 transition duration-200"
            />
            <button
              onClick={addBullet}
              className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-5 py-2 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Entry
            </button>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <FaSave /> Save Log
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this progress entry?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </main>
  );
}
