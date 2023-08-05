const mongoose = require('mongoose')


// creating a schema 
let schema = new mongoose.Schema({
  taskName: {
    type: String,
    // required:true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("tasks", schema)