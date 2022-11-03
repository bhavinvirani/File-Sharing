const mongoose = require("mongoose")

const File = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  type:{
    type: String,
    require: true
  },
  password: String,
  downloadCount: {
    type: Number,
    required: true, 
    default: 0,
  },
  size: {
    type: String,
    required: true, 
    default: 0,
  },
}, 
{
    timestamps: true
})

module.exports = mongoose.model("File", File) 