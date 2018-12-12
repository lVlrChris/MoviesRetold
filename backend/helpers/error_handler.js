module.exports = function(app) {
    app.use((err, req, res, next) => {
        console.error(err.stack);

        // Check for auth errors
        if (err.name === 'UnauthorizedError') {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        // All other errors
        return res.status(500).json({ error: err.message });
    });
};
