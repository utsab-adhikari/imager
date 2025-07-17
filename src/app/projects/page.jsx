'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/projects');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to load projects');
        }
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/project/delete/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-green-600/10 to-green-950 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-lime-300">📂 Your Projects</h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 px-4 py-2 mb-4 rounded border border-red-500">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <p className="text-green-300">You haven’t created any projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-green-100/20 border border-green-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <h2 className="text-xl font-semibold text-lime-300 mb-2">{project.name}</h2>
                <p className="text-green-200 text-sm mb-4">{project.description || 'No description'}</p>

                <div className="flex flex-wrap gap-2 text-sm text-lime-400">
                  {project.links?.website && (
                    <a href={project.links.website} target="_blank" rel="noopener noreferrer" className="hover:underline">🌐 Website</a>
                  )}
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="hover:underline">💻 GitHub</a>
                  )}
                  {project.links?.discord && (
                    <a href={project.links.discord} target="_blank" rel="noopener noreferrer" className="hover:underline">💬 Discord</a>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() => router.push(`/projects/${project._id}`)}
                    className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded cursor-pointer"
                  >
                    View Details →
                  </button>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-sm bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
