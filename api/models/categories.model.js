const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const category = new Schema({
    category: { type: String, default: null  },
}, { timestamps: true });

module.exports = mongoose.model("Category", category);