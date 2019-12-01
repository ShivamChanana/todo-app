const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    name: {
        type : String,
       
    }
})

const todos = mongoose.model("todolist", todoSchema)

module.exports = todos