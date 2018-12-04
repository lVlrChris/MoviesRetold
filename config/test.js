const dbPassword = process.env.DB_PASSWORD || undefined

module.exports = {
    dbUrl : `mongodb+srv://node:${dbPassword}@cluster0-ybyz6.azure.mongodb.net/movies-retold-test?retryWrites=true`
}