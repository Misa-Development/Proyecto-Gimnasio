const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Expense = require('../models/Expense');
const Gym = require('../models/Gym');
const auth = require('../middlewares/auth');

// Ruta para mostrar el formulario de agregar cliente
router.get('/add-client', auth, async (req, res) => {
    const gym = await Gym.findOne();
    res.render('add-client', {
        gymName: gym ? gym.name : 'Tu Gimnasio',
        backgroundColors: gym ? gym.backgroundColors : '#000000, #61430b, #e49d1a',
        gymImage: gym ? gym.image : '/images/espartano.gif'
    });
});

// Ruta para mostrar el dashboard con el listado de clientes
router.get('/dashboard', auth, async (req, res) => {
    const clients = await Client.find({ userId: req.user._id });  // Filtrar clientes por userId
    const gym = await Gym.findOne();
    res.render('dashboard', {
        clients,
        gymName: gym ? gym.name : 'Tu Gimnasio',
        backgroundColors: gym ? gym.backgroundColors : '#000000, #61430b, #e49d1a',
        gymImage: gym ? gym.image : '/images/espartano.gif',
        getMembershipClass: (membershipEnd) => {
            const endDate = new Date(membershipEnd);
            const now = new Date();
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(now.getDate() + 7);

            if (endDate < now) {
                return 'expired';
            } else if (endDate < oneWeekFromNow) {
                return 'expiring-soon';
            } else {
                return 'active';
            }
        }
    });
});

// Ruta para agregar un nuevo cliente
router.post('/add', auth, async (req, res) => {
    const { name, surname, age, email, gender, diseases, membershipStart, membershipEnd } = req.body;
    const medicalClearance = req.body.medicalClearance === 'on';

    const client = new Client({
        name,
        surname,
        age,
        email,
        gender,
        diseases,
        medicalClearance,
        membershipStart,
        membershipEnd,
        userId: req.user._id  // Asociar el cliente con el usuario autenticado
    });

    await client.save();
    res.redirect('/users/dashboard');
});

// Ruta para obtener los detalles de un cliente específico
router.get('/client/:id', auth, async (req, res) => {
    const client = await Client.findById(req.params.id);
    res.json(client);
});

// Ruta para manejar el nombre del gimnasio
router.post('/update-gym-name', auth, async (req, res) => {
    const { gymName } = req.body;
    const userId = req.user._id;

    let gym = await Gym.findOne({ userId });
    if (gym) {
        gym.name = gymName;
        await gym.save();
    } else {
        gym = new Gym({ userId, name: gymName });
        await gym.save();
    }

    res.send('Nombre del gimnasio actualizado');
});

// Ruta para mostrar la vista de caja
router.get('/expenses', auth, async (req, res) => {
    const expenses = await Expense.find({ userId: req.user._id });
    const gym = await Gym.findOne();
    res.render('expenses', {
        gymName: gym ? gym.name : 'Tu Gimnasio',
        backgroundColors: gym ? gym.backgroundColors : '#000000, #61430b, #e49d1a',
        gymImage: gym ? gym.image : '/images/espartano.gif',
        expenses
    });
});

module.exports = router;
