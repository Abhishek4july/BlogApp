import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateSlug } from "../utils/generateSlug.js";

export const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required.");
  }

  const slug = generateSlug(title);

  const existing = await Post.findOne({ slug });
  if (existing) {
    throw new ApiError(409, "A post with a similar title already exists.");
  }

  const post = await Post.create({
    title,
    content,
    slug,
    author: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});


export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 }) 
    .populate("author", "FullName email role"); 

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

export const updatePostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required.");
  }

  const existingPost = await Post.findOne({ slug });

  if (!existingPost) {
    throw new ApiError(404, "Post not found.");
  }

  // Regenerate slug if title changes
  const newSlug = existingPost.title !== title ? generateSlug(title) : slug;


  existingPost.title = title;
  existingPost.content = content;
  existingPost.slug = newSlug;
  await existingPost.save();

  return res.status(200).json(
    new ApiResponse(200, existingPost, "Post updated successfully")
  );
});

export const deletePostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const deletedPost = await Post.findOneAndDelete({ slug });

  if (!deletedPost) {
    throw new ApiError(404, "Post not found or already deleted.");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedPost, "Post deleted successfully")
  );
});
