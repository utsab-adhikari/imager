'use client';

import React from 'react';
import { FaProjectDiagram, FaUsers, FaFileAlt, FaTags } from 'react-icons/fa';
import { MdOutlinePublish } from 'react-icons/md';

const features = [
  {
    icon: <FaProjectDiagram size={32} className="text-lime-400" />,
    title: 'Create Projects',
    description:
      'Start new projects with ease. Define goals, timelines, and manage progress all in one place.',
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
    <section className="py-16 px-4 bg-green-600/10 text-white">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-lime-300 mb-4">
          Empower Your Workflow
        </h2>
        <p className="text-green-200 max-w-2xl mx-auto">
          Discover the powerful tools that help you build, manage, and deliver your projects more efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-green-900/60 border border-green-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300"
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
