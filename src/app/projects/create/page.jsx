'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateProject() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    github: '',
    discord: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      setError('Project name is required');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/v1/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          links: {
            website: form.website,
            github: form.github,
            discord: form.discord
          }
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }

      await res.json();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      router.push("/projects");
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <span className="animate-spin h-8 w-8 border-4 border-teal-400 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1117] via-[#131a23] to-[#0f1117] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto bg-[#1e293b] border border-slate-700 rounded-xl p-8 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 border-b border-slate-600 pb-2 text-teal-300">
          🚀 Create a New Project
        </h1>

        {error && (
          <div className="bg-red-500/10 text-red-400 px-4 py-2 mb-4 rounded border border-red-500/40">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-[#24303f] text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-[#24303f] text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
              placeholder="Brief project summary..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full bg-[#24303f] text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
                placeholder="https://projectsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                GitHub
              </label>
              <input
                type="url"
                name="github"
                value={form.github}
                onChange={handleChange}
                className="w-full bg-[#24303f] text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
                placeholder="https://github.com/your-repo"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Discord
              </label>
              <input
                type="url"
                name="discord"
                value={form.discord}
                onChange={handleChange}
                className="w-full bg-[#24303f] text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-400"
                placeholder="https://discord.gg/example"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
