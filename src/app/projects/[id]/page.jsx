"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/projects/${id}`)
      .then((res) => res.json())
      .then(setProject);
  }, [id]);

  const addTopic = async () => {
    if (!newTopic.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/v1/projects/${id}/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTopic }),
    });
    const updated = await res.json();
    setProject(updated);
    setNewTopic("");
    setLoading(false);
  };

  const updateTopicContent = async (index, content) => {
    const topicId = project.topics[index]._id;
    await fetch(`/api/v1/projects/${id}/topics/${topicId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  };

  const deleteTopic = async (topicId) => {
    const res = await fetch(`/api/v1/projects/${id}/topics/${topicId}`, {
      method: "DELETE",
    });
    const updated = await res.json();
    setProject(updated);
  };

  if (!project)
    return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-teal-300">{project.name}</h1>
      <p className="text-slate-300 mb-4">{project.description}</p>

      <div className="flex gap-4 mb-6">
        {project.links?.website && (
          <a
            href={project.links.website}
            className="text-teal-400 underline"
            target="_blank"
          >
            🌐 Website
          </a>
        )}
        {project.links?.github && (
          <a
            href={project.links.github}
            className="text-teal-400 underline"
            target="_blank"
          >
            💻 GitHub
          </a>
        )}
        {project.links?.discord && (
          <a
            href={project.links.discord}
            className="text-teal-400 underline"
            target="_blank"
          >
            💬 Discord
          </a>
        )}
      </div>

      <hr className="border-slate-700 mb-6" />

      <div className="mb-4">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="New topic title..."
          className="bg-[#1e293b] border border-slate-600 px-4 py-2 rounded w-full mb-2"
        />
        <button
          onClick={addTopic}
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-400 text-black px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Topic"}
        </button>
      </div>

      {project.topics.length === 0 ? (
        <p className="text-slate-400 italic">No topics yet.</p>
      ) : (
        <div className="space-y-6">
          {project.topics.map((topic, index) => (
            <div
              key={topic._id}
              className="bg-[#24303f] p-4 rounded border border-slate-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-teal-300">
                  {topic.title}
                </h2>
                <button
                  onClick={() => deleteTopic(topic._id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✖ Delete
                </button>
              </div>
              <textarea
                defaultValue={topic.content}
                onBlur={(e) => updateTopicContent(index, e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded resize-y border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="5"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
