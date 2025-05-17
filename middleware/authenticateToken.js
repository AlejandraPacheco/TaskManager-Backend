const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // obtener header Authorization
    const token = authHeader && authHeader.split(' ')[1]; // extraer token (formato: Bearer token)

    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });

        req.user = user; // payload del token en req.user
        next();
    });
};

module.exports = authenticateToken;
