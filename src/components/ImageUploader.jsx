"use client";

import { useState } from "react";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

export default function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    setUploading(true);
    setError(null);
    const uploaded = [];

    for (const file of files) {
      // Validate file
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, or WEBP files are allowed.");
        continue;
      }
      if (file.size > maxSize) {
        setError("One or more files are too large. Max 10MB allowed.");
        continue;
      }

      try {
        // Get signature from API
        const sigRes = await fetch("/api/sign-upload");
        const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await cloudRes.json();
        if (data.secure_url) {
          uploaded.push(data.secure_url);
        } else {
          setError("Upload failed for one or more files.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong during upload.");
      }
    }

    setUploadedUrls((prev) => [...prev, ...uploaded]);
    setUploading(false);

    if (uploaded.length > 0) {
      onUpload(uploaded); // send all new URLs to parent
    }
  };

  return (
    <div className="space-y-3">
      {uploading ? (
        <div className="flex items-center gap-2 text-indigo-400 text-sm animate-pulse">
          <AiOutlineLoading3Quarters className="animate-spin text-xl" />
          Uploading images...
        </div>
      ) : (
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md cursor-pointer transition">
          <AiOutlineCloudUpload className="text-lg" />
          Upload Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
    </div>
  );
}
