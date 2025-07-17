"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { FaRegTrashAlt, FaCheckCircle, FaTasks } from "react-icons/fa"; // Added icons for delete, checkmark, and tasks

// Custom Confirmation Modal Component (reused from TaskDetail for consistency)
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
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

export default function TaskList({ parentId = null }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [parentId]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const url = `/api/v1/tasks${parentId ? `?parent=${parentId}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (id, status) => {
    const nextStatus = status === "done" ? "todo" : "done";
    try {
      await fetch(`/api/v1/tasks?id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
        headers: { "Content-Type": "application/json" },
      });
      fetchTasks(); // Re-fetch to update the list
    } catch (err) {
      console.error("Error toggling task status:", err);
      setError("Could not update task status.");
    }
  };

  const handleDeleteClick = (id) => {
    setTaskToDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmRemove = async () => {
    setShowConfirmModal(false);
    if (!taskToDeleteId) return;
    try {
      await fetch(`/api/v1/tasks?id=${taskToDeleteId}`, {
        method: "DELETE",
      });
      setTaskToDeleteId(null);
      fetchTasks(); // Re-fetch to update the list
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Could not delete task.");
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setTaskToDeleteId(null);
  };

  if (loading) {
    return (
      <div className="mt-16 text-center text-green-300 text-lg animate-pulse">
        Loading {parentId ? "subtasks" : "tasks"}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 text-center text-red-400 bg-red-900/30 border border-red-700 p-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-10 md:mt-16">
      <h2 className="text-3xl font-bold text-lime-300 mb-6 flex items-center gap-3">
        {parentId ? (
          <>🌿 Subtasks</>
        ) : (
          <>
            <FaTasks className="text-lime-400" /> All Tasks
          </>
        )}
      </h2>

      {tasks.length === 0 ? (
        <p className="text-green-300 italic text-lg text-center">
          No {parentId ? "subtasks" : "tasks"} yet.
        </p>
      ) : (
        <div className="space-y-4">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-green-800/60 border border-green-700 rounded-xl p-5 text-green-100 shadow-lg transition duration-300 hover:bg-green-700/60 transform hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                {/* Title & Link */}
                <div className="flex-1 mb-3 sm:mb-0">
                  <Link href={`/tasks/${t._id}`} className="block">
                    <h3 className="text-xl font-bold text-lime-200 hover:underline">
                      {t.title}
                    </h3>
                  </Link>
                  {t.description && (
                    <p className="text-green-300 text-sm mt-1 line-clamp-2">
                      {t.description}
                    </p>
                  )}
                  {t.dueDate && (
                    <p className="text-green-400 text-xs mt-2">
                      Due: {new Date(t.dueDate).toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm text-green-300 flex flex-nowrap gap-2 items-center mt-2">
                    Status:{" "}
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${
                        t.status === "done"
                          ? "bg-lime-500 text-black"
                          : "bg-green-700 text-lime-300 border border-green-600"
                      }`}
                    >
                      {t.status}
                    </span>
                    {t.status === "done" && (
                      <IoCheckmarkDoneCircleSharp className="text-blue-400 text-lg" />
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-4 sm:mt-0 sm:ml-4 justify-end">
                  <button
                    onClick={() => toggleDone(t._id, t.status)}
                    className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-semibold text-black transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2
                      ${
                        t.status === "done"
                          ? "bg-amber-400 hover:bg-amber-300"
                          : "bg-lime-500 hover:bg-lime-400"
                      }`}
                  >
                    <FaCheckCircle className="text-sm" />
                    {t.status === "done" ? "Reopen" : "Mark Done"}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(t._id)}
                    className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                  >
                    <FaRegTrashAlt className="text-sm" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this task?"
          onConfirm={confirmRemove}
          onCancel={handleCancelModal}
        />
      )}
    </div>
  );
}
