const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Load configurations
const prodConfig = require('./app/config/production');
const devConfig = require('./app/config/development');
const testConfig = require('./app/config/test');
app.use(bodyParser.json());

let connection;
// Connect database
if (process.env.NODE_ENV === 'production') {
    connection = mongoose.connect(prodConfig.dbUrl, { useNewUrlParser: true });
} else if (process.env.NODE_ENV === 'test') {
    connection = mongoose.connect(testConfig.dbUrl, { useNewUrlParser: true });
} else {
    connection = mongoose.connect(devConfig.dbUrl, { useNewUrlParser: true });
}

connection.then(() => console.log('Connected to database.'))
    .catch((err) => {
        console.log('Unable to connect to database.');
        console.log(err);
    });

// Setup routing
require('./app/routes/setup')(app);

const server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;
    console.log(`Listening on port ${port}..`);
});
