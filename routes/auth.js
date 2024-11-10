const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail, sendUserConfirmationEmail } = require('../mailer');
// Ruta para registrar usuarios
router.post('/register', async (req, res) => {
    const { name, email, password, surname, age, diseases, medicalClearance, membershipStart, membershipEnd } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
        name, 
        surname, 
        age, 
        email, 
        password: hashedPassword,
        diseases,
        medicalClearance: medicalClearance === 'on',
        membershipStart,
        membershipEnd,
        isEmailConfirmed: false,
        isConfirmed: false
    });
    await user.save();

    sendConfirmationEmail(user);
    sendUserConfirmationEmail(user);

    return res.status(200).json({ message: 'Email de confirmación enviado.' });
});


// Ruta para verificar el correo del usuario
router.get('/confirm-email/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        user.isEmailConfirmed = true;
        await user.save();
        res.send('Correo electrónico verificado con éxito.');
    } catch (error) {
        res.status(500).send('Error al verificar el correo electrónico.');
    }
});

// Ruta para confirmar el administrador
router.get('/confirm-admin/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        user.isConfirmed = true;
        await user.save();
        res.send('Usuario confirmado por el administrador.');
    } catch (error) {
        res.status(500).send('Error al confirmar el usuario.');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        if (!user.isEmailConfirmed) {
            return res.status(403).json({ error: 'Por favor, verifica tu correo electrónico.' }); // Mensaje de error en JSON
        }
        if (!user.isConfirmed) {
            return res.status(403).json({ error: 'Tu registro aún no ha sido confirmado por el administrador' }); // Mensaje de error en JSON
        }
        const token = jwt.sign({ id: user._id }, 'your_secret_key');
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/users/dashboard');
    } else {
        return res.status(400).json({ error: 'Credenciales inválidas' }); // Mensaje de error en JSON
    }
});

// Ruta para logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;
