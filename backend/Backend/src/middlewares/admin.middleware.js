import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAdmin=asyncHandler(async(req,res,next)=>{
    if(req.user?.role!=='admin'){
        throw new ApiError(403,"Access denied. For Admins Only")
    }

    next();
});