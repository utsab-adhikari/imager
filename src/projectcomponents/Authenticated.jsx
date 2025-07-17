'use client';

import React from 'react';
import { FaPlusCircle, FaClipboardList, FaUsers, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';
import TaskList from '@/components/TaskList';

const DashboardLanding = () => {
  return (
    <main className="min-h-screen bg-green-600/10 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-300 mb-4">
            Welcome to Project Manager
          </h1>
          <p className="text-green-200 max-w-xl mx-auto">
            Manage all your projects, tasks, and teams in one place. Collaborate, track, and publish your work with ease.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/projects/create"
            className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 flex flex-col items-start gap-4 hover:bg-green-700/60"
          >
            <FaPlusCircle size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">Create New Project</h2>
            <p className="text-green-300 text-sm">
              Start a new project by defining goals, setting up tasks, and assigning collaborators.
            </p>
          </Link>
          <Link
            href="/tasks"
            className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 flex flex-col items-start gap-4 hover:bg-green-700/60"
          >
            <FaPlusCircle size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">Create / View Tasks</h2>
            <p className="text-green-300 text-sm">
              Create a new task, setting up subtasks, and tracking your daily tasks.
            </p>
          </Link>

          <Link
            href="/projects"
            className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 flex flex-col items-start gap-4 hover:bg-green-700/60"
          >
            <FaClipboardList size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">My Projects</h2>
            <p className="text-green-300 text-sm">
              View and manage all your ongoing and completed projects with detailed breakdowns.
            </p>
          </Link>

          <Link
            href="/collaborators"
            className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 flex flex-col items-start gap-4 hover:bg-green-700/60"
          >
            <FaUsers size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">Team Collaboration</h2>
            <p className="text-green-300 text-sm">
              Invite teammates, assign roles, and collaborate on project features and updates in real time.
            </p>
          </Link>

          <Link
            href="/documentation"
            className="bg-green-800/60 border border-green-700 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 flex flex-col items-start gap-4 hover:bg-green-700/60"
          >
            <FaFileAlt size={28} className="text-lime-400" />
            <h2 className="text-xl font-semibold text-lime-200">Publish Documentation</h2>
            <p className="text-green-300 text-sm">
              Generate and export project documentation, PDF summaries, and developer READMEs.
            </p>
          </Link>
        </section>
            <TaskList />
      </div>
    </main>
  );
};

export default DashboardLanding;
