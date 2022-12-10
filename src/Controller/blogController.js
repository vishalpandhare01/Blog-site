const { isValidObjectId } = require("mongoose");
const blogModel = require("../models/blogModel");

//Create Blog API --------------------------------------------------------------------------

const createBlog = async function (req, res) {

    try {
        let data = req.body;

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Please enter detials to create blog" }) };

        let { title, body, authorId, tags, category, subcategory } = data;

        if (typeof (tags) != "object" || typeof (subcategory) != "object") { return res.status(400).send({ status: false, msg: "Please enter tags and subcategory values in Array" }) };

        let categorys = []
        if (category != null || category.length < 0) {
            category.map((a) => {
                allElement = a.toLowerCase()
                categorys.push(allElement)
            })
        }
        data.category = categorys

        let subcategorys = []
        if (subcategory != null || subcategory.length < 0) {
            subcategory.map((a) => {
                allElement = a.toLowerCase()
                subcategorys.push(allElement)
            })
        }
        data.subcategory = subcategorys

        let tagArr = []
        if (tags != null || tags.length < 0) {
            tags.map((a) => {
                allElement = a.toLowerCase()
                tagArr.push(allElement)
            })
        }
        data.tags = tagArr


        if (!title) { return res.status(400).send({ status: false, msg: "Please enter title" }) };
        if (!body) { return res.status(400).send({ status: false, msg: "Please enter body" }) };
        if (!authorId) { return res.status(400).send({ status: false, msg: "Please enter authorId" }) };
        if (!tags) { return res.status(400).send({ status: false, msg: "Please enter tags" }) };
        if (!category) { return res.status(400).send({ status: false, msg: "Please enter category" }) };
        if (!subcategory) { return res.status(400).send({ status: false, msg: "Please enter subcategory" }) };

        if (!isValidObjectId(authorId)) { return res.status(400).send({ status: false, msg: "Please enter valid authorId" }) };


        if (data.isPublished == true) { data.publishedAt = new Date().toLocaleString() }
        if (data.isDeleted == true) { data.deletedAt = new Date().toLocaleString() }

        let result = await blogModel.create(data);
        res.status(201).send({ status: true, data: result });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

//API to fetch the blogs -----------------------------------------------------------------------------

const getBlogs = async function (req, res) {

    try {
        let data = req.query;
        let { userId, category, subcategory, tags } = data
        if (category != null) category = req.query.category.toLowerCase()
        if (subcategory != null) subcategory = req.query.subcategory.toLowerCase()
        if (tags != null) tags = req.query.tags.toLowerCase()

        if (userId || category || subcategory || tags) {
            if (userId) { if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: " invalid userId plese Enter valid userId ...!" }) } }

            if (category) {
                let categoryblogs = await blogModel.find({ $and: [{ category: { $in: [category] } }, { isDeleted: false }] })
                if (categoryblogs.length == 0) { return res.status(404).send({ status: true, message: 'blog Not found' }) }
                if (categoryblogs) { return res.status(200).send({ status: true, data: categoryblogs }) }
            }

            if (subcategory) {
                let subcategoryBlog = await blogModel.find({ $and: [{ subcategory: { $in: [subcategory] } }, { isDeleted: false }] })
                if (subcategoryBlog.length == 0) { return res.status(404).send({ status: true, message: 'blog Not found' }) }
                if (subcategoryBlog) { return res.status(200).send({ status: true, data: subcategoryBlog }) }
            }

            if (tags) {
                let tagsBlog = await blogModel.find({ $and: [{ tags: { $in: [tags] } }, { isDeleted: false }] })
                console.log(tagsBlog)
                if (tagsBlog.length == 0) { return res.status(404).send({ status: true, message: 'blog Not found' }) }
                if (tagsBlog) { return res.status(200).send({ status: true, data: tagsBlog }) }
            }

            if (userId) {
                let userIdBlog = await blogModel.find({ $and: [{ userId: userId }, { isDeleted: false }] })
                if (userIdBlog.length == 0) { return res.status(404).send({ status: true, message: 'blog Not found' }) }
                if (userIdBlog) { return res.status(200).send({ status: true, data: userIdBlog }) }
            }
        }
        else {
            let blogs = await blogModel.find({ isDeleted: false }).select({ __v: 0, createdAt: 0, updatedAt: 0 }).sort({ title: 1 })
            if (blogs.length == 0) { return res.status(404).send({ status: true, message: 'Books Not found' }) }
            return res.status(200).send({ status: true, data: blogs })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


//API to Update the fields of any Blog -----------------------------------------------------------
const updateBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) { return res.status(400).send({ status: false, msg: "Please enter valid blog Id" }) }

        let data = req.body;
        let { title, body, tags, category, subcategory } = data

        let obj1 = {}
        let obj2 = {}
        if (title) { obj1.title = title }
        if (body) { obj1.body = body }
        if (category) { obj1.category = category }
        obj1.isPublished = true
        obj1.publishedAt = new Date().toLocaleString()

        if (tags) { obj2.tags = tags }
        if (subcategory) { obj2.subcategory = subcategory }

        let blogData = await blogModel.findById({ _id: blogId })
        if (blogData == null) { return res.status(400).send({ status: false, msg: "This Blog Not found" }) }
        if (blogData.isDeleted == true) { return res.status(400).send({ status: false, msg: "This Blog is Deleted" }) }
        else {
            let result = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: obj1, $push: obj2 }, { new: true })
            res.status(200).send({ status: true, data: result })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//API to delete a blog by using blogId ---------------------------------------------------

const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) { return res.status(400).send({ status: false, msg: "Please enter a valid blogId" }) }

        let dataUpdate = {
            isDeleted: true,
            deletedAt: new Date().toLocaleString()
        }
        let blogData = await blogModel.findById({ _id: blogId })
        if (blogData.isDeleted == true) { return res.status(400).send({ status: false, msg: "Blog is already Deleted" }) }

        await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: dataUpdate })
        res.status(200).send({ status: true, msg: "Deleted" })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//API to delete a Blog by any field --------------------------------------------------------------

const deleteByField = async function (req, res) {
    // Delete blog documents by category, authorid, tag name, subcategory name, unpublished
    try {
        let data = req.query;
        let { authorId, subcategory, tags } = data

        //Authorization---------------
       let blogDocx = await blogModel.findOne(data)
        if (req.decode.authorId != blogDocx.authorId) {
            return res.status(403).send({ status: false, msg: "Authorization failed" })
        }
       // ----------------------------

        if (subcategory != null) subcategory = req.query.subcategory.toLowerCase()
        if (tags != null) tags = req.query.tags.toLowerCase()

        let dataUpdate = {
            isDeleted: true,
            deletedAt: new Date().toLocaleString()
        }
        if (authorId || subcategory || tags) {
            if (subcategory) {
                let subcategoryBlog = await blogModel.findOneAndUpdate({ $and: [{ subcategory: { $in: [subcategory] } }, { isDeleted: false }, { isPublished: true }] }, { $set: dataUpdate })
                if (subcategoryBlog == null) { return res.status(200).send({ status: false, data: "blog not found" }) }
                if (subcategoryBlog) { return res.status(200).send({ status: true, data: "delete" }) }
            }
            if (tags) {
                let tagblog = await blogModel.findOneAndUpdate({ $and: [{ tags: { $in: [tags] } }, { isDeleted: false }, { isPublished: true }] }, { $set: dataUpdate })
                if (tagblog == null) { return res.status(200).send({ status: false, data: "blog not found" }) }
                if (tagblog) { return res.status(200).send({ status: true, data: "delete" }) }
            }
            if (authorId) {
                let authorIddBlog = await blogModel.findOneAndUpdate({ $and: [{ authorId: authorId }, { isDeleted: false }, { isPublished: true }] }, { $set: dataUpdate })
                console.log(authorIddBlog)
                if (authorIddBlog) { return res.status(200).send({ status: false, data: "Delete" }) }
                if (authorIddBlog == null) { return res.status(200).send({ status: true, data: "blog  not found" }) }
            }
            return res.status(404).send({ status: false, data: "blog not found" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createBlog, getBlogs, updateBlog, deleteBlog, deleteByField }