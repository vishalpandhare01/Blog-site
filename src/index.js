const express = require("express")
const bodyParser = require("body-parser")
const { default: mongoose } = require("mongoose")
const route = require("./router/router")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", route)

mongoose.connect("mongodb+srv://vishal0102:vishal0102@cluster0.9uryho2.mongodb.net/bolog-site", {
    useNewUrlParser: true
},mongoose.set('strictQuery', false)).then(() => { console.log("Mongoose connected") })
    .catch((err) => console.log(err))

app.listen(process.env.PORT || 3000, () => {
    console.log("server run on " + (process.env.PORT || 3000))
})
