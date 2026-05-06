import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        title: {
            type:String,
            required: true  
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
        },
        isPublished: {
            type: Boolean,
            required: true,
            default: true
        },
        videoFile: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true
        },
        viwes:{
            type: Number,
            default:0,
            required: true
        },
        ower:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        

    },{timestamps: true})

    videoSchema.plugin(mongooseAggregatePaginate)

    export const Video = mongoose.model("Video", videoSchema)