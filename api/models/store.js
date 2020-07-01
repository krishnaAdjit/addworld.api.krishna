const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Store = new Schema({
    name: { type: String, default: null  },
    email: { type: String, default: null  },
    password: { type: String, default: null  },
    banner_image: { type: String, default: null  },
    store_name: { type: String, default: null  },
    street_address: { type: String, default: null  },
    category: { type: String, default: null  },
    state: { type: String, default: null  },
    zip: { type: String, default: null  },
    city: { type: String, default: null  },
    country: { type: String, default: null  },
    phone: { type: String, default: null  },
    watsapp: { type: String, default: null  },
    founded: Date,
    slogan: { type: String, default: null  },
    website_url: { type: String, default: null  },
    gallery: Array,
    otp: { type: String, default: null  },
    reviews: Number
}, { timestamps: true })

module.exports = mongoose.model('Store', Store)