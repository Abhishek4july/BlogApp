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

      {/* <div className="flex justify-end mb-4">
        <Link
          to="/admin/posts/create"
          className="bg-white text-black px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          + New Post
        </Link>
      </div> */}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-300 text-center">No posts found.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              {/* Left Side: Title + Slug */}
              <div className="flex-1 mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-blue-400 text-sm break-all">{post.slug}</p>
              </div>

              {/* Right Side: Date + Actions */}
              <div className="flex gap-3">
         <Link
         to={`/blog/${post.slug}`}
            className="text-green-400 hover:underline"
           >
          View
            </Link>
          </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPostList;
