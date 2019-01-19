const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/TodoAPI"

mongoose.Promise = global.Promise;

mongoose.connect(url, option = { useNewUrlParser: true });

module.exports = { mongoose };