"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

export default function TaskList({ parentId = null }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [parentId]);

  const fetchTasks = async () => {
    const url = `/api/v1/tasks${parentId ? `?parent=${parentId}` : ""}`;
    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  const toggleDone = async (id, status) => {
    const nextStatus = status === "done" ? "todo" : "done";
    await fetch(`/api/v1/tasks?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: nextStatus }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
  };

  const remove = async (id) => {
    await fetch(`/api/v1/tasks?id=${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-lime-300 mb-6">
        {parentId ? "Subtasks" : "Tasks"}
      </h2>

      <div className="space-y-4">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-green-100 shadow-sm"
          >
            <div className="flex justify-between items-center">
              {/* Title & Link */}
              <div>
                <Link href={`/tasks/${t._id}`}>
                  <h3 className="text-lg font-semibold text-lime-200 hover:underline">
                    {t.title}
                  </h3>
                </Link>
                <p className="text-sm text-green-300 flex flex-nowrap gap-3 items-center">Status: {t.status}
                    {t.status === "done" && (
                  <IoCheckmarkDoneCircleSharp className="text-blue-500" size={24} />
                )}
                </p>
                
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDone(t._id, t.status)}
                  className="bg-lime-500/80 hover:bg-lime-400 text-black text-sm px-3 py-1 rounded transition"
                >
                  {t.status === "done" ? "Reopen" : "Mark Done"}
                </button>
                <button
                  onClick={() => remove(t._id)}
                  className="bg-red-500/80 hover:bg-red-400 text-black text-sm px-3 py-1 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
