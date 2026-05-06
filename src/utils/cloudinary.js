import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
   api_key: process.env.CLOUDINARY_API_KEY, 
   api_secret: process.env.CLOUDINARY_API_KEY_SECTRET 
});

const uploadOnCloudinary = async (localFileUploadPath) =>{
    try {
        if(!localFileUploadPath) return null
        const response = await cloudinary.uploader.upload(localFileUploadPath,
         {
            resource_type: "auto"
        })
        //file has been uploaded successfull
        console.log(`file is uploaded cloudinary ${response.url}`)
        return response
    } catch (error) {
        fs.unlinkSync(localFileUploadPath) //remove the locally file saved temporary file as the upload operation got fialed
    }
}


export {uploadOnCloudinary}