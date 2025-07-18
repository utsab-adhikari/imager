'use client';

import React from 'react';
import {
  FaProjectDiagram,
  FaUsers,
  FaFileAlt,
  FaTags,
  FaTasks,
} from 'react-icons/fa';
import { MdOutlinePublish, MdOutlineTrackChanges } from 'react-icons/md';

const features = [
  {
    icon: <FaProjectDiagram size={32} className="text-lime-400" />,
    title: 'Create Projects',
    description:
      'Start new projects with ease. Define goals, timelines, and manage progress all in one place.',
  },
  {
    icon: <FaTasks size={32} className="text-lime-400" />,
    title: 'Manage Tasks',
    description:
      'Assign tasks, set deadlines, and track task status efficiently within each project.',
  },
  {
    icon: <MdOutlineTrackChanges size={32} className="text-lime-400" />,
    title: 'Daily Progress Tracker',
    description:
      'Log daily accomplishments, blockers, and maintain consistent momentum in your work.',
  },
  {
    icon: <FaTags size={32} className="text-lime-400" />,
    title: 'Topics & Features',
    description:
      'Organize your projects using custom topics and features to structure development logically.',
  },
  {
    icon: <FaUsers size={32} className="text-lime-400" />,
    title: 'Add Collaborators',
    description:
      'Invite team members, assign roles, and collaborate in real-time to boost productivity.',
  },
  {
    icon: <MdOutlinePublish size={32} className="text-lime-400" />,
    title: 'Publish Project Output',
    description:
      'Generate and publish your completed project as a polished PDF, README, or documentation.',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-green-950 via-green-900 to-green-950 text-white">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold text-lime-300 mb-4">
          Empower Your Workflow
        </h2>
        <p className="text-green-300 max-w-2xl mx-auto text-base">
          Discover the powerful tools that help you build, manage, and deliver
          your projects more efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-green-800/60 border border-green-700 hover:border-lime-500 transition duration-300 rounded-2xl p-6 shadow-md hover:shadow-xl backdrop-blur-md"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-lime-200 mb-2">
              {feature.title}
            </h3>
            <p className="text-green-300 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
