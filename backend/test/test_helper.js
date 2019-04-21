const mongoose = require('mongoose');
const config = require('../config');

before((done) => {
    mongoose.connect(config.dbUrlTest, { useNewUrlParser: true })
        .then(() => {
            console.log(`Connected to ${config.dbUrlTest}..`);
            done();
        })
        .catch((error) => {
            console.error('Error: ', error);
            done();
        });
});

beforeEach((done) => {
    const { users, movies } = mongoose.connection.collections;

    // Promise.all([movies.drop(), users.drop()])
    //     .then(() => {
    //         done();
    //     })
    //     .catch(() => {
    //         console.log("done dropping");
    //         done();
    //     })

    mongoose.connection.collections.users.drop(() => {
        mongoose.connection.collections.movies.drop(() => {
            done();
        })
    })
});
