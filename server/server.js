const { mongoose } = require('./db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const app = express();

const port = 3000;

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


app.listen(port, (error) => {
    if (error) {
        return console.log(`server unable to start, ${error}`);
    }

    console.log(`server running on port: ${port}`);
})

module.exports.app = app;