"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
    const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/user`, {
          withCredentials: true,
        });

        const fetchedUsers = res?.data?.users;

        if (!fetchedUsers || !Array.isArray(fetchedUsers)) {
          toast.error("Users not found.");
        } else {
          setUsers(fetchedUsers);
        }
      } catch (err) {
        toast.error("Failed to load users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleCardClick = async (email) => {
    
      await router.push(`/profile/${email}`);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/user/${id}`, {
        withCredentials: true,
      });
      toast.success("User deleted.");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error("Failed to delete user.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        👥 User Directory
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {users?.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleCardClick(user.email)}
                className="group bg-white/20 dark:bg-white/10 backdrop-blur-md shadow-md rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 border border-white/30"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.image || "/default-avatar.png"}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    <p className="text-sm text-gray-500 italic">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user._id);
                  }}
                  className="cursor-pointer mt-4 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
              No users found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
