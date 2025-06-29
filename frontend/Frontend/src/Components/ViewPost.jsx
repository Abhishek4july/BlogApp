import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import parse from "html-react-parser";

function ViewPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts/${slug}`)
      .then((res) => setPost(res.data.data))
      .catch((err) => console.error("Failed to fetch post", err));
  }, [slug]);

  if (!post) {
    return <div className="text-white p-6 text-center">Loading...</div>;
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 pt-32 pb-20">
        <Helmet>
          <title>{post.title} | Blog</title>
          <meta
            name="description"
            content={post.content.replace(/<[^>]+>/g, "").slice(0, 150)}
          />
        </Helmet>

        <div className="max-w-3xl mx-auto bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug text-center">
            {post.title}
          </h1>

          <hr className="border-gray-600 mb-8" />

          <div className="prose prose-invert max-w-none text-lg leading-relaxed mb-6">
            {parse(post.content)}
          </div>
        </div>
        {isAuthenticated && (
            <div className="text-center mt-10">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg transition"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}
      </div>
    </HelmetProvider>
  );
}

export default ViewPost;
