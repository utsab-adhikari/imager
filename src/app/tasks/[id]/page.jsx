"use client"
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation"; // Assuming Next.js environment
import Link from "next/link";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { FaRegTrashAlt, FaPlus } from "react-icons/fa"; // Icons for delete, add
import { MdOutlineAccessTimeFilled } from "react-icons/md"; // Icon for countdown

// --- Helper Functions ---
function getTimeRemaining(deadline) {
  const total = Date.parse(deadline) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

function formatTime(t) {
  if (t.total <= 0) return "Deadline passed";
  const parts = [];
  if (t.days > 0) parts.push(`${t.days}d`);
  if (t.hours > 0) parts.push(`${t.hours}h`);
  if (t.minutes > 0) parts.push(`${t.minutes}m`);
  if (t.seconds > 0) parts.push(`${t.seconds}s`);
  return parts.join(" ");
}

// --- Components ---

// Countdown Display Component
const CountdownDisplay = ({ dueDate }) => {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!dueDate) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(dueDate);
      setCountdown(remaining);
      if (remaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  if (!dueDate) return null;

  const isPassed = countdown?.total <= 0;

  return (
    <div className={`bg-gradient-to-br ${isPassed ? 'from-red-700 to-red-900' : 'from-emerald-700 to-emerald-900'} p-4 rounded-lg shadow-lg text-white text-center flex flex-col items-center justify-center`}>
      <MdOutlineAccessTimeFilled className="text-4xl mb-2" />
      <p className="text-sm font-light mb-1">Due Date:</p>
      <p className="text-lg font-semibold mb-2">{new Date(dueDate).toLocaleString()}</p>
      <p className={`text-xl font-bold ${isPassed ? 'text-red-300' : 'text-emerald-300'}`}>
        {countdown ? formatTime(countdown) : "Calculating..."}
      </p>
      {isPassed && <p className="text-red-200 text-xs mt-1">This task is overdue.</p>}
    </div>
  );
};

// Custom Confirmation Modal Component
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

// Main Task Detail Component
export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'deleteTask' or 'deleteSubtask'
  const [subtaskToDelete, setSubtaskToDelete] = useState(null); // Stores subtask object for deletion

  const fetchTaskData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, subtaskRes] = await Promise.all([
        fetch(`/api/v1/tasks?id=${id}`),
        fetch(`/api/v1/tasks?parent=${id}`),
      ]);

      const taskData = await taskRes.json();
      const subtaskData = await subtaskRes.json();

      setTask(taskData);
      setSubtasks(subtaskData);
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchTaskData();
  }, [id, fetchTaskData]);

  const toggleStatus = async () => {
    if (!task) return;
    const nextStatus = task.status === "done" ? "todo" : "done";
    try {
      const res = await fetch(`/api/v1/tasks?id=${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const updated = await res.json();
      setTask(updated);
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const handleDeleteTask = () => {
    setModalAction('deleteTask');
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    setShowConfirmModal(false);
    if (!task) return;
    try {
      await fetch(`/api/v1/tasks?id=${task._id}`, { method: "DELETE" });
      router.push("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addSubtask = async () => {
    if (!newSubtask.trim()) return;
    try {
      await fetch("/api/v1/tasks", {
        method: "POST",
        body: JSON.stringify({ title: newSubtask, parent: id }),
        headers: { "Content-Type": "application/json" },
      });
      setNewSubtask("");
      fetchTaskData();
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const toggleSubtaskStatus = async (sub) => {
    const next = sub.status === "done" ? "todo" : "done";
    try {
      await fetch(`/api/v1/tasks?id=${sub._id}`, {
        method: "PUT",
        body: JSON.stringify({ status: next }),
        headers: { "Content-Type": "application/json" },
      });
      fetchTaskData(); // Re-fetch all data to ensure consistency
    } catch (error) {
      console.error("Error toggling subtask status:", error);
    }
  };

  const handleDeleteSubtask = (sub) => {
    setSubtaskToDelete(sub);
    setModalAction('deleteSubtask');
    setShowConfirmModal(true);
  };

  const confirmDeleteSubtask = async () => {
    setShowConfirmModal(false);
    if (!subtaskToDelete) return;
    try {
      await fetch(`/api/v1/tasks?id=${subtaskToDelete._id}`, {
        method: "DELETE",
      });
      setSubtaskToDelete(null);
      fetchTaskData(); // Re-fetch all data to ensure consistency
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setModalAction(null);
    setSubtaskToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen text-green-200 flex items-center justify-center font-inter">
        <p className="text-xl animate-pulse">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen text-red-400 flex items-center justify-center font-inter">
        <p className="text-xl">Task not found 😔</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-green-100 px-4 py-8 sm:px-6 md:py-12 font-inter">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/tasks" className="inline-flex items-center text-lime-400 hover:text-lime-300 transition duration-300 text-base font-medium group">
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Task List
        </Link>

        {/* Main Task Card and Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-extrabold text-lime-300 mb-3 flex items-center gap-3">
              <span className="text-4xl">🎯</span> {task.title}
            </h2>
            {task.description && (
              <p className="text-base text-green-300 mb-3">{task.description}</p>
            )}
            <p className="text-sm text-green-300 mb-2 flex items-center gap-2">
              Status: <span className="font-semibold capitalize">{task.status}</span>
              {task.status === "done" && (
                <IoCheckmarkDoneCircleSharp className="text-blue-400 text-xl" />
              )}
            </p>
            <p className="text-green-400 text-xs mb-4">Task ID: <span className="font-mono">{task._id}</span></p>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={toggleStatus}
                className={`flex-1 min-w-[120px] px-5 py-2 rounded-lg font-semibold text-black transition duration-300 transform hover:scale-105 shadow-lg
                  ${task.status === "done" ? "bg-amber-400 hover:bg-amber-300" : "bg-lime-500 hover:bg-lime-400"}`}
              >
                {task.status === "done" ? "Reopen Task" : "Mark Done"}
              </button>
              <button
                onClick={handleDeleteTask}
                className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <FaRegTrashAlt /> Delete Task
              </button>
            </div>
          </div>

          {/* Countdown Card */}
          <div className="md:col-span-1">
            <CountdownDisplay dueDate={task.dueDate} />
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-2xl backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-lime-200 mb-4 flex items-center gap-2">
            <span className="text-3xl">🌿</span> Subtasks
          </h3>
          {subtasks.length === 0 ? (
            <p className="text-green-400 text-base italic mb-6">No subtasks yet. Add one below!</p>
          ) : (
            <ul className="space-y-4 mb-6">
              {subtasks.map((sub) => (
                <li
                  key={sub._id}
                  className="bg-green-700/50 border border-green-600 p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md transition duration-300 hover:bg-green-700/70"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <Link href={`/tasks/${sub._id}`} className="block hover:underline text-lime-300 font-medium text-lg">
                      {sub.title}
                    </Link>
                    <span className="ml-0 sm:ml-2 text-green-300 text-sm">Status: <span className="capitalize">{sub.status}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:ml-4">
                    <button
                      onClick={() => toggleSubtaskStatus(sub)}
                      className={`flex-1 min-w-[80px] text-sm px-3 py-1 rounded-md font-semibold text-black transition duration-300 transform hover:scale-105 shadow-sm
                        ${sub.status === "done" ? "bg-amber-400 hover:bg-amber-300" : "bg-lime-500 hover:bg-lime-400"}`}
                    >
                      {sub.status === "done" ? "Reopen" : "Mark Done"}
                    </button>
                    <button
                      onClick={() => handleDeleteSubtask(sub)}
                      className="flex-1 min-w-[80px] bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md font-semibold transition duration-300 transform hover:scale-105 shadow-sm flex items-center justify-center gap-1"
                    >
                      <FaRegTrashAlt className="text-xs" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Add Subtask */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              placeholder="New subtask"
              className="flex-1 px-4 py-2 rounded-lg bg-green-800/70 border border-green-600 placeholder-green-400 text-green-100 focus:outline-none focus:ring-2 focus:ring-lime-500 transition duration-200"
            />
            <button
              onClick={addSubtask}
              className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-5 py-2 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Subtask
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          message={modalAction === 'deleteTask' ? "Are you sure you want to delete this task and its subtasks?" : "Are you sure you want to delete this subtask?"}
          onConfirm={modalAction === 'deleteTask' ? confirmDeleteTask : confirmDeleteSubtask}
          onCancel={handleCancelModal}
        />
      )}
    </main>
  );
}
