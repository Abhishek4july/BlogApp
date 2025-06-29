import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

function generateSlug(title = "") {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newSlug, setNewSlug] = useState(slug);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${slug}`, {
          withCredentials: true,
        });
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
        setNewSlug(res.data.data.slug);
      } catch (err) {
        console.error("Error fetching post", err);
        setMessage("Post not found");
      }
    };

    fetchPost();
  }, [slug]);

  const handleUpdate = async () => {
    if (!title || !content) {
      setMessage("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const res=await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/${slug}`,
        {
          title,
          content,
          slug: newSlug,
        },
        {
          withCredentials: true,
        }
      );
      setMessage("Post updated successfully");
      console.log("Updated Post:", res.data.data)
      navigate('/admin/dashboard');

    } catch (err) {
      console.error("Update error", err);
      setMessage("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-white">Edit Blog Post</h2>

      {message && <p className="mb-4 text-sm text-yellow-300">{message}</p>}

      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setNewSlug(generateSlug(e.target.value));
            }}
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-1">Slug</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-1">Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-gray-400"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-green-600 text-black px-6 py-3 rounded hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </div>
    </div>
  );
}

export default EditPost;
