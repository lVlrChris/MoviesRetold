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
        testEmail = "auth@test.com";
        testPW = "testing";

        //Before create user
        beforeEach((done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    password: testPW,
                    firstName: "Auth",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    if(res.status === 201) done();
                });
        });

        //Valid request
        it('should respond with status 200 for a valid request', (done) => {
            request(app)
                .post('/api/v1/users/authenticate')
                .send({
                    email: testEmail,
                    password: testPW
                })
                .end((err, res) => {
                    assert(res.status, 200);
                    done();
                })
        })

        it('should contain a key in response with valid request', (done) => {
            request(app)
                .post('/api/v1/users/authenticate')
                .send({
                    email: testEmail,
                    password: testPW
                })
                .end((err, res) => {
                    assert(res.body.token);
                    done();
                })
        })

        //Incorrect password
        it('should respond with 401 when using an incorrect password', (done) => {
            request(app)
                .post('/api/v1/users/authenticate')
                .send({
                    email: testEmail,
                    password: "wrongpassword"
                })
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    assert(!res.body.token);
                    done();
                });
        });

        //Incorrect email
        it('should respond with 404 when using an incorrect username', (done) => {
            request(app)
                .post('/api/v1/users/authenticate')
                .send({
                    email: "wrong@test.com",
                    password: testPW
                })
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    assert(!res.body.token);
                    done();
                });
        });

        //Missing fields
        it('should respond with 404 with missing email field', (done) => {
            request(app)
                .post('/api/v1/users/authenticate')
                .send({
                    password: testPW
                })
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    assert(!res.body.token);
                    done();
                });
        })

        it('should respond with 403 with missing password field', (done) => {
            request(app)
                .post('/api/v1/users/authenticate')
                .send({
                    email: testEmail
                })
                .end((err, res) => {
                    assert.equal(res.status, 403);
                    assert(!res.body.token);
                    done();
                });
        })
    });

    describe('GET', () => {
        //BeforeEach register and authenticate user.
        let userId;
        let apiKey;
        beforeEach((done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "test@test.com",
                    password: "testing",
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    userId = res.body.result._id;
                    if(res.status === 201) {
                        request(app)
                            .post('/api/v1/users/authenticate')
                            .send({
                                email: "test@test.com",
                                password: "testing"
                            })
                            .end((err, res) => {
                                if(res.status === 200) {
                                    apiKey = res.body.token;
                                    done();
                                }
                            });
                    }
                });
        });

        //Getall Valid request
        it('should respond with 200 for a valid request', (done) => {
            request(app)
                .get('/api/v1/users')
                .set('Authorization', "Bearer " + apiKey)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        //Getall unauthorized request
        it('should respond with 401 for an unauthorized request', (done) => {
            request(app)
                .get('/api/v1/users')
                .set('Authorization', 'Bearer ' + 'wrongkey')
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    done();
                });
        });

        it('should respond with 401 for an unauthorized request', (done) => {
            request(app)
                .get('/api/v1/users')
                //Missing API key
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    done();
                });
        });

        //Get valid request
        it('should respond with 200 for a valid request', (done) => {
            request(app)
                .get('/api/v1/users/' + userId)
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        //Get invalid id
        it('should respond with 404 when providing an invalid id', (done) => {
            request(app)
                .get('/api/v1/users/' + '12345')
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    done();
                });
        });
    });

    describe('PUT', () => {
        //BeforeEach create user
        let userId;
        let apiKey;
        beforeEach((done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "test@test.com",
                    password: "testing",
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    if (res.status === 201) {
                        userId = res.body.result._id;

                        request(app)
                            .post('/api/v1/users/authenticate')
                            .send({
                                email: "test@test.com",
                                password: "testing"
                            })
                            .end((err, res) => {
                                apiKey = res.body.token;
                                done();
                            })
                    }
                })
        })

        //Valid request
        it('should have changed the User for a valid request', (done) => {
            request(app)
                .put('/api/v1/users/' + userId)
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    email: "new@test.com",
                    password: "testing",
                    firstName: "Test123",
                    lastName: "Tester123"
                })
                .end((err, res) => {
                    User.findById(userId).then((result) => {
                        assert.equal(result.email, 'new@test.com');
                        assert.equal(result.firstName, 'Test123');
                        assert.equal(result.lastName, 'Tester123');
                        done();
                    });
                });
        });

        it('should respond with 200 for a valid request', (done) => {
            request(app)
            .put('/api/v1/users/' + userId)
            .set('Authorization', 'Bearer ' + apiKey)
            .send({
                email: "new@test.com",
                password: "testing",
                firstName: "Test123",
                lastName: "Tester123"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
        });
            
        //Invalid id
        it('should respond with 404 for an invalid Id', (done) => {
            request(app)
            .put('/api/v1/users/' + '12345')
            .set('Authorization', 'Bearer ' + apiKey)
            .send({
                email: "new@test.com",
                password: "testing",
                firstName: "Test123",
                lastName: "Tester123"
            })
            .end((err, res) => {
                assert.equal(res.status, 404);
                done();
            });
        });

        //Missing fields
        it('should respond with 403 for an invalid body', (done) => {
            request(app)
            .put('/api/v1/users/' + userId)
            .set('Authorization', 'Bearer ' + apiKey)
            .send({
                email: "new@test.com",
                //password missing
                firstName: "Test123",
                lastName: "Tester123"
            })
            .end((err, res) => {
                assert.equal(res.status, 403);
                done();
            });
        });

        it('should respond with 403 for an invalid body', (done) => {
            request(app)
            .put('/api/v1/users/' + userId)
            .set('Authorization', 'Bearer ' + apiKey)
            .send({
                //email missing
                password: "testing",
                firstName: "Test123",
                lastName: "Tester123"
            })
            .end((err, res) => {
                assert.equal(res.status, 403);
                done();
            });
        });

        it('should respond with 403 for an invalid body', (done) => {
            request(app)
            .put('/api/v1/users/' + userId)
            .set('Authorization', 'Bearer ' + apiKey)
            .send({
                email: "new@test.com",
                password: "testing",
                //firstName missing
                lastName: "Tester123"
            })
            .end((err, res) => {
                assert.equal(res.status, 403);
                done();
            });
        });

        it('should respond with 403 for an invalid body', (done) => {
            request(app)
            .put('/api/v1/users/' + userId)
            .set('Authorization', 'Bearer ' + apiKey)
            .send({
                email: "new@test.com",
                password: "testing",
                firstName: "Test123"
                //lastName missing
            })
            .end((err, res) => {
                assert.equal(res.status, 403);
                done();
            });
        });
    });

    describe('DELETE', () => {
        //Create user to delete
        let userId;
        let apiKey;
        beforeEach((done) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: "test@test.com",
                    password: "testing",
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    if (res.status === 201) {
                        userId = res.body.result._id;

                        request(app)
                            .post('/api/v1/users/authenticate')
                            .send({
                                email: "test@test.com",
                                password: "testing"
                            })
                            .end((err, res) => {
                                apiKey = res.body.token;
                                done();
                            });
                    }
                });
        });

        //Valid request
        it('should delete the User for a valid request', (done) => {
            User.countDocuments().then(count => {
                request(app)
                .delete('/api/v1/users/' + userId)
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    User.countDocuments().then(newCount => {
                        assert(newCount === count - 1);
                        done();
                    });
                });
            });
        });

        it('should respond with 200 for a valid request', (done) => {
            request(app)
                .delete('/api/v1/users/' + userId)
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
        });       
        
        //Unauthorized request
        it('should not delete the user with an unauthorized request', (done) => {
            User.countDocuments().then(count => {
                request(app)
                .delete('/api/v1/users/' + userId)
                .set('Authorization', 'Bearer ' + '12345')
                .end((err, res) => {
                    User.countDocuments().then(newCount => {
                        assert(newCount === count);
                        done();
                    });
                });
            });
        });

        it('should respond with 401 for a unauthorized request', (done) => {
            request(app)
                .delete('/api/v1/users/' + userId)
                .set('Authorization', 'Bearer ' + '12345')
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    done();
                });
        });   

        //Invalid id
        it('should not delete the user with an invalid id', (done) => {
            User.countDocuments().then(count => {
                request(app)
                .delete('/api/v1/users/' + '12345')
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    User.countDocuments().then(newCount => {
                        assert(newCount === count);
                        done();
                    });
                });
            });
        });

        it('should respond with 404 for a invalid id', (done) => {
            request(app)
                .delete('/api/v1/users/' + '12345')
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    done();
                });
        }); 

    });
});