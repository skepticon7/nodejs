const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    Username:String,
    Name:String,
    Tasks:[String]
});

const Todo = mongoose.model("Todo" , TodoSchema);

module.exports = Todo;