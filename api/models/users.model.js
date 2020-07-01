const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const category = new Schema({
    username: { type: String, default: null  },
    email: { type: String, default: null  },
    phone: { type: Number, default: null  },
    watsapp: { type: Number, default: null  },
    password: { type: String, default: null  },
    otp:{ type: String, default: null  },
}, { timestamps: true });

module.exports = mongoose.model("user", category);