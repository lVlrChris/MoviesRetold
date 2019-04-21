const request = require('supertest');
const app = require('../server.js');
const { User } = require('../models/user.js');
const assert = require('assert');

describe('/api/v1/movies', () => {
    const testEmail = 'movies@test.com';
    const testPW = 'testing';
    let apiKey;

    //Register test user
    before((done) => {
        request(app)
            .post('/api/v1/users')
            .send({
                email: testEmail,
                password: testPW,
                firstName: "Test",
                lastName: "Tester"
            })
            .end((err, res) => {
                //Authenticate test user
                request(app)
                    .post('/api/v1/users/authenticate')
                    .send({
                        email: testEmail,
                        password: testPW
                    })
                    .end((err, res) => {
                        apiKey = res.body.token;
                        done();
                    })

            })
    });


    describe('CREATE', () => {
        it('should respond with 200 for a valid request', (done) => {
            request(app)
                .post('/api/v1/movies')
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    title: "Test Title",
                    description: "This is the movie description",
                    duration: 11,
                    sliceDuration: 2
                })
                .end((err, res) => {
                    assert(res.status, 200);
                    done();
                })
        });
    });
});