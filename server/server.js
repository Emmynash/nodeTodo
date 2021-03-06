require('./config/config');
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

app.post('/todos', authenticate, (req, res) => {
    // console.log(req.body);
    let todo = new Todo({
        text: req.body.text,
        _author: req.user._id
    })


    todo.save().then((result) => {
        res.send(result);
    }, (error) => {
        res.status(400).send(error);
    })
})

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
            _author: req.user._id
        })
        .then((doc) => {
            res.send(doc);
        }, (err) => {
            res.status(400).send(err)
        })
})
app.get('/todos/:id', authenticate, async(req, res) => {

    try {
        id = req.params.id;
        if (!ObjectID.isValid(id)) {
            res.status(404).send();
        }

        const todo = await Todo.findOne({
            _id: id,
            _author: req.user._id
        });

        if (!todo) {
            return res.status(404).send()
        }
        res.send({ todo });

    } catch (error) {
        res.status(400).send()
    }

})

app.delete('/todos/:id', authenticate, (req, res) => {
    id = req.params.id;
    if (!ObjectID.isValid) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
            _id: id,
            _author: req.user._id
        })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send()
            }
            res.send({ todo })
        })
        .catch((error) => res.status(400).send());
})

app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({
            _id: id,
            _author: req.user._id,
        }, { $set: body }, { new: true })
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

app.post('/users', async(req, res) => {
    // let body = _.pick(req.body, ['email', 'password'])
    // let user = new User(body)

    // try {
    //     await user.save();
    //     const token = await user.generateAuthToken();
    //     res.header('x-auth', token).send(user);
    // } catch (error) {
    //     res.status(400).send(err);
    // }

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

// Post users/login
app.post('/users/login', async(req, res) => {
    try {
        let body = _.pick(req.body, ['email', 'password'])
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/users/me/token', authenticate, async(req, res) => {

    try {
        await req.user.removeToken(req.token)
        res.status(200).send()
    } catch (error) {
        res.status(400).send();
    }

})


app.listen(port, (error) => {
    if (error) {
        return console.log(`server unable to start, ${error}`);
    }

    console.log(`server running on port: ${port}`);
})

module.exports.app = app;