const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('./../../server/models/todo');
const { User } = require('./../../server/models/user');

const validUserId = new ObjectID();
const invalidUserId = new ObjectID();

const users = [{
        _id: validUserId,
        email: "valid@user.com",
        password: "validuser",
        tokens: [{
            access: "auth",
            token: jwt.sign({ _id: validUserId, access: "auth" }, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: invalidUserId,
        email: "invalid@user.com",
        password: "invaliduser",
        tokens: [{
            access: "auth",
            token: jwt.sign({ _id: invalidUserId, access: "auth" }, process.env.JWT_SECRET).toString()
        }]
    }
]

const todos = [{
        _id: new ObjectID(),
        text: "We are testing",
        _author: validUserId
    },
    {
        _id: new ObjectID(),
        text: "Silence is golden",
        _author: invalidUserId
    }
];

const populateTodos = function(done) {
    this.timeout(0);
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
}

const populateUsers = function(done) {
    this.timeout(0);
    User.deleteMany({})
        .then(() => {
            var validUser = new User(users[0]).save();
            var invaliduser = new User(users[1]).save();

            return Promise.all([validUser, invalidUserId]);
        })
        .then(() => done());

}

module.exports = { populateTodos, todos, users, populateUsers };