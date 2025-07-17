"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchTaskData();
  }, [id]);

  async function fetchTaskData() {
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
  }

  async function toggleStatus() {
    const nextStatus = task.status === "done" ? "todo" : "done";
    const res = await fetch(`/api/v1/tasks?id=${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const updated = await res.json();
    setTask(updated);
  }

  async function deleteTask() {
    const confirmDelete = window.confirm("Delete this task and its subtasks?");
    if (!confirmDelete) return;

    await fetch(`/api/v1/tasks?id=${task._id}`, { method: "DELETE" });
    router.push("/tasks");
  }

  async function addSubtask() {
    if (!newSubtask.trim()) return;

    await fetch("/api/v1/tasks", {
      method: "POST",
      body: JSON.stringify({ title: newSubtask, parent: id }),
      headers: { "Content-Type": "application/json" },
    });

    setNewSubtask("");
    fetchTaskData();
  }

  async function toggleSubtaskStatus(sub) {
    const next = sub.status === "done" ? "todo" : "done";
    const res = await fetch(`/api/v1/tasks?id=${sub._id}`, {
      method: "PUT",
      body: JSON.stringify({ status: next }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await fetch(`/api/v1/tasks?parent=${task._id}`).then((r) =>
      r.json()
    );
    setSubtasks(updated);
  }

  async function deleteSubtask(sub) {
    await fetch(`/api/v1/tasks?id=${sub._id}`, {
      method: "DELETE",
    });
    const updated = await fetch(`/api/v1/tasks?parent=${task._id}`).then((r) =>
      r.json()
    );
    setSubtasks(updated);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-900/10 text-green-200 flex items-center justify-center">
        <p className="text-lg">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-green-900/10 text-red-300 flex items-center justify-center">
        <p className="text-lg">Task not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-green-900/10 text-green-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/tasks"
          className="text-lime-400 underline text-sm mb-4 block"
        >
          ← Back to Task List
        </Link>

        {/* Main Task */}
        <div className="bg-green-800/50 border border-green-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-lime-300 mb-2">
            🧩 {task.title}
          </h2>
          <p className="text-sm text-green-300 mb-1 flex gap-3 items-center">
            Status: {task.status}
            {task.status === "done" && (
              <IoCheckmarkDoneCircleSharp className="text-blue-500" />
            )}
          </p>
          <p className="text-green-400 text-sm mb-4">Task ID: {task._id}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={toggleStatus}
              className="bg-lime-500 hover:bg-lime-400 text-black px-4 py-2 rounded transition"
            >
              {task.status === "done" ? "Reopen Task" : "Mark Done"}
            </button>
            <button
              onClick={deleteTask}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
            >
              Delete Task
            </button>
          </div>
        </div>

        {/* Subtasks Section */}
        <div>
          <h3 className="text-xl font-semibold text-lime-200 mb-3">Subtasks</h3>

          {subtasks.length === 0 ? (
            <p className="text-green-400 text-sm mb-4">No subtasks yet.</p>
          ) : (
            <ul className="space-y-3 mb-6">
              {subtasks.map((sub) => (
                <li
                  key={sub._id}
                  className="bg-green-800/60 border border-green-700 p-4 rounded-md flex justify-between items-center"
                >
                  <div className="flex-1">
                    <Link
                      href={`/tasks/${sub._id}`}
                      className="hover:underline"
                    >
                      <span className="text-lime-300 font-medium">
                        {sub.title}
                      </span>
                      <span className="ml-2 text-green-300 text-sm">
                        ({sub.status})
                      </span>
                    </Link>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleSubtaskStatus(sub)}
                      className="bg-lime-500/80 hover:bg-lime-400 text-black text-sm px-3 py-1 rounded transition"
                    >
                      {sub.status === "done" ? "Reopen" : "Mark Done"}
                    </button>

                    <button
                      onClick={() => deleteSubtask(sub)}
                      className="bg-red-500/80 hover:bg-red-400 text-black text-sm px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Add Subtask */}
          <div className="flex items-center gap-3">
            <input
              placeholder="Add new subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="flex-1 px-4 py-2 rounded bg-green-800/60 border border-green-700 placeholder-green-400 text-green-100 focus:outline-none"
            />
            <button
              onClick={addSubtask}
              className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-4 py-2 rounded transition"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
