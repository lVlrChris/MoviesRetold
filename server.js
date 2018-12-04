const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Load configurations
const prodConfig = require('./config/production');
const devConfig = require('./config/development');
const testConfig = require('./config/test');
app.use(bodyParser.json)

let connection
// Connect database
if (process.env.NODE_ENV == 'production') {
    connection = mongoose.connect(prodConfig.dbUrl, { useNewUrlParser: true });
} else if (process.env.NODE_ENV == 'test') {
    connection = mongoose.connect(testConfig.dbUrl, { useNewUrlParser: true });
} else { 
    connection = mongoose.connect(devConfig.dbUrl, { useNewUrlParser: true });
}

connection.then(() => console.log('Connected to database...'))
    .catch(() => console.log('Unable to connect to database'))

// Setup routing
require('./app/routes/setup')(app)

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}..`);
})