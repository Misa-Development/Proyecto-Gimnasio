const mongoose = require('mongoose');
const Gym = require('./models/Gym'); // Asegúrate de que la ruta es correcta

const dbUri = 'mongodb://localhost:27017/lubricentro'; // Actualiza con tu URI de conexión

mongoose.connect(dbUri)
    .then(() => {
        console.log('MongoDB connected');
        checkGyms();
    })
    .catch(err => console.log('MongoDB connection error:', err));

async function checkGyms() {
    try {
        const gyms = await Gym.find();
        gyms.forEach(gym => {
            console.log(gym);
        });
        mongoose.disconnect(); // Cierra la conexión después de verificar
    } catch (error) {
        console.error('Error verificando gimnasios:', error);
        mongoose.disconnect();
    }
}

