import React from "react";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left Side */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} | Design & Developed by{' '}
            <span className="text-lime-400 hover:underline cursor-pointer">
              Utsab Adhikari
            </span>
          </p>
        </div>

        {/* Right Side - Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-lime-400 transition"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-lime-400 transition"
          >
            <FaLinkedinIn size={18} />
          </a>
          <a
            href="https://github.com/utsab-ad"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-lime-400 transition"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="mailto:utsabadhikari075@gmail.com"
            className="hover:text-lime-400 transition"
          >
            <FaEnvelope size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;