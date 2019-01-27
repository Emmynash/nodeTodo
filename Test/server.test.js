const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server/server');
const { Todo } = require('./../server/models/todo');

const todos = [{
        _id: new ObjectID(),
        text: "We are testing"
    },
    {
        _id: new ObjectID(),
        text: "Silence is golden"
    }
];

console.log(todos.length);

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
})

describe('POST /todos', () => {
    it('should send a post request', (done) => {
        let text = "testing post request"

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text })
                    .then((res) => {
                        expect(res.length).toBe(1);
                        expect(res[0].text).toBe(text)
                        return done();
                    })
                    .catch((err) => {
                        if (err) {
                            return done(err);
                        }
                    })
            });


    });

    it("should not create Todo with invalid body data", (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })

        Todo.find()
            .then((res) => {
                expect(res.length).toBe(2);
                done();
            })
            .catch((err) => {
                if (err) {
                    return done(err);
                }
            })
    })

    it("should GET all todos", (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(todos.length).toBe(2)
                console.log(JSON.stringify(res.body, undefined, 2));
            })
            .end(done)
    })
})

describe('GET todos/:id routes', () => {
    it('Should return todo body', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it("Should return a 404 if todo not found", (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });
    it("Should return 404 for non object id", (done) => {
        request(app)
            .get('/todos/234781')
            .expect(404)
            .end(done)
    });
})

describe('DELETE Todos/:id', () => {

    it.only("Should delete a todo", (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                console.log(res.body.todo);
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById({ hexId })
                    .then((res) => {
                        expect(res).toNotExist()
                        done();
                    }).catch((err) => done(err));
            })
    })
    it("Should return a 404 if todo not found", (done) => {
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    });
    it("Should return 404 for non object id", (done) => {
        request(app)
            .delete('/todos/234781')
            .expect(404)
            .end(done)
    });

})

describe("PATCH todos/:id", () => {
    it.only("Should updated todos", (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.findByIdAndUpdate(hexId, {
                        $set: {
                            complete: true,
                            text: "We survive"
                        }
                    }, { new: true })
                    .then((res) => {
                        if (!res) {
                            res.status(404).send();
                        }
                        expect(res).toExist();
                        done();
                    })
                    .catch((err) => done(err));
            })

    })

    it.only("Should update todo", (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .expect(200)
            .send({
                text: "Todo Patch",
                complete: true
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe("Todo Patch");
                expect(res.body.todo.complete).toBe(true);
                expect(res.body.todo.completedat).toBeA('number');

            })
            .end((err) => done(err))

    })

    it("Should return 404 for non object id", (done) => {
        request(app)
            .patch('/todos/234781')
            .expect(404)
            .end(done)
    });
})