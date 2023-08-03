import dotenv from "dotenv";
dotenv.config();
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js"
import braintree from "braintree";
import slugify from "slugify";
import fs from "fs";

//gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createProductController = async(req,res) => {
    try {
        const { name, description, price, category, quantity, shipping,color,colouravailable,keywords } =req.fields;
        const { photo } = req.files; 
        //validation
        switch(true){
            case !name: 
                return res.status(500).send({error:"name is required"})
            case !description: 
                return res.status(500).send({error:"description is required"})
            case !price: 
                return res.status(500).send({error:"price is required"})
            case !category: 
                return res.status(500).send({error:"category is required"})
            case !quantity: 
                return res.status(500).send({error:"quantity is required"})
            case !color: 
                return res.status(500).send({error:"color is required"})
            case !colouravailable: 
                return res.status(500).send({error:"colouravailable is required"})
            case !photo && photo.size >100000: 
                return res.status(500).send({error:"photo is required and should be less than 1mb"})
        }
        const existingproduct = await productModel.findOne({slug:slugify(name)}) 
        if(existingproduct){
            return res.status(200).send({
                success:false,
                message:"Product already existed",
                existingproduct
            })
        }
        const products = new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"New Product is created",
            products
        })
    } catch (error) { 
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in creating product",
            error
        })
    }
}

export const allProductController = async(req,res) =>{
    try {
       const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
       res.status(200).send({
        success:true,
        message:"All Products",
        total:products.length,
        products
       })
    } catch (error) {
        console.log(error)
        res.status(500).send({
           success:false,
           message: "error in getting product",
           error
        })
    }
}

export const singleProductController = async(req,res) => {
    try {
        const slug = req.params.slug;
        const product = await productModel.findOne({slug}).populate('category').select("-photo");
        console.log(slug);
        console.log(product)
        res.status(200).send({
            success:true,
            message:"Got the Product",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in getting particular product",
            error
        })
    }
}

export const productPhotoController = async(req,res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            return res.set('Content-type',product.photo.contentType).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while getting product photo",
            error
        })
    }
}

export const deleteProductContoroller = async(req,res)=>{
    try {
        const {pid} = req.params;
        const product = await productModel.findByIdAndDelete(pid);
        res.status(200).send({
            success:true,
            message:"Deleted the product",
            product
        })        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in deleting the product",
            error
        })
    }
    
}

export const updateProductController = async(req,res) => {
    try {
        const {pid} = req.params;
        const { name, description, price, category, quantity, shipping,color,colouravailable,keywords } =req.fields;
        const { photo } = req.files; 
        //validation
        switch(true){
            case !name: 
                return res.status(500).send({error:"name is required"})
            case !description: 
                return res.status(500).send({error:"description is required"})
            case !price: 
                return res.status(500).send({error:"price is required"})
            case !category: 
                return res.status(500).send({error:"category is required"})
            case !quantity: 
                return res.status(500).send({error:"quantity is required"})
            case !color: 
                return res.status(500).send({error:"color is required"})
            case !colouravailable: 
                return res.status(500).send({error:"colouravailable is required"})
            
        }
        const products = await productModel.findByIdAndUpdate(pid,{...req.fields,slug:slugify(name)},{new:true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product is updated",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in updating",
            error
        })
    }
}

export const productFilterController = async(req,res) => {
    try {
       const {checked,radio} = req.body;
       let args = {};
       if(checked.length > 0) args.category = checked
       if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]} 
       const products = await productModel.find(args)
       res.status(200).send({
        success:true,
        products
       })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in getting filtered products",
            error
        })
    }
}

export const productCountController = async(req,res) => {
   try {
       
        const total = await productModel.find({}).estimatedDocumentCount();

        res.status(200).send({
            success:true,
            message:"product count",
            total
        })
   } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in product count",
            error
        })
   } 
}

export const productListController = async(req,res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
      const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
      res.status(200).send({
        success:true,
        products
      })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error",
            error
        })
    }
}

export const searchProductController = async(req,res) => {
    try {
       const {keyword} = req.params;
       const result = await productModel.find({
        $or:[
           {name:{$regex:keyword,$options:"i"}},
           {description:{$regex:keyword,$options:"i"}} 
        ]
       }).select("-photo");
       res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in searching product"
        })
    }
}

export const relatedProductController = async(req,res)=>{
    try {
        const {pid,cid} = req.params;
        const product = await productModel.find({
            category:{_id:cid},
            _id:{$ne:pid}
        }).select("-photo").limit(6).populate("category");
        res.status(200).send({
            success:true,
            message:"products",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in getting similar products",
            error
        })
    }
}

export const productCategoryController = async(req,res) => {
    const {catslug} = req.params;
    try {
        const category = await categoryModel.findOne({ slug: catslug });
        const product = await productModel.find({ category }).populate("category");       res.status(200).send({
        success:true,
        message:"products",
        product,
        category
       }) 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in getting product",
            error
        })
    }
}

//payemnt gateway
export const braintreeTokenController = async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }
            else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const braintreePaymentController = async(req,res)=>{
    try {
        const {cart,nonce} = req.body;
        let total=0;
        cart.map((item)=>{
            total+=item.price
        });
        let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            },
        },
        function(error,result){
            if(result){
                const order = new orderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id
                }).save()
                res.json({ok:true})
            }else{
              res.status(500).send(error)  
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const showAllOrderContoller = async(req,res) => {
    try {
      const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
      res.json(orders) 
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting order",
            error
        })
    }
}

export const getAllOrderContoller = async(req,res) => {
    try {
      const orders =  await orderModel.find().populate("products","-photo").populate("buyer","name");
      
      res.json(orders) 
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting order",
            error
        })
    }
}

export const orderStatusController = async(req,res) =>{
    try {
        const {oid} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(oid,{status},{new:true})
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in updating status",
            error
        })
    }
}