import dotenv from "dotenv"
import connectDB from "./db/index.js";
import dns from "dns"
import app from "./app.js";

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])

dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server running on port:${process.env.PORT}`)
    })
    app.on("error", (error)=>{
        console.log("Error: ", error)
        throw error
    })
})
.catch((error)=>{
    console.error("error from server")
})

/*
import express from "express"
const app = express()

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("error", error)
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`Port runing on ${process.env.PORT }` )
        })

    } catch (error) {
        console.error(`Error: ${error}`)
        throw error
    }
})()
*/