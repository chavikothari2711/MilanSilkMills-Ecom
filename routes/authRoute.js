import {Router} from "express";
import {registerController,loginController,testController,forgotPasswordController, getUserController, updateProfileController} from "../controllers/authController.js";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = Router();

//routing
//Post Register method
router.post("/register",registerController);

//Login post method
router.post("/login",loginController)

//Test route
router.get("/test",requiredSignIn,isAdmin, testController)

//forgot password route
router.post("/forgot-password",forgotPasswordController)

//protected route user
router.get("/user-auth",requiredSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})

//protected route admin
router.get("/admin-auth",requiredSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

router.get("/all-users",requiredSignIn,isAdmin,getUserController);

//update profile
router.put("/update-profile",requiredSignIn,updateProfileController);
export default router;