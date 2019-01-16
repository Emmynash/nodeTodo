const mongoose = require('mongoose');

let User = mongoose.model("User", {
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 5
    }
})

module.exports = { User };