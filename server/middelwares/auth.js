const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Token Verification using ENV variable
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = auth