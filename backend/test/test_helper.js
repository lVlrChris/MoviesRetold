const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.dbUrlTest, { useNewUrlParser: true })
    .then(() => {
        console.log(`Connected to ${config.dbUrlTest}..`);
    })
    .catch((error) => {
        console.warn('Warning', error);
    });
