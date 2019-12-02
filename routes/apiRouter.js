const express = require("express")
const route = express.Router()
const todos = require("../models/Todos")

route.get("/api", (req,res)=>{
    todos.find()
    .then((data)=>{
        // res.render("index", {data : data})
        res.status(400).json({ message:"Api hit successfully.", data:data});
    })
    .catch((err)=>{
        console.log(err)
    })
})

route.post("/api", (req,res)=>{
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

route.put("/api/update/:id", (req,res)=>{
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
route.delete("/api/delete/:id", (req,res)=>{
    todos.findByIdAndDelete(req.params.id)
    .then(()=>{
        // res.redirect("/")
        res.status(200).json({ message: "Deleted Successfully"})
    })
    .catch((err)=>{
        res.status(400).json({error : err})
    })
})

module.exports = route