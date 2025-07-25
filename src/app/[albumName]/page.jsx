"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader"; // Assuming this component exists

export default function AlbumDetailsPage() {
  const { albumName } = useParams();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  const [imageUrls, setImageUrls] = useState([]); // State for images being uploaded
  const [openMenuId, setOpenMenuId] = useState(null); // State to track which image's menu is open
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State for details modal visibility
  const [selectedImageDetails, setSelectedImageDetails] = useState(null); // State for details of the selected image

  const menuRef = useRef(null); // Ref for clicking outside the menu

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch images on load
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`/api/album/${albumName}`);
        if (res.data.success) {
          setImages(res.data.images);
        } else {
          setError(res.data.message || "Failed to load images");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [albumName]);

  // Handler for ImageUploader to get uploaded URLs
  const handleImageUpload = (urls) => {
    setImageUrls((prev) => [...prev, ...urls]);
  };

  // Handler to remove a selected image from the upload list
  const handleRemove = (indexToRemove) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handler for submitting new images to the album
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setError(null);
    setSuccess("");
    setUploading(true); // Set uploading state

    try {
      const res = await axios.post(
        `/api/images`,
        {
          albumName,
          imageUrls,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSuccess(res.data.message);
        setImageUrls([]); // Clear uploaded images after successful submission
        // Re-fetch images to show the newly added ones
        const updatedRes = await axios.get(`/api/album/${albumName}`);
        if (updatedRes.data.success) {
          setImages(updatedRes.data.images);
        }
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error submitting the form.");
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  // Function to group images by date
  const groupImagesByDate = (imagesArray) => {
    const grouped = {};
    imagesArray.forEach((imageDoc) => {
      // Ensure imageDoc.createdAt exists before processing
      if (imageDoc.createdAt) {
        const date = new Date(imageDoc.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format: "July 25, 2025"

        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(imageDoc);
      }
    });
    return grouped;
  };

  const groupedImages = groupImagesByDate(images);

  // Toggle image action menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Handle image download - FIX APPLIED HERE
  const handleDownload = async (imageUrl, imageId) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${imageId || Date.now()}.jpg`; // Use imageId for filename if available
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the object URL
      setOpenMenuId(null); // Close menu after download
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image."); // Display an error to the user
    }
  };

  // Handle showing image details
  const handleShowDetails = (imageDoc) => {
    setSelectedImageDetails(imageDoc);
    setShowDetailsModal(true);
    setOpenMenuId(null); // Close menu after opening details
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 space-y-6 bg-gray-950 min-h-screen text-gray-100 font-inter">
      <h2 className="text-3xl font-extrabold text-white mb-6 capitalize">
        Album: {albumName}
      </h2>

      {/* Upload Section */}
      <form
        className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Add more images
        </h3>
        <div className="space-y-6">
          <ImageUploader onUpload={handleImageUpload} />

          {imageUrls.length > 0 && (
            <>
              <h3 className="text-base font-semibold text-gray-400">
                Uploaded Images ({imageUrls.length})
              </h3>

              <div
                className="grid gap-2 p-2 rounded-md border border-gray-600 bg-gray-800"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-md overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out shadow-md"
                  >
                    {/* Preview image */}
                    <img
                      src={url}
                      alt={`Uploaded ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-md"
                      loading="lazy"
                    />

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(idx)}
                      className="absolute top-1 right-1 bg-red-600 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        {success && <p className="text-green-400 mt-4 text-sm">{success}</p>}
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          disabled={uploading || imageUrls.length === 0}
        >
          {uploading ? "Uploading..." : "Submit Images"}
        </button>
      </form>

      {/* Loading/Error for fetched images */}
      {loading ? (
        <p className="text-gray-400 text-lg">Loading images...</p>
      ) : error && !success ? (
        <p className="text-red-400 text-lg">{error}</p>
      ) : images.length === 0 ? (
        <p className="text-gray-400 text-lg">No images in this album yet.</p>
      ) : (
        <>
          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">
            Total Images: {images.length}
          </h3>

          {/* Display Grouped Images */}
          {Object.keys(groupedImages).sort((a, b) => new Date(b) - new Date(a)).map((date) => (
            <div key={date} className="mb-10 p-4 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
              <h4 className="text-xl font-bold text-gray-300 mb-5 pb-2 border-b border-gray-700">
                {date}
              </h4>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                {groupedImages[date].map((imageDoc) =>
                  imageDoc.image.map((url, i) => (
                    <div key={imageDoc._id + "-" + i} className="relative w-40 h-40 rounded-lg overflow-hidden shadow-lg group">
                      <img
                        src={url}
                        alt={`img-${i}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Three dots menu button */}
                      <button
                        onClick={() => toggleMenu(imageDoc._id + "-" + i)}
                        className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-opacity-80 transition-opacity duration-200"
                        title="More options"
                      >
                        &#8942; {/* Vertical ellipsis character */}
                      </button>

                      {/* Dropdown menu */}
                      {openMenuId === (imageDoc._id + "-" + i) && (
                        <div
                          ref={menuRef} // Attach ref here
                          className="absolute top-12 right-2 bg-gray-800 border border-gray-700 rounded-md shadow-xl z-10 py-1"
                        >
                          <button
                            onClick={() => handleDownload(url, imageDoc._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleShowDetails(imageDoc)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                          >
                            Details
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Image Details Modal */}
      {showDetailsModal && selectedImageDetails && (
        <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full border border-gray-700 relative">
            <h3 className="text-2xl font-bold text-white mb-4">Image Details</h3>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Uploaded By:</span> {selectedImageDetails.uploader || "N/A"}
            </p>
            <p className="text-gray-300 mb-4">
              <span className="font-semibold">Created At:</span> {formatDate(selectedImageDetails.createdAt)}
            </p>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-700 transition-colors duration-200"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
