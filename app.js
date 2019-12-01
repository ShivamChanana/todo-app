const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const todos = require("./models/Todos")
const methodOverride = require("method-override")
const apiRouter = require("./routes/apiRouter")

app.use("/api", apiRouter)
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended : false}))
app.use(bodyParser.json())
app.use(methodOverride("_method"))


mongoose.connect("mongodb://localhost:27017/todolist")
.then(()=>{
    console.log("DB connected")
})
.catch((err)=>{
    console.log(err)
})

//REST API



//appRoute

app.get("/home", (req,res)=>{
    todos.find()
    .then((data)=>{
        res.render("index", {data : data})
       })
    .catch((err)=>{
        console.log(err)
    })
})

app.post("/home", (req,res)=>{
    todos.create({
        name: req.body.name
    })
    .then(()=>{
        res.redirect("/")
        
    })
    .catch((err)=>{
        console.log(err)
       
    })
})

//update
app.get("/home/update/:id", (req,res)=>{
    todos.findById(req.params.id)
    .then((data)=>{
        res.render("update", {updateTask : data})
    })
    .catch((err=>{
        console.log(err)
    }))
})

app.put("/home/update/:id", (req,res)=>{
    todos.findByIdAndUpdate((req.params.id), {
        name: req.body.name
         })
    .then(()=>{
        res.redirect("/")
        
    })
    .catch((err)=>{
        console.log(err)
        
    })
})

//delete
app.delete("/home/delete/:id", (req,res)=>{
    todos.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/")  
    })
    .catch((err)=>{
        res.status(400).json({error : err})
    })
})



app.listen(port, (req,res)=>{
    console.log(`App is running at port ${port}`)
})