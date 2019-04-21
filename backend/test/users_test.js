const request = require('supertest');
const app = require('../server.js');
const { User } = require('../models/user');
const assert = require('assert');

describe('/api/v1/users', () => {
    describe('POST', () => {
        it('should respond with 200 for a valid request', (done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "test@test.com",
                    password: "testing",
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    // console.log(res);
                    assert(res.status, 200);
                    done();                    
                });
        });

        it('should have created a new user with a valid request', (done) => {
            User.countDocuments().then((count) => {
                request(app)
                    .post('/api/v1/users')
                    .send({
                        email: "test@test.com",
                        password: "testing",
                        firstName: "Test",
                        lastName: "Tester"
                    })
                    .end((err, res) => {
                        User.countDocuments().then((newCount) => {
                            assert(count === newCount - 1);
                            done();
                        });
                    });
            });;
        });

        it('should not create a new user with invalid request', (done) => {
            User.countDocuments().then(count => {
                request(app)
                    .post('/api/v1/users')
                    .send({
                        email: "test@test.com",
                        //password missing
                        firstName: "Test",
                        lastName: "Tester"
                    })
                    .end((err, res) => {
                        User.countDocuments().then(newCount => {
                            assert(count === newCount);
                            done();
                        })
                    });
            });
        });

        it('should respond with status 400 for an invalid request', (done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "test@test.com",
                    //password missing
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    assert(res.status, 400);
                    done();
                });
        });

        it('should not create a user when using a already registered email', (done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "test@test.com",
                    password: "testing",
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end(() => {
                    User.countDocuments().then(count => {
                        request(app)
                            .post('/api/v1/users')
                            .send({
                                email: "test@test.com",
                                password: "testing",
                                firstName: "Test",
                                lastName: "Tester"
                            })
                            .end((err, res) => {
                                User.countDocuments().then(newCount => {
                                    assert(count === newCount);
                                    done();
                                })
                            });
                    });
                });
        });

        it('should respond with status 400 when using an already registered email', (done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "test@test.com",
                    password: "testing",
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end(() => {
                    request(app)
                        .post('/api/v1/users')
                        .send({
                            email: "test@test.com",
                            password: "testing",
                            firstName: "Test",
                            lastName: "Tester"
                        })
                        .end((err, res) => {
                            assert(res.status, 400);
                            done();
                        });
                });
        });
    });

    describe('Authenticate', () => {
        //Before create user
        before((done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "auth@test.com",
                    password: "testing",
                    firstName: "Auth",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    console.log('status: ' + res.status);
                    console.log(res.body);
                    if(res.status === 200) done();
                });
        });

        //Valid request
        it('should respond with status 200 for a valid request', (done) => {
            request(app)
                .post('/api/v1/users/authenticate')
                .send({
                    username: "auth@test.com",
                    password: "testing"
                })
                .end((err, res) => {
                    assert(res.status, 200);
                    done();
                })
        })

        //Incorrect password
        //Incorrect email

        //Missing fields
    });

    describe('GET', () => {
        //Getall Valid request

    });
});