import { aysncHandler } from "../utils/asyncHandler.js";

const registerUser = aysncHandler( async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Ok"
    })
})

export {registerUser}