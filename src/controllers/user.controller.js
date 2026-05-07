import { aysncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = aysncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (
    [fullname, username, email, password].some((filed) => filed?.trime() === "")
  ) {
    throw new ApiError(400, "fullfil all required fields");
  }

  const exitedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if(exitedUser){
    throw new ApiError(409, "username and email alredy exits")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path 

  if(!avatarLocalPath){
    throw new ApiError(400, " avatar file is required")
  }

 const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)

 if(!avatar){
    throw new ApiError(400, "avatar file is required")
 }

 const user = User.create({
    fullname,
    email,
    username: username.toLowerCase,
    avatar: avatar.url,
    coverImage: coverImage?.url ||  "",
 })

 const createdUser = await User.findById(user._id).select(
    "-password -refeshToken"
 )

 if(!createdUser){
    throw new ApiError(500, "Someting went wronge while registration the user")
 }

 return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succefully")
 )

});

export { registerUser };

/*

-get user detail from frontend
-validation - not empty
-check if user alredy exit: username, email
-check for image and avatar
-upload them to cloudinary, avatar
-create user odject in db - create entry in db
-remove password and refesh token field from response
-check for user creation
-return response

*/

// if(fullname === ""){
//         throw new ApiError(400, "fullname is required")
//     }
