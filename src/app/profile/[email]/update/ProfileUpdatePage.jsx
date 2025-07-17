"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSpinner, FaSave } from "react-icons/fa";
import ImageUploader from "@/components/ImageUploader";

export default function ProfileUpdatePage() {
  const { email } = useParams();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");
  const [updating, setUpdating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;

      setLoading(true);
      try {
        const res = await axios.get(`/api/profile/${email}`, {
          withCredentials: true,
        });

        if (!res?.data?.profile) {
          toast.error("Profile not found.");
        } else {
          setProfile(res.data.profile);
          setBio(res.data.profile.bio || "");
          setContact(res.data.profile.contact || "");
          setName(res.data.profile.name);
        }
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio && !contact) {
      toast.error("Please fill in at least one field.");
      return;
    }

    setUpdating(true);
    try {
      await axios.put(
        `/api/profile/${email}`,
        { bio, contact, image:imageUrl, name:name },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully.");
      router.push(`/profile/${email}`);
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-500">
        <FaSpinner className="animate-spin text-3xl mr-3" />
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500 py-20 font-semibold">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gray-900 text-white">
      <div className="bg-[#1e293b] border border-indigo-500/30 p-8 rounded-2xl w-full max-w-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center  justify-center sm:col-span-2 mx-auto">
            <label className="block mb-2 font-medium text-gray-300">
              Image
            </label>
            <ImageUploader onUpload={handleImageUpload} />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-indigo-500 mb-4"
              />
            )}
          </div>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. +9779867500000"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block mb-1 font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write something about yourself..."
            />
          </div>
          <div>
            <label htmlFor="contact" className="block mb-1 font-medium">
              Contact (Phone, WhatsApp, etc.)
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. +9779867500000"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className={`w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white font-medium transition ${
              updating ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {updating ? (
              <>
                <FaSpinner className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
