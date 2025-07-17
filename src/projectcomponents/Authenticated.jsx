"use client";

import React from "react";
import {
  FaPlusCircle,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";
import Link from "next/link";
import TaskList from "@/components/TaskList";

const DashboardLanding = () => {
  const baseCard =
    "p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 flex flex-col items-start gap-4";

  return (
    <main className="min-h-screen bg-green-600/10 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-300 mb-4">
            Welcome to Project Manager
          </h1>
          <p className="text-green-200 max-w-xl mx-auto">
            Manage all your projects, tasks, and teams in one place.
            Collaborate, track, and publish your work with ease.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/projects/create"
            className={`${baseCard} bg-green-800/60 border border-green-700 hover:bg-green-700/60`}
          >
            <FaPlusCircle size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">
              Create New Project
            </h2>
            <p className="text-green-300 text-sm">
              Start a new project by defining goals, setting up tasks, and
              assigning collaborators.
            </p>
          </Link>

          <Link
            href="/tasks"
            className={`${baseCard} bg-blue-800/60 border border-blue-700 hover:bg-blue-700/60`}
          >
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-xl font-semibold text-cyan-200">
              Task Management
            </h2>
            <p className="text-blue-200 text-sm">
              Track tasks, subtasks, deadlines, and organize your workflow
              efficiently.
            </p>
          </Link>

          <Link
            href="/progress"
            className={`${baseCard} bg-purple-800/60 border border-purple-700 hover:bg-purple-700/60`}
          >
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
            <h2 className="text-xl font-semibold text-violet-200">
              Daily Progress
            </h2>
            <p className="text-purple-200 text-sm">
              Log daily achievements, track updates, and maintain momentum on
              your project.
            </p>
          </Link>

          <Link
            href="/projects"
            className={`${baseCard} bg-green-800/60 border border-green-700 hover:bg-green-700/60`}
          >
            <FaClipboardList size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">My Projects</h2>
            <p className="text-green-300 text-sm">
              View and manage all your ongoing and completed projects with
              detailed breakdowns.
            </p>
          </Link>

          <Link
            href="/collaborators"
            className={`${baseCard} bg-green-800/60 border border-green-700 hover:bg-green-700/60`}
          >
            <FaUsers size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">
              Team Collaboration
            </h2>
            <p className="text-green-300 text-sm">
              Invite teammates, assign roles, and collaborate on project
              features and updates in real time.
            </p>
          </Link>

          <Link
            href="/documentation"
            className={`${baseCard} bg-green-800/60 border border-green-700 hover:bg-green-700/60`}
          >
            <FaFileAlt size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">
              Publish Documentation
            </h2>
            <p className="text-green-300 text-sm">
              Generate and export project documentation, PDF summaries, and
              developer READMEs.
            </p>
          </Link>
        </section>
        <TaskList />
      </div>
    </main>
  );
};

export default DashboardLanding;
