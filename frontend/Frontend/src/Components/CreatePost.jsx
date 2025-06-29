import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

function generateSlug(title = "") {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function CreatePost() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate=useNavigate();
  const titleValue = watch("title");
  const [submitted, setSubmitted] = useState(false);


  // Watch title and update slug
  React.useEffect(() => {
    const newSlug = generateSlug(titleValue || "");
    setSlug(newSlug);
  }, [titleValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    setSubmitted(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/create`,
        {
          title: data.title,
          content,
          slug
        },
        { withCredentials: true }
      );

      setSuccessMsg("Post created successfully!");
      setValue("title", "");
      setContent("");
      navigate('/admin/dashboard')
      setSlug("");
    } catch (err) {
      console.error("Error creating post:", err);
      setErrorMsg(err?.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-white">Create New Blog Post</h2>

      {successMsg && <p className="bg-green-100 text-green-800 p-3 mb-4 rounded">{successMsg}</p>}
      {errorMsg && <p className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-gray-800 text-white"
            placeholder="Enter post title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Slug (readonly) */}
        <div>
          <label className="block text-white font-medium mb-1">Slug (auto-generated)</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={slug}
            readOnly
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-white font-medium mb-1">Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-gray-500 text-white"
          />
          {submitted &&!content && <p className="text-red-500 text-sm mt-1">Content is required</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !content}
          className="bg-blue-600 text-black px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
