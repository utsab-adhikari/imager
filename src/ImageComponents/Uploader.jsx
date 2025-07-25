"use client";

import ImageUploader from "@/components/ImageUploader";
import React, { useState } from "react";

const Uploader = () => {
  const [imageUrls, setImageUrls] = useState([]);

  const handleImageUpload = (urls) => {
    setImageUrls((prev) => [...prev, ...urls]);
  };
  const handleRemove = (indexToRemove) => {
      setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };
    
    console.log(imageUrls);
  return (
    <div className="p-4 space-y-6">
      <ImageUploader onUpload={handleImageUpload} />

      {imageUrls.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-600">
            Uploaded Images ({imageUrls.length})
          </h3>

          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
              maxHeight: "70vh",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "5px",
              borderRadius: "4px",
            }}
          >
            {imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative group hover:scale-105 transition-transform"
              >
                {/* Preview image */}
                <img
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
                  className="w-full h-[60px] object-cover rounded-sm"
                  loading="lazy"
                />

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-[2px] rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Uploader;
