"use client";

import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSpinner, FaBookOpen } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    if (!email) return;

    const getProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/profile/${email}`, {
          withCredentials: true,
        });
        if (!res?.data?.profile) {
          toast.error("Profile not found.");
        } else {
          setProfile(res.data.profile);
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [email]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center text-indigo-500">
        Loading session...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-400">
        <FaSpinner className="animate-spin text-3xl" />
        <span className="ml-3">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-red-400 font-semibold">
        Profile not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10 text-white">
    <div className="bg-[#1e293b] border border-indigo-500/20 rounded-2xl p-6 sm:p-10 shadow-lg w-full max-w-xl text-center mx-auto">
  <img
    src={profile.image}
    alt="Profile"
    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-indigo-500 mb-4"
  />

  <h2 className="text-2xl sm:text-3xl font-bold mb-1">{profile.name}</h2>
  <p className="text-sm text-gray-300">{profile.email}</p>
  <p className="text-xs text-gray-500 mb-4">
    Joined on {dayjs(profile.createdAt).format("MMMM D, YYYY")}
  </p>

  {profile.bio && (
    <p className="text-base text-slate-300 mb-6 italic">“{profile.bio}”</p>
  )}

  <div className="flex flex-wrap justify-center gap-4 mt-4">
    {/* WhatsApp */}
    {profile.contact && (
      <a
        href={`https://wa.me/${profile.contact}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white flex items-center gap-2 transition"
      >
        <IoLogoWhatsapp />
        {profile.contact}
      </a>
    )}

    {/* Email */}
    <a
      href={`mailto:${profile.email}`}
      className="px-4 py-2 border border-gray-500 rounded-full text-gray-300 hover:text-white hover:border-white transition"
    >
      Email Me
    </a>

    {/* Update button - only if owner */}
    {session && profile._id === session.user.id && (
      <Link
        href={`/profile/${profile.email}/update`}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white flex items-center gap-2 transition"
      >
        <FaRegEdit />
        Update
      </Link>
    )}
  </div>
</div>

      <div className="w-full bg-[#1e1f21] text-white p-6 rounded-lg shadow-lg mt-12 border border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-300 mb-6 border-b-2 border-indigo-500 pb-2">
          From {profile.name}
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-indigo-500 text-3xl mr-3" />
            <p className="text-gray-300 text-lg">Loading blogs...</p>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            <p>No blogs found.</p>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-700 hover:border-indigo-500"
              >
                {/* Blog Image */}
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x300/333333/FFFFFF?text=Image+Unavailable";
                    }}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                    No Image Available
                  </div>
                )}

                {/* Blog Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-indigo-400 mb-2 hover:underline">
                    <FaBookOpen className="inline-block mr-2 text-indigo-300" />
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Category:{" "}
                    <span className="font-medium text-indigo-300">
                      {blog.category}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Published: {dayjs(blog.createdAt).format("MMMM D, YYYY")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
