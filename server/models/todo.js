const mongoose = require('mongoose');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    completedat: {
        type: Number,
        default: null
    },
    complete: {
        type: Boolean,
        default: false
    }
});

module.exports = { Todo };