"use client";

import {
  FaPlusCircle,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";
import Link from "next/link";
import TaskList from "@/components/TaskList";

const DashboardLanding = () => {
  const cardBase =
    "p-6 rounded-xl shadow hover:shadow-xl transition-all duration-200 bg-[#1c1e26] border border-gray-700 hover:border-lime-500";

  return (
    <main className="min-h-screen bg-[#0f1117] text-white px-6 py-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-400 mb-3">
            Welcome to Project Manager
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Manage all your projects, tasks, and teams in one place. Collaborate, track, and publish your work with clarity and control.
          </p>
        </header>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/projects/create" className={cardBase}>
            <FaPlusCircle size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-300">
              Create New Project
            </h2>
            <p className="text-gray-400 text-sm">
              Define goals, set tasks, and invite collaborators to kick off your next big idea.
            </p>
          </Link>

          <Link href="/tasks" className={cardBase}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-cyan-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width={28}
              height={28}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-xl font-semibold text-cyan-300">
              Task Management
            </h2>
            <p className="text-gray-400 text-sm">
              Track tasks, deadlines, and streamline your team's workflow.
            </p>
          </Link>

          <Link href="/progress" className={cardBase}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-violet-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width={28}
              height={28}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h11M9 21V3m12 13h-6m6 0l-2-2m2 2l-2 2"
              />
            </svg>
            <h2 className="text-xl font-semibold text-violet-300">
              Daily Progress
            </h2>
            <p className="text-gray-400 text-sm">
              Log daily updates, boost accountability, and visualize project momentum.
            </p>
          </Link>

          <Link href="/projects" className={cardBase}>
            <FaClipboardList size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-300">
              My Projects
            </h2>
            <p className="text-gray-400 text-sm">
              View your active and archived projects with full breakdowns and metadata.
            </p>
          </Link>

          <Link href="/collaborators" className={cardBase}>
            <FaUsers size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-300">
              Team Collaboration
            </h2>
            <p className="text-gray-400 text-sm">
              Invite members, assign roles, and collaborate on project modules in real time.
            </p>
          </Link>

          <Link href="/documentation" className={cardBase}>
            <FaFileAlt size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-300">
              Publish Documentation
            </h2>
            <p className="text-gray-400 text-sm">
              Generate PDFs, READMEs, or release notes with a single click.
            </p>
          </Link>
        </section>

        {/* Task List Component */}
        <div className="mt-16">
          <TaskList />
        </div>
      </div>
    </main>
  );
};

export default DashboardLanding;
