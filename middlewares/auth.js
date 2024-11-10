const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'your_secret_key');
        req.user = await User.findById(verified.id);  // Añadir información del usuario a la solicitud
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};
