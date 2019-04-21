const request = require('supertest');
const app = require('../server.js');
const { Movie } = require('../models/movie.js');
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
        //Valid request
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

        it('should have created a new Movie for a valid request', (done) => {
            Movie.countDocuments().then(count => {
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
                        Movie.countDocuments().then(newCount => {
                            assert(count === newCount - 1);
                            done();
                        })
                    });
            });
        });

        //Unauthorized request
        it('should respond with 401 for an unauthorized request', (done) => {
            request(app)
                .post('/api/v1/movies')
                .set('Authorization', 'Bearer ' + '12345')
                .send({
                    title: "Test Title",
                    description: "This is the movie description",
                    duration: 11,
                    sliceDuration: 2
                })
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    done();
                });
        });

        it('should not create a Movie for an unauthorized request', (done) => {
            Movie.countDocuments().then(count => {
                request(app)
                    .post('/api/v1/movies')
                    .set('Authorization', 'Bearer ' + '12345')
                    .send({
                        title: "Test Title",
                        description: "This is the movie description",
                        duration: 11,
                        sliceDuration: 2
                    })
                    .end((err, res) => {
                        Movie.countDocuments().then(newCount => {
                            assert(count === newCount);
                            done();
                        })
                    });
            });
        });

        //Missing fields
        it('should respond with 403 for an missing title in a request', (done) => {
            request(app)
                .post('/api/v1/movies')
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    //Missing title
                    description: "This is the movie description",
                    duration: 11,
                    sliceDuration: 2
                })
                .end((err, res) => {
                    assert.equal(res.status, 403);
                    done();
                });
        });

        it('should not create a Movie for an missing title in a request', (done) => {
            Movie.countDocuments().then(count => {
                request(app)
                    .post('/api/v1/movies')
                    .set('Authorization', 'Bearer ' + apiKey)
                    .send({
                        //Missing title
                        description: "This is the movie description",
                        duration: 11,
                        sliceDuration: 2
                    })
                    .end((err, res) => {
                        Movie.countDocuments().then(newCount => {
                            assert(count === newCount);
                            done();
                        });
                    });
            });
        });

        it('should respond with 403 for an missing duration in a request', (done) => {
            request(app)
                .post('/api/v1/movies')
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    title: "Test Title",
                    description: "This is the movie description",
                    //Missing duration
                    sliceDuration: 2
                })
                .end((err, res) => {
                    assert.equal(res.status, 403);
                    done();
                });
        });

        it('should not create a Movie for an missing duration in a request', (done) => {
            Movie.countDocuments().then(count => {
                request(app)
                    .post('/api/v1/movies')
                    .set('Authorization', 'Bearer ' + apiKey)
                    .send({
                        title: "Test Title",
                        description: "This is the movie description",
                        //Missing duration
                        sliceDuration: 2
                    })
                    .end((err, res) => {
                        Movie.countDocuments().then(newCount => {
                            assert(count === newCount);
                            done();
                        });
                    });
            });
        });

        it('should respond with 403 for an missing sliceDuration in a request', (done) => {
            request(app)
                .post('/api/v1/movies')
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    title: "Test Title",
                    description: "This is the movie description",
                    duration: 11
                    //Missing sliceDuration
                })
                .end((err, res) => {
                    assert.equal(res.status, 403);
                    done();
                });
        });

        it('should not create a Movie for an missing sliceduration in a request', (done) => {
            Movie.countDocuments().then(count => {
                request(app)
                    .post('/api/v1/movies')
                    .set('Authorization', 'Bearer ' + apiKey)
                    .send({
                        title: "Test Title",
                        description: "This is the movie description",
                        duration: 11
                        //Missing sliceDuration
                    })
                    .end((err, res) => {
                        Movie.countDocuments().then(newCount => {
                            assert(count === newCount);
                            done();
                        });
                    });
            });
        });

        //Duplicate title
        it('should respond with status 403 when using a duplicate title', (done) => {
            const duplicateTitle = 'Test Title';
            request(app)
                .post('/api/v1/movies')
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    title: duplicateTitle,
                    description: "This is a description",
                    duration: 11,
                    sliceDuration: 2
                })
                .end((err, res) => {
                    request(app)
                        .post('/api/v1/movies')
                        .set('Authorization', 'Bearer ' + apiKey)
                        .send({
                            title: duplicateTitle,
                            description: "This is a description",
                            duration: 11,
                            sliceDuration: 2
                        })
                        .end((err, res) => {
                            assert.equal(res.status, 403);
                            done();
                        });
                });
        });

        it('should not create a new movie when using a duplicate title', (done) => {
            const duplicateTitle = 'Test Title';
            request(app)
                .post('/api/v1/movies')
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    title: duplicateTitle,
                    description: "This is a description",
                    duration: 11,
                    sliceDuration: 2
                })
                .end((err, res) => {
                    Movie.countDocuments().then(count => {
                        request(app)
                            .post('/api/v1/movies')
                            .set('Authorization', 'Bearer ' + apiKey)
                            .send({
                                title: duplicateTitle,
                                description: "This is a description",
                                duration: 11,
                                sliceDuration: 2
                            })
                            .end((err, res) => {
                                Movie.countDocuments().then(newCount => {
                                    assert(count === newCount);
                                    done();
                                })
                            });
                    });
                });
        });
    });

    describe('GET', () => {
        //Getall valid request
        it('should respond with status 200 for a valid request', (done) => {
            request(app)
                .get('/api/v1/movies')
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        describe('Pagination', () => {
            //Create multiple movies for pagination
            beforeEach((done) => {
                Promise.all([
                    request(app).post('/api/v1/movies').set('Authorization', 'Bearer ' + apiKey).send({
                        title: "Test Title 1",
                        duration: 11,
                        sliceDuration: 2
                    }),
                    request(app).post('/api/v1/movies').set('Authorization', 'Bearer ' + apiKey).send({
                        title: "Test Title 2",
                        duration: 11,
                        sliceDuration: 2
                    }),
                    request(app).post('/api/v1/movies').set('Authorization', 'Bearer ' + apiKey).send({
                        title: "Test Title 3",
                        duration: 11,
                        sliceDuration: 2
                    }),
                    request(app).post('/api/v1/movies').set('Authorization', 'Bearer ' + apiKey).send({
                        title: "Test Title 4",
                        duration: 11,
                        sliceDuration: 2
                    })
                ]).then(() => done());
            });

            //Getall with correct pagination
            const testPageSize = 2;
            const testPage = 1;
            it('should respond with the correct amount of movies', (done) => {
                request(app)
                    .get('/api/v1/movies')
                    .set('Authorization', 'Bearer ' + apiKey)
                    .query({ pagesize: testPageSize})
                    .query({ page: testPage })
                    .query({ sort: 1 })
                    .end((err, res) => {
                        assert.equal(res.body.movies.length, testPageSize);
                        done();
                    });
            });
        });

        describe('By id', () => {
            //Create movie to retrieve
            let movieId;
            beforeEach((done) => {
                request(app)
                    .post('/api/v1/movies')
                    .set('Authorization', 'Bearer ' + apiKey)
                    .send({
                        title: "Test Title",
                        duration: 11,
                        sliceDuration: 2
                    })
                    .end((err, res) => {
                        movieId = res.body.movie._id;
                        if(res.status === 201) done();
                    });
            });

            //Getbyid valid request
            it('should respond with status 200 for a valid request', (done) => {
                request(app)
                    .get('/api/v1/movies/' + movieId)
                    .set('Authorization', 'Bearer ' + apiKey)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        done();
                    });
            });
    
            //Getbyid invalid id
            it('should respond with status 404 for an invalid id', (done) => {
                request(app)
                .get('/api/v1/movies/' + '12345')
                .set('Authorization', 'Bearer ' + apiKey)
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    done();
                });
            });
        });
    });

    describe('PUT', () => {
        //Create movie to change
        let movieId;
        beforeEach((done) => {
            //Create user
            request(app)
                .post('/api/v1/users')
                .send({
                    email: testEmail,
                    password: testPW,
                    firstName: "Test",
                    lastName: "Tester"
                })
                .end((err, res) => {
                    if (res.status !== 201) return;
                    //Authenticate test user
                    request(app)
                        .post('/api/v1/users/authenticate')
                        .send({
                            email: testEmail,
                            password: testPW
                        })
                        .end((err, res) => {
                            if (res.status !== 200) return;
                            apiKey = res.body.token;
                            request(app)
                                .post('/api/v1/movies')
                                .set('Authorization', 'Bearer ' + apiKey)
                                .send({
                                    title: "Test Title",
                                    description: "Test description",
                                    duration: 11,
                                    sliceDuration: 2
                                })
                                .end((err, res) => {
                                    movieId = res.body.movie._id;
                                    done();
                                });
                        });

                });
        });

        //Update valid request
        it('should respond with status 200 for a valid request', (done) => {
            request(app)
                .put('/api/v1/movies/' + movieId)
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    title: "Test Title123",
                    description: "Test description123"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        it('should update the Movie for a valid response', (done) => {
            const updateTitle = 'Test Title123';
            const updateDesc = 'Test description123';
            request(app)
                .put('/api/v1/movies/' + movieId)
                .set('Authorization', 'Bearer ' + apiKey)
                .send({
                    title: updateTitle,
                    description: updateDesc
                })
                .end((err, res) => {
                    Movie.findById(movieId).then((result) => {
                        assert.equal(result.title, updateTitle);
                        assert.equal(result.description, updateDesc);
                        done();
                    })
                });
        })

        //Update invalid id
        //Update unauthorized request
        //Update invalid creator
        //Update invalid fields 
    });

    describe('DELETE', () => {
        //Delete valid request
        //Delete invalid id
        //Delete unauthorized request
        //Delete invalid creator
    })
});