const express = require("express")
const app = express()
const mongoose = require("mongoose")
const config = require("dotenv").config;
const morgan = require("morgan")
const bodyParser = require("body-parser")
config();

const routerProducts = require("./api/routes/products")
const routerOrder = require("./api/routes/orders")
const routerUser = require("./api/routes/user")
// MongoDB...Database

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Database Connected successfully");
});

app.use("/upload", express.static("upload/"))
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(morgan("dev"))

app.use("/user", routerUser)
app.use("/products", routerProducts)
app.use("/orders", routerOrder)




//  middleware 

app.use((req, res, next)=>{
    const error = new Error("Not Found")
    error.status = 404  
    next(error)
})
app.use((error, req, res, next) =>{
    res.status(error.status || 500)
    res.json({
        error: {
            message : error.message
        }
    })
})


app.listen(process.env.SERVER_PORT || 5000,()=>
    console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`)
);