const env = process.env.NODE_ENV || "development";

// console.log(`env ********, ${env}`);

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAPI";
} else if (env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAPITest";
}



const _ = require('lodash');
const { mongoose } = require('./db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./Middleware/authenticate');
const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    })


    todo.save().then((result) => {
        res.send(result);
    }, (error) => {
        res.status(400).send(error);
    })
})

app.get('/todos', (req, res) => {
    Todo.find()
        .then((doc) => {
            res.send(doc);
        }, (err) => {
            res.status(400).send(err)
        })
})
app.get('/todos/:id', (req, res) => {
    id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send()
            }
            res.send({ todo });
        })
        .catch((err) => res.status(400).send());
})

app.delete('/todos/:id', (req, res) => {
    id = req.params.id;
    if (!ObjectID.isValid) {
        return res.status(404).send();
    }

    Todo.findByIdAndDelete(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send()
            }
            res.send({ todo })
        })
        .catch((error) => res.status(400).send());
})

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['text', 'complete']);

    if (!ObjectID.isValid) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.complete) && body.complete) {
        body.completedat = new Date().getTime();
    } else {
        body.complete = false;
        body.completedat = null;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo })
        })
        .catch((err) => {
            res.status(400).send();
        })
})

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password'])
    let user = new User(body)
    user.save()
        .then((user) => {
            return user.generateAuthToken();
            // res.send(result);
        })
        .then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
            console.log(err);
        });
});


// middleware for authentication


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
}, ((e) => console.log(e)));


app.listen(port, (error) => {
    if (error) {
        return console.log(`server unable to start, ${error}`);
    }

    console.log(`server running on port: ${port}`);
})

module.exports.app = app;