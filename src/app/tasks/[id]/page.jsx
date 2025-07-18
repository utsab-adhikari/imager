"use client"
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation"; // Assuming Next.js environment
import Link from "next/link";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { FaRegTrashAlt, FaPlus, FaCheckCircle, FaUndo } from "react-icons/fa"; // Added FaUndo and FaCheckCircle
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
  const [error, setError] = useState(""); // State for displaying errors
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'deleteTask' or 'deleteSubtask'
  const [subtaskToDelete, setSubtaskToDelete] = useState(null); // Stores subtask object for deletion

  const fetchTaskData = useCallback(async () => {
    setLoading(true);
    setError(""); // Clear previous errors on new fetch
    try {
      const [taskRes, subtaskRes] = await Promise.all([
        fetch(`/api/v1/tasks?id=${id}`),
        fetch(`/api/v1/tasks?parent=${id}`),
      ]);

      if (!taskRes.ok) throw new Error("Failed to fetch main task.");
      if (!subtaskRes.ok) throw new Error("Failed to fetch subtasks.");

      const taskData = await taskRes.json();
      const subtaskData = await subtaskRes.json();

      setTask(taskData);
      setSubtasks(subtaskData);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError("Could not load task details. Please try again.");
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
    const originalTask = task; // Save original for rollback
    // Optimistic update for main task
    setTask(prevTask => ({ ...prevTask, status: nextStatus }));

    try {
      const res = await fetch(`/api/v1/tasks?id=${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update task status.");
      const updated = await res.json();
      setTask(updated); // Update with actual response to ensure consistency
    } catch (error) {
      console.error("Error toggling task status:", error);
      setError("Could not update task status.");
      setTask(originalTask); // Rollback on error
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
      const res = await fetch(`/api/v1/tasks?id=${task._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task.");
      router.push("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Could not delete task.");
    }
  };

  const addSubtask = async () => {
    if (!newSubtask.trim()) {
      setError("Subtask title cannot be empty.");
      return;
    }
    setError(""); // Clear previous errors
    const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update
    const optimisticSubtask = { _id: tempId, title: newSubtask, status: "todo", parent: id, description: "" }; // Include description for consistency if needed

    setSubtasks(prev => [...prev, optimisticSubtask]); // Optimistic add
    setNewSubtask(""); // Clear input immediately

    try {
      const res = await fetch("/api/v1/tasks", {
        method: "POST",
        body: JSON.stringify({ title: optimisticSubtask.title, parent: id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to add subtask.");
      const addedSubtask = await res.json();
      // Replace optimistic entry with real one from API response
      setSubtasks(prev => prev.map(s => s._id === tempId ? addedSubtask : s));
    } catch (error) {
      console.error("Error adding subtask:", error);
      setError("Could not add subtask.");
      setSubtasks(prev => prev.filter(s => s._id !== tempId)); // Rollback on error
    }
  };

  const toggleSubtaskStatus = async (sub) => {
    const nextStatus = sub.status === "done" ? "todo" : "done";
    const originalSubtasks = subtasks; // Save original for rollback

    // Optimistic update
    setSubtasks(prevSubtasks =>
      prevSubtasks.map(s =>
        s._id === sub._id ? { ...s, status: nextStatus } : s
      )
    );

    try {
      const res = await fetch(`/api/v1/tasks?id=${sub._id}`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to update subtask status.");
      // If API returns updated subtask, could use that:
      // const updatedSub = await res.json();
      // setSubtasks(prevSubtasks => prevSubtasks.map(s => s._id === updatedSub._id ? updatedSub : s));
    } catch (error) {
      console.error("Error toggling subtask status:", error);
      setError("Could not update subtask status.");
      setSubtasks(originalSubtasks); // Rollback on error
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
    const originalSubtasks = subtasks; // Save for rollback
    const deletedId = subtaskToDelete._id;

    setSubtasks(prev => prev.filter(s => s._id !== deletedId)); // Optimistic delete
    setSubtaskToDelete(null); // Clear reference

    try {
      const res = await fetch(`/api/v1/tasks?id=${deletedId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subtask.");
    } catch (error) {
      console.error("Error deleting subtask:", error);
      setError("Could not delete subtask.");
      setSubtasks(originalSubtasks); // Rollback on error
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setModalAction(null);
    setSubtaskToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen to-green-950 text-green-200 flex items-center justify-center font-inter">
        <p className="text-xl animate-pulse">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen to-green-950 text-red-400 flex items-center justify-center font-inter">
        <p className="text-xl">Task not found 😔</p>
      </div>
    );
  }

  return (
<main className="min-h-screen bg-[#0f1117] text-white px-4 py-8 sm:px-6 md:py-12 font-inter">
  <div className="max-w-4xl mx-auto space-y-8">

    {/* Error */}
    {error && (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md shadow-sm text-center">
        {error}
      </div>
    )}

    {/* Task Header + Countdown */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-[#1e293b] border border-slate-700 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-3xl font-bold text-teal-300">{task.title}</h2>
        {task.description && <p className="text-slate-300">{task.description}</p>}
        <p className="text-sm text-slate-400">ID: <span className="font-mono">{task._id}</span></p>
        <p className="flex items-center gap-2 text-slate-300">
          Status: <span className="capitalize">{task.status}</span>
          {task.status === "done" && <IoCheckmarkDoneCircleSharp className="text-teal-400 text-xl" />}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={toggleStatus}
            className={`px-5 py-2 rounded-lg font-semibold text-black transition transform hover:scale-105 shadow-md ${
              task.status === "done"
                ? "bg-slate-400 hover:bg-slate-300"
                : "bg-teal-500 hover:bg-teal-400"
            }`}
          >
            {task.status === "done" ? "Reopen Task" : "Mark Done"}
          </button>
          <button
            onClick={handleDeleteTask}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition transform hover:scale-105 shadow-md"
          >
            Delete Task
          </button>
        </div>
      </div>

      <CountdownDisplay dueDate={task.dueDate} />
    </div>

    {/* Subtasks */}
    <div className="bg-[#1e293b] border border-slate-700 p-6 rounded-xl shadow-md space-y-4">
      <h3 className="text-2xl font-semibold text-teal-300">Subtasks</h3>
      {subtasks.length > 0 ? (
        <ul className="space-y-3">
          {subtasks.map((sub) => (
            <li key={sub._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#24303f] border border-slate-600 p-4 rounded-md transition hover:bg-[#2c3a4e]">
              <div className="flex-1 space-y-1">
                <Link href={`/tasks/${sub._id}`} className="text-teal-300 font-medium hover:underline">{sub.title}</Link>
                <p className="text-slate-400 text-sm">Status: {sub.status}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleSubtaskStatus(sub)}
                  className={`px-3 py-1 rounded-md font-semibold text-black transition transform hover:scale-105 shadow-sm ${
                    sub.status === "done" ? "bg-slate-400 hover:bg-slate-300" : "bg-teal-500 hover:bg-teal-400"
                  }`}
                >
                  {sub.status === "done" ? "Reopen" : "Done"}
                </button>
                <button
                  onClick={() => handleDeleteSubtask(sub)}
                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition transform hover:scale-105 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 italic">No subtasks yet. Add one below.</p>
      )}

      {/* Add Subtask */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <input
          placeholder="New subtask..."
          value={newSubtask}
          onChange={e => setNewSubtask(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md bg-[#24303f] border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
        <button
          onClick={addSubtask}
          className="px-5 py-2 flex flex-nowrap gap-3 items-center bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-md transition transform hover:scale-105 shadow-md"
        >
          <FaPlus /> Add Subtask
        </button>
      </div>
    </div>

    {/* Confirmation Modal */}
    {showConfirmModal && (
      <ConfirmModal
        message={modalAction === 'deleteTask'
          ? "Confirm delete this task and its subtasks?"
          : "Confirm delete this subtask?"}
        onConfirm={modalAction === 'deleteTask' ? confirmDeleteTask : confirmDeleteSubtask}
        onCancel={handleCancelModal}
      />
    )}
  </div>
</main>

  );
}
