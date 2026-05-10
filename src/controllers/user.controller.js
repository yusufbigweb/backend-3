import { aysncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

//generat access and refresh token using this method
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    
    console.log("access:", accessToken);
    console.log("ref:", refreshToken);

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

  } catch (error) {
    console.error("Real error:", error);
    throw new ApiError(500, "Someting went wronge while genrating access and refresh token")
  }
}

//register user
const registerUser = aysncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "fullfil all required fields");
  }

  const exitedUser = await  User.findOne({
    $or: [{ username }, { email }],
  });

  if(exitedUser){
    throw new ApiError(409, "username and email alredy exits")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
//   const coverImageLocalPath = req.files?.coverImage[0]?.path 

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
}

  if(!avatarLocalPath){
    throw new ApiError(400, " avatar file is required")
  }

 const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)

 if(!avatar){
    throw new ApiError(400, "avatar file is required")
 }

 const user = await User.create({
         fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
 })


 const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
 )

 if(!createdUser){
    throw new ApiError(500, "Someting went wronge while registration the user")
 }

 return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered succefully")
 )

});


// user login 
const loginUser = aysncHandler(async (req, res)=>{
    const {email, username, password} = req.body;

    if(!email && !username) {
      throw new ApiError(400, "email or username is required")
    }

    const user = await  User.findOne({
      $or:[{email}, {username}]
    })

    if(!user){
      throw new ApiError(404, "User does not exist")
    }

    const isPasswordVaild = await user.isPasswordCorrect(password)

    if(!isPasswordVaild){
      throw new ApiError(401, "Password Invaild")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
      httpOnly: true,
      secure: true
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200,{ user: loggedInUser, accessToken, refreshToken},"User logged in Successfully"))
})

//user loggout
const logoutUser = aysncHandler(async (req, res)=> {
  await User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        refreshToken: undefined
      },
   },
   {
    new: true
   }
  )  

 const options = {
      httpOnly: true,
      secure: true
    }

    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})




export { registerUser, loginUser, logoutUser };