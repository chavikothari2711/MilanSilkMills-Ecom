import {Router} from "express";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";
import {updateCategoryController, createCategoryController, allCategoryController, singleCategoryController, deleteCategoryController } from "../controllers/categoryController.js";
const router = Router();

//routes
router.post('/create-category',requiredSignIn,isAdmin,createCategoryController);

//update category
router.put('/update-category/:id',requiredSignIn,isAdmin,updateCategoryController);

//get all category
router.get('/all-category',allCategoryController);

//single category
router.get('/single-category/:slug',singleCategoryController);

//delete category
router.delete('/delete-category/:id',requiredSignIn,isAdmin,deleteCategoryController)
export default router