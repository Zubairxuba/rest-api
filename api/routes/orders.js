const router = require("express").Router()
const {getOrders, createdOrder, getOneOrder, deleteOne} =require("../../controller/orderControllers")
const checkAuth = require("../middleware/check-auth")


router.get("/", getOrders)

router.post ("/", checkAuth, createdOrder )

router.get("/:orderId", getOneOrder)

router.delete("/:orderId",checkAuth, deleteOne)


module.exports = router