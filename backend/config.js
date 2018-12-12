const authSecret = process.env.SECRET || undefined;
const dbPassword = process.env.DB_PASSWORD || undefined;

module.exports = {
    dbUrl: `mongodb+srv://node:${dbPassword}@cluster0-ybyz6.azure.mongodb.net/movies-retold?retryWrites=true`,
    dbUrlTest: `mongodb+srv://node:${dbPassword}@cluster0-ybyz6.azure.mongodb.net/movies-retold-test?retryWrites=true`,
    dbUrlLocal: `mongodb://localhost/moviesretold_test`,
    secret: authSecret
};
