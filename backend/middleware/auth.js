import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('A token is required for authentication');
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(403).send('JWT verification failed, invalid token');
        }

        // If req.user does not exist, create it to avoid overwriting req.body
        req.user = req.user || {};

        req.user.userId = payload.userId;
        req.user.email = payload.email;
        req.user.type = payload.type;

        next(); // Proceed to the next middleware or route handler
    });
};

export default verifyToken;
