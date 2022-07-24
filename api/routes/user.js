const router = require("express").Router()

const {userSignup, userLogin, getAllUsers, deleteUser} = require("../../controller/userController")
const User = require('../model/user')



router.post("/signup", userSignup);

router.get("/",  getAllUsers)

router.post("/login", userLogin )

router.delete("/:userId", deleteUser)


module.exports = router;