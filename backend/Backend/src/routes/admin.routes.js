import { Router } from "express";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { createPost, deletePostBySlug, getAllPosts, updatePostBySlug } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getPostBySlug } from "../controllers/user.controllers.js";

const router=Router();

router.route('/posts/create').post(verifyJWT,isAdmin,createPost)
router.route('/posts/:slug').put(verifyJWT,isAdmin,updatePostBySlug)
router.route('/posts/:slug').delete(verifyJWT,isAdmin,deletePostBySlug)
router.route('/getPosts').get(getAllPosts)
router.route('/posts/:slug').get(getPostBySlug)


export default router