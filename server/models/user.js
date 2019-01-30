const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, "R00tq26")
    } catch (error) {
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    })

}

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                console.log(hash);
                user.password = hash;
                next();
            })
        })

    } else {
        next();
    }
})

let User = mongoose.model("User", UserSchema)

module.exports = { User };