// aysncHandler in promise

// const aysncHandler = (requistHandler) => {
//    return  (req, res, next)=>{
//         Promise.resolve(requistHandler(req, res, next))
//         .catch((err)=> next(err))
//     }
// }

// export {aysncHandler}

// aysncHandler in try catch

const asyncHandler = (requistHandler) => async(req, res, next)=>{
    try {
        await requistHandler(req, res, next)
        next()
        
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
