const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 5,
        unique: true,
        validate: {
            validator: (value) => {
                validator: validator.isEmail
            },

            message: `{VALUE} is not a valid email`
        }
    },

    password: {
        required: true,
        type: String,
        minlength: 8
    },
    tokens: [{
        access: {
            required: true,
            type: String
        },
        token: {
            required: true,
            type: String
        }
    }]
})

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['email', '_id']);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = "auth";
    var token = jwt.sign({ _id: user._id.toHexString(), access }, "R00tq26").toString();

    user.tokens.push({ access, token });

    return user.save()
        .then(() => {
            return token;
        })
        .catch((err) => console.log(err));
}

let User = mongoose.model("User", UserSchema)

module.exports = { User };