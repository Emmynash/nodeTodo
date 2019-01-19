const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server/server');
const { Todo } = require('./../server/models/todo');

beforeEach((done) => {
    Todo.deleteMany({}).then(() => done());
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

                Todo.find()
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
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })

        Todo.find()
            .then((res) => {
                expect(res.length).toBe(0);
                done();
            })
            .catch((err) => {
                if (err) {
                    return done(err);
                }
            })
    })
})