const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Ruta para confirmar un usuario
router.get('/confirm/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        user.isConfirmed = true;
        await user.save();
        res.send('Usuario confirmado exitosamente');
    } catch (error) {
        res.status(500).send('Error al confirmar el usuario');
    }
});

module.exports = router;
