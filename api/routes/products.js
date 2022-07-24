const router = require("express").Router()
const mongoose = require("mongoose")
require("../../app")


const {getProducts, createdProduct, getOneProduct, deleteOne, updateProduct} = require("../../controller/productController")
const checkAuth = require("../middleware/check-auth")



// Routes/////////////////////////


router.get('/', getProducts );


router.post('/',checkAuth, createdProduct );

router.get('/:productId', getOneProduct);

router.delete('/:productId',checkAuth, deleteOne);

router.patch('/:productId', checkAuth, updateProduct);



module.exports = router