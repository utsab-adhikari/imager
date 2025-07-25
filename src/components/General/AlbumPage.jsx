"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function AlbumPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // index of open menu

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get("/api/album", { withCredentials: true });

        if (!res.data.success) {
          setError(res.data.message || "Failed to load albums.");
        } else {
          setAlbums(res.data.albums);
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const handleDelete = async (albumId) => {
    try {
      await axios.delete(`/api/album/${albumId}`, { withCredentials: true });
      setAlbums((prev) => prev.filter((a) => a._id !== albumId));
    } catch (err) {
      alert("Failed to delete album.");
    }
  };

  if (loading) {
    return <p className="text-white p-6">Loading albums...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">Your Albums</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3  gap-4">
        {albums.map((album, index) => (
          <Link href={`/${album.albumName}`}
            key={album._id}
            className="bg-gray-800 relative rounded-md overflow-hidden shadow hover:scale-[1.02] transition"
          >
            <img
              src={album.albumImg}
              alt={album.albumName}
              className="w-full h-32 sm:h-36 md:h-40 object-cover"
            />

            <div className="p-2 text-xs text-white">
              <p className="font-semibold truncate">{album.albumName}</p>
              <p className="text-gray-400 text-[11px]">
                {new Date(album.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Three Dots Menu */}
            <div className="absolute bottom-2 right-2 text-white z-10">
              <button
                onClick={() => setOpenMenu(openMenu === index ? null : index)}
                className="hover:text-gray-300"
              >
                <BsThreeDotsVertical />
              </button>

              {openMenu === index && (
                <div className="absolute right-0 bottom-6 bg-white rounded shadow text-black text-xs w-28">
                  <button
                    onClick={() => alert(`Details: ${album.description}`)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(album._id)}
                    className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
