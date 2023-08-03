import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js";
//protected routes token base
export const requiredSignIn = async (req,res,next) =>{
    try{
        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET)
        req.user = decode;
        next();
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"error in register process",
            err
        })
    }
}

//admin access
export const isAdmin = async(req,res,next) => {
    try{
        const user = await userModel.findById(req.user._id)
        if(user.role !==1){
            return res.status(401).send({
                success:false,
                message:"Unauthorized Access"
            })
        }
        next();
    }catch(err){
        console.log(err);
        res.send(401).send({
            success:false,
            err,
            message:"Error in Admin middleware"
        })
    }
}