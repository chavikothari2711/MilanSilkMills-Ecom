import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/authUtils.js";
import JWT from "jsonwebtoken";

export const registerController = async(req,res) =>{
    try{
        const {name,email,password,phone,address,answer} = req.body;
        //validations
        if(!name){ return res.send({message : "Name is Required"})}
        if(!email){return res.send({message : "Email is Required"})}
        if(!password){return res.send({message : "Password is Required"})}
        if(!phone){return res.send({message : "Phone is Required"})}
        if(!address){return res.send({message : "Address is Required"})}
        if(!answer){return res.send({message : "Answer is Required"})}

        //existing user check
        const existingUser= await userModel.findOne({email});
        if(existingUser){
            console.log(existingUser);
            return res.status(200).send({
                success:false,
                message:"Already Registered, Please Login",
                existingUser
            })
        }
        //creating hash Password
        const hashedPassword = await hashPassword(password)
        //save user details
        const user = await new userModel({
            name,
            email,
            password:hashedPassword,
            phone,
            address,
            answer}).save();
        
            res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user
        });
    
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in Registeration',
            err
        })
    }
};

//Post Login
export const loginController = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.send(404).send({
                success:false,
                message:"Invalid email Id or Password"
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registered"
            })
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        //token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET ,{
            expiresIn:"7d",
        });
        res.status(200).send({
            success:true,
            message:"login succesfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                answer:user.answer,
                role:user.role
            },
            token,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }
} 

//forgot password controller
export const forgotPasswordController = async(req,res) => {
    try {
        const {email,answer,newPassword} = req.body;
        if(!email){res.status(400).send({message:"Email is required"})}
        if(!answer){res.status(400).send({message:"answer is required"})}
        if(!newPassword){res.status(400).send({message:"newPassword is required"})}

        //check email and answer
        const user = await userModel.findOne({email,answer})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"wrong email or answer"
            })
        }
        const hashedPassword = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashedPassword});
        res.status(200).send({
            success:true,
            message:"Password reset succesfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Somethig went wrong",
            error
        })
    }
}

//test Controller
export const testController = (req,res) => {
    console.log("protected route")
    res.send("Protected Route")
}

//get users
export const getUserController = async(req,res) => {
    try {
        const user = await userModel.find({});
        res.status(200).send({
            success:true,
            message:"All Users",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in getting user"

        })
    }
}

//updateProfile
export const updateProfileController = async(req,res)=>{
    try {
        const {name,email,phone,address,answer,password} = req.body;
        const checkuser = await userModel.findById(req.user._id);
        const match = await comparePassword(password,checkuser.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            phone: phone || user.phone,
            address: address || user.address,
        },{ new: true })
        res.status(200).send({
            success:true,
            message:"profile updated",
            updateUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in updating profile",
            error,
        })
    }
}