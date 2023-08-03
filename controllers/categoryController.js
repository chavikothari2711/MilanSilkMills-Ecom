import categoryModel from "../models/categoryModel.js"
import slugify from "slugify";

export const createCategoryController = async(req,res) =>{
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
              message:"Name is required"  
            })
        }
        const existingCategory = await categoryModel.findOne({slug:slugify(name)})
        if(existingCategory){return res.status(200).send({success:false,message:"category already exist"})}
        const category = await new categoryModel({
            name,
            slug:slugify(name)}).save();

        res.status(201).send({
            success:true,
            message:"Category is created",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            sucess:false,
            message:"Error in creating category",
            error
        })
    }
}

export const updateCategoryController = async(req,res) =>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{
            name,slug:slugify(name)},
            {new:true});
        res.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in updating category",
            error
        })
    }
}

export const allCategoryController = async(req,res) => {
    try {
        const category = await categoryModel.find();
        res.status(200).send({
            success:true,
            message:"all categories",
            category
        })
    } catch (error) {
       console.log(error);
       res.status(500).send({
        success:false,
        message:"error in getting all category",
        error
       }) 
    }
}

export const singleCategoryController = async(req,res) => {
    try {
        const category = await categoryModel.find({slug:req.params.slug});
        res.status(201).send({
            success:true,
            message:"single category",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting category",
            error,
        })
    }

}

export const deleteCategoryController = async(req,res) => {
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"deleted the category",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting category",
            error
        })
    }
}