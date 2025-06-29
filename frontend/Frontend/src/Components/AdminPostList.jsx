import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

function AdminPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/getPosts`, {
        withCredentials: true,
      });
      setPosts(res.data?.data || []);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${slug}`, {
        withCredentials: true,
      });
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  const location = useLocation();
  useEffect(() => {
    fetchPosts();
  }, [location]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl text-white font-bold mb-6 text-center sm:text-left">
        📝 All Blog Posts
      </h2>

      <div className="flex justify-end mb-4">
        <Link
          to="/admin/posts/create"
          className="border-2 bg-blue-200 text-black px-4 py-2 rounded hover:bg-blue-700 hover:text-white text-sm sm:text-base"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-300 py-10">
          <FaSpinner className="animate-spin text-xl" />
          <span>Loading posts...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-300">No posts found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 mx-auto lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 text-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
              <p className="text-blue-400 text-sm break-all mb-2">{post.slug}</p>

              <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-start gap-4 text-sm flex-wrap">
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-green-400 hover:underline"
                >
                  View
                </Link>
                <Link
                  to={`/admin/posts/edit/${post.slug}`}
                  className="text-yellow-400 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPostList;
