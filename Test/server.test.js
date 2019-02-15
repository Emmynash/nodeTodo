const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server/server');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user')
const { populateTodos, todos, users, populateUsers } = require('./seed/seed');


console.log(todos.length);

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should send a post request', (done) => {

        let text = "testing post request"

        request(app)
            .post('/todos')
            .send({ text })
            .set({ 'x-auth': users[0].tokens[0].token })
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
            .set({ 'x-auth': users[0].tokens[0].token })
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
            .set({ 'x-auth': users[0].tokens[0].token })
            .expect(200)
            .expect((res) => {
                expect(todos.length).toBe(2)
                console.log(JSON.stringify(res.body, undefined, 2));
            })
            .end(done)
    })
})

describe('GET todos/:id routes', () => {
        it('Should return a todo', (done) => {
            let hexId = todos[0]._id.toHexString();
            request(app)
                .get(`/todos/${hexId}`)
                .set({ 'x-auth': users[0].tokens[0].token })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });
        it('Should not return todo created by other user', (done) => {
            request(app)
                .get(`/todos/${todos[1]._id.toHexString()}`)
                .set({ 'x-auth': users[0].tokens[0].token })
                .expect(404)
                .end(done);
        });
        it("Should return a 404 if todo not found", (done) => {
            request(app)
                .get(`/todos/${new ObjectID().toHexString()}`)
                .set({ 'x-auth': users[0].tokens[0].token })
                .expect(404)
                .end(done)
        });
        it("Should return 404 for non object id", (done) => {
            request(app)
                .get('/todos/234781')
                .set({ 'x-auth': users[0].tokens[0].token })
                .expect(404)
                .end(done)
        });
    }) /

    describe('DELETE Todos/:id', () => {
        let hexId = todos[0]._id.toHexString();

        it("Should delete a todo", (done) => {
            // let reqId = req.params.id;
            request(app)
                .delete(`/todos/${hexId}`)
                .set({ 'x-auth': users[0].tokens[0].token })
                .expect(200)
                .expect((res) => {
                    console.log(res.body.todo._id);
                    expect((res.body.todo._id).toString()).toBe(hexId);
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
        it("Should not delete todo created by other users", (done) => {
            // let reqId = req.params.id;
            request(app)
                .delete(`/todos/${hexId}`)
                .set({ 'x-auth': users[1].tokens[0].token })
                .expect(404)
                .end(done)
        })
        it("Should return a 404 (200)if todo not found", (done) => {
            request(app)
                .delete(`/todos/${hexId}`)
                .set({ 'x-auth': users[0].tokens[0].token })
                .expect(200)
                .end(done)
        });
        it("Should return 400 for non object id", (done) => {
            request(app)
                .delete('/todos/234781')
                .set({ 'x-auth': users[0].tokens[0].token })
                .expect(400)
                .end(done)
        });

    })

describe("PATCH todos/:id", () => {
    it("Should update todos", (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .set({ 'x-auth': users[0].tokens[0].token })
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

    it("Should not update todo created by other users", (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .set({ 'x-auth': users[1].tokens[0].token })
            .expect(404)
            .end(done)

    })

    it("Should update todo", (done) => {
        let hexId = todos[0]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .set({ 'x-auth': users[0].tokens[0].token })
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

    it("Should return 400 for non object id", (done) => {
        request(app)
            .patch('/todos/234781yij')
            .set({ 'x-auth': users[1].tokens[0].token })
            .expect(400)
            .end(done)
    });
})

describe("GET /users/me", () => {
    it("should GET a valid user", (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
                expect(res.body._id).toBe(users[0]._id.toHexString());
            })
            .end(done);
    })

    it("Should return 401 for an invalid user", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })
})

describe("POST /users", () => {
    it("Should create user with valid details", (done) => {
        var email = "newuser@email.com";
        var password = "newuser1";
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }

                User.find({ email })
                    .then((res) => {
                        expect(res).toExist();
                        expect(res.length).toBe(1);
                        expect(res[0].email).toBe(email);
                        expect(res[0].password).toNotEqual(password)
                        return done();
                    })
                    .catch((err) => done(err));
            })
    })

    it("Should return validation errors", (done) => {
        request(app)
            .post('/users')
            .send({ email: "meAlone", password: "Alone" })
            .expect(400)
            .end((err) => {
                if (err) {
                    return done(err)
                }

                User.find()
                    .then((res) => {
                        expect(res.length).toBe(2);
                        return done();
                    })
                    .catch((err) => done(err));
            })
    })

    it("Should not create users if email exist", (done) => {
        request(app)
            .post('/users')
            .send({ email: "valid@user.com", password: "newuser1" })
            .expect(400)
            .end(done);
    })
})

describe("POST /users/login", () => {
    it("Should login  user with valid credentials", (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((result) => {
                        // console.log(res.headers['x-auth']);
                        expect(result.tokens[0].access).toInclude('auth');
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            })

    })
    it("Should reject invalid login", (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: users[0].password + "45"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((result) => {
                        console.log(result.tokens);
                        expect(result.tokens.length).toBe(1);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            })
    })
})

describe("DELETE user/me/token", () => {
    it("Should logout a valid user", (done) => {
        request(app)
            .delete('/users/me/token')
            .set({ 'x-auth': users[0].tokens[0].token })
            .expect(200)
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.findById(users[0]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0)
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })

            })

    })
})