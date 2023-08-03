import express from 'express';
import { isAdmin, requiredSignIn } from '../middlewares/authMiddleware.js';
import { allProductController, braintreePaymentController, braintreeTokenController, createProductController, deleteProductContoroller, getAllOrderContoller, orderStatusController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, showAllOrderContoller, singleProductController, updateProductController } from '../controllers/productController.js';
import formidable from "express-formidable";

const router = express.Router();

//route for create product
router.post('/create-product',requiredSignIn,isAdmin,formidable(),createProductController)

//route for all product 
router.get('/get-product',allProductController)

//route for single product
router.get('/get-single-product/:slug',singleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete("/delete-product/:pid",requiredSignIn,isAdmin,deleteProductContoroller)

//route for update product
router.put('/update-product/:pid',requiredSignIn,isAdmin,formidable(),updateProductController)

//filter product
router.post('/product-filter',productFilterController);

//product count
router.get("/product-count",productCountController);

//product per page
router.get('/product-list/:page',productListController);

//search-product
router.get("/search/:keyword",searchProductController);

//similar products
router.get("/related-product/:pid/:cid",relatedProductController);

//products acc to category
router.get("/product-category/:catslug",productCategoryController);

//payement route
//token
router.get('/braintree/token',braintreeTokenController);
//payemnts
router.post('/braintree/payment',requiredSignIn,braintreePaymentController);

//order route
router.get("/orders",requiredSignIn,showAllOrderContoller)

router.get("/all-orders",requiredSignIn,isAdmin,getAllOrderContoller)

router.put("/order-status/:oid",requiredSignIn,isAdmin,orderStatusController)
export default router