const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const jwt = require('./helpers/jwt');
const cors = require('cors');

const app = express();

// Load configurations
const config = require('./config');
app.use(cors());
app.use(bodyParser.json());

// Configure Angular serving
const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

let connection;
// Connect database
if (process.env.NODE_ENV === 'production') {
    connection = mongoose.connect(config.dbUrl, { useNewUrlParser: true });
} else if (process.env.NODE_ENV === 'test') {
    connection = mongoose.connect(config.dbUrlTest, { useNewUrlParser: true });
} else {
    connection = mongoose.connect(config.dbUrlLocal, { useNewUrlParser: true });
}

connection.then(() => console.log('Connected to database.'))
    .catch((err) => {
        console.log('Unable to connect to database.');
        console.log(err);
    });

// Setup authentication
// app.use(jwt());

// Setup routing
require('./routes/setup')(app);

const server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;
    console.log(`Listening on port ${port}..`);
});

module.exports = app;