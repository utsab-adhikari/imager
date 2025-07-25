"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlbumImageUploader from "./AlbumImageUploader";
import axios from "axios";

export default function CreateAlbum() {
  const [albumName, setAlbumName] = useState("");
  const [albumImg, setAlbumImg] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess("");

    try {
      const res = await axios.post("/api/album", {
        albumName,
        albumImg,
        description,
      }, {withCredentials: true});

      if (!res.ok || !res.data.success) {
        setError(res.data.message || "Something went wrong");
        return;
      }

      setSuccess(res.data.message);
      setAlbumName("");
      setAlbumImg("");
      setDescription("");

      // Optional: redirect to album list or detail
      // router.push("/albums");
    } catch (err) {
      console.error(err);
      setError("Error submitting the form.");
    }
  };


  const handleImageUpload = (url) => {
    setAlbumImg(url);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white mb-4">Create Album</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-white block text-sm font-medium">
            Album Name
          </label>
          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-white"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-2 font-medium text-gray-300">
            Featured Image
          </label>
          <AlbumImageUploader onUpload={handleImageUpload} />
          {albumImg && (
            <img
              src={albumImg}
              alt="Uploaded"
              className="mt-3 max-h-40 object-cover rounded-lg border border-gray-600"
            />
          )}
        </div>

        <div>
          <label className="text-white block text-sm font-medium">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Create Album
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}
      {success && <p className="text-green-500 mt-3">{success}</p>}
    </div>
  );
}
