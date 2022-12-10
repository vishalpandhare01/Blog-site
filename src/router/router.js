const express = require("express")
const router = express.Router()
const authorController = require("../Controller/authorController")
const blogController = require("../Controller/blogController")
const middleware = require("../middleware/authMiddleware")

//Authors Register---------------------------------------------------------
router.post("/authors",authorController.createAuthor)

//LogIn users--------------------------------------------------------------
router.post("/login", authorController.authorLogin)

//Create Blog's------------------------------------------------------------
router.post("/blogs", middleware.authentication, blogController.createBlog)

//fetch (search) Blog's----------------------------------------------------
router.get("/blogs", middleware.authentication, blogController.getBlogs)

//Update Blog's-------------------------------------------------------------
router.put("/blogs/:blogId", middleware.authentication,  blogController.updateBlog)

//Delete Blog's-------------------------------------------------------------
router.delete("/blogs/:blogId", middleware.authentication, middleware.authorization, blogController.deleteBlog)

//Delete Blog's By Qury-----------------------------------------------------
router.delete("/blogs", middleware.authentication,blogController.deleteByField)

module.exports = router;