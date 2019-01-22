const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

id = "8c3f192452799308b826765d"

if (!ObjectID.isValid(id)) {
    console.log('invalid object ID');
}

Todo.remove({})
    .then((res) => {
        console.log(res);
    })