const Order = require("../api/model/orders")
const Product = require("../api/model/products")
const mongoose = require("mongoose")
require("../app")

const getOrders =  (req, res, next)=>{
    Order.find()
    .select("_id product quantity")
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            Count: result.length,
            Orders: result.map(doc=>{
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: "http://:localhost:3000/orders " + doc._id
                    }
                }
            })
           

        })
    })
    .catch(err=>{
        res.status(500).json({error: err})
    })

}

const createdOrder = (req, res, next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        order
        .save()
        .then(docs=>{
            console.log(docs);
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: docs._id,
                    product: docs.product,
                    quantity: docs.quantity
                },
                request: {
                    type: "POST",
                    url : "http://:localhost:3000/orders" + docs._id
                 }
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: "Product Not Found",   
            error: err
        })
    })
  

}

const getOneOrder =  (req, res, next)=>{
    const id = req.params.orderId
   Order.findById(req.params.orderId)
   .exec()
   .then(doc=>{
    if(!doc){
        res.status(404).json({
            message: "Order Not Found"
        })
    }
    res.status(200).json({
        message: "Product Found",
        Order: doc,
        resquest : {
            type: "Get",
            url: "http://localhost:3000" + doc._id
        }
    
       })
   })
   .catch(err=>{
    res.status(404).json({
        message: "Order Not Found",
        error: err,
        

    })
   })
   
}

const deleteOne  =  (req, res, next)=>{
    const _id = req.params.orderId
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Order Deleted",
            _id: _id,
            request: {
                type: "POST",
                url: "http://:localhost:3000/orders/"
            }
        })
    })
    .catch(err=>{
        res.status(404).json({
            error: err
        })
    })
}



module.exports = {
    getOrders, createdOrder, getOneOrder, deleteOne,

}