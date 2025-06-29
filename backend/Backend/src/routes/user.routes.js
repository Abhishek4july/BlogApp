import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getPostBySlug } from "../controllers/user.controllers.js";
import { loginUser } from "../controllers/user.controllers.js";
import { logoutUser } from "../controllers/user.controllers.js";
import { refreshAccessToken } from "../controllers/user.controllers.js";
import { getCurrentUser } from "../controllers/user.controllers.js";

const router=Router()


router.route("/login").post(loginUser)

//secured routes
router.route('/getUser').get(verifyJWT,getCurrentUser)

router.route('/posts/:slug').get(getPostBySlug)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

export default router