const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

id = "8c3f192452799308b826765d"

if (!ObjectID.isValid(id)) {
    console.log('invalid object ID');
}

// Todo.find({
//         _id: id
//     })
//     .then((todos) => {
//         console.log(`allTodos: ${todos}`);
//     });

// Todo.findOne({
//         _id: id
//     })
//     .then((todo) => {
//         console.log(`todo: ${todo}`);
//     })
// Todo.findById({
//         _id: id
//     })
//     .then((todo) => {
//         if (!todo) {
//             return console.log('invalid todo id');
//         }
//         console.log(`todoById: ${todo}`);
//     }).catch((error) => console.log(error));

User.find({
        _id: id
    })
    .then((users) => {
        console.log(`allUsers: ${users}`);
    });

User.findOne({
        email: "root"
    })
    .then((user) => {
        console.log(`user: ${user}`);
    })
User.findById({
        _id: id
    })
    .then((user) => {
        if (!user) {
            return console.log('invalid todo id');
        }
        console.log(`userById: ${user}`);
    }).catch((error) => console.log(error));