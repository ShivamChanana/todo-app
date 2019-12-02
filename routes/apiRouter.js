const express = require("express")
const router = express.Router()
// const app = express()
const todos = require("../models/Todos")


router.get("/", (req,res)=>{
    todos.find({})
    .then((data)=>{
        // res.render("index", {data : data})
        res.status(200).json({ message:"Api hit successfully.", data:data})
        // console.log(data)
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.post("/", (req,res)=>{
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

router.put("/update/:id", (req,res)=>{
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
router.delete("/delete/:id", (req,res)=>{
    todos.findByIdAndDelete(req.params.id)
    .then(()=>{
        // res.redirect("/")
        res.status(200).json({ message: "Deleted Successfully"})
    })
    .catch((err)=>{
        res.status(400).json({error : err})
    })
})

module.exports = router