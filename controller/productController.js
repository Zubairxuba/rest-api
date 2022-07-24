const Product = require("../api/model/products")
require("../app")


const  getProducts = (req, res, next) => {
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs =>{
        const response = {
            count : docs.length,
            products : docs.map(doc=>{
                return{
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/"+ doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json({error: err})
    })
}

const createdProduct =  (req, res, next) => {
    
    const product = new Product({
        
        name: req.body.name,
        price: req.body.price,
        // productImage: req.file.path

    })
    if(!product){
        res.status(404).json({
            message: "Product Not Found",
            error: err
        })
    }
    product.save()
        .then(result => {
            console.log(result)
            res.status(200).json({
                massage: "Created New Product",
                createdProduct: product
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });

    if (product.save) {
        console.log(`Successfully Save`);
    } else {
        console.log(`Unable to  save`);
    }


}


const getOneProduct =  (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select(" name price _id")
        .exec()
        .then(doc => {
        res.status(200).json({
            message: "product...",
            product: doc,
            resquest: {
                type: "GET",
                url : "http://localhost:3000/products"
            }

        })

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });


}

const deleteOne =  (req, res, next) => {
    const id = req.params.productId
Product.remove({_id : id})
.select("name price _id")
.exec()
.then(doc=>{
    res.status(201).json({
        id: id,
        massage: "You deleted this  " +   id +   "  from Database",
        request: {
            type: "POST",
            url: "http://localhost:3000/products"
        }
    })
})
.catch(err=>{
    console.log(err);
    res.status(404).json({error: err})
})

}


const updateProduct =  (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body){
        updateOps[ops.propName]= ops.value
    }
    Product.update({_id: id},{$set:updateOps })
    .exec()
    .then(result =>{
        res.status(200).json({
            message: "Product is updated",
            Product: result,
            request: {
                type : "GET",
                url : "http://localhost:3000/products"
            }
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json({error: err})
    })
}




module.exports = {
    getProducts, createdProduct, getOneProduct, deleteOne, updateProduct, 
}