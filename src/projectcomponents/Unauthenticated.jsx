'use client';

import React from 'react';
import GoogleLoginPage from '@/app/auth/login/page';
import { motion } from 'framer-motion';
import FeatureSection from './Features';

const Unauthenticated = () => {
  return (
    <>
    <main className="min-h-screen flex items-center justify-center px-4 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 bg-green-500/5 backdrop-blur-lg max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 md:gap-16 border border-green-700 p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-lime-300 drop-shadow-lg">
            Welcome to <span className="text-lime-400">Project Manager</span>
          </h1>
          <p className="text-lg text-green-200">
            Seamlessly manage your projects, collaborate in real-time, track features, assign tasks, and organize everything by project topics.
          </p>
          <ul className="text-sm text-green-300 list-disc list-inside">
            <li>Create and manage multiple projects</li>
            <li>Organize with topics and feature-based discussions</li>
            <li>Real-time collaboration and task tracking</li>
          </ul>
        </div>

        {/* Right Section - Login */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg  border border-indigo-600 p-6 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center text-lime-200">Please login to continue</h2>
          <GoogleLoginPage />
        </div>
      </motion.div>
    </main>
      <FeatureSection/>
    </>
  );
};

export default Unauthenticated;
