const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const todos = require("./models/Todos")
const methodOverride = require("method-override")

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

app.get("/api", (req,res)=>{
    todos.find()
    .then((data)=>{
        // res.render("index", {data : data})
        res.status(400).json({ message:"Api hit successfully.", data:data});
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.post("/api", (req,res)=>{
    todos.create({
        name: req.body.name
    })
    .then(()=>{
        // res.redirect("/")
        res.status(200).json({message: "Stored Successfully!"})
    })
    .catch((err)=>{
        // console.log(err)
        res.status(400).json({error: err})
    })
})

//update

app.put("/api/update/:id", (req,res)=>{
    todos.findByIdAndUpdate((req.params.id), {
        name: req.body.name
         })
    .then(()=>{
        // res.redirect("/")
        res.status(200).json({ message: "Updated Successfully!"})
    })
    .catch((err)=>{
        // console.log(err)
        res.status(400).json({error: err})
    })
})

//delete
app.delete("/api/delete/:id", (req,res)=>{
    todos.findByIdAndDelete(req.params.id)
    .then(()=>{
        // res.redirect("/")
        res.status(200).json({ message: "Deleted Successfully"})
    })
    .catch((err)=>{
        res.status(400).json({error : err})
    })
})

//appRoute

app.get("/", (req,res)=>{
    todos.find()
    .then((data)=>{
        res.render("index", {data : data})
       })
    .catch((err)=>{
        console.log(err)
    })
})

app.post("/", (req,res)=>{
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
app.get("/update/:id", (req,res)=>{
    todos.findById(req.params.id)
    .then((data)=>{
        res.render("update", {updateTask : data})
    })
    .catch((err=>{
        console.log(err)
    }))
})

app.put("/update/:id", (req,res)=>{
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
app.delete("/delete/:id", (req,res)=>{
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