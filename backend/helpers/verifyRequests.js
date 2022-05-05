

export const postExists = (data,req,res,next)=>{
    if(`req.body.${data}`){
        next()
    }else{
        return res.status(400).json("Provide "+data+" in request body")
    }
}

export const getExists = (data)=>{
    if(`req.query.${data}`){
        return true
    }else{
        res.status(400).json("Provide "+data+" in url")
    }
}

