const mongoose = require('mongoose');
const Gym = require('./models/Gym'); // Asegúrate de que la ruta es correcta

const dbUri = 'mongodb://localhost:27017/lubricentro'; // Actualiza con tu URI de conexión

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        updateGyms();
    })
    .catch(err => console.log('MongoDB connection error:', err));

async function updateGyms() {
    try {
        const gyms = await Gym.find({ titleColor: { $exists: false } });
        for (const gym of gyms) {
            gym.titleColor = '#e4e01a'; // Asigna un color predeterminado
            await gym.save();
        }
        console.log('Actualización completada.');
        mongoose.disconnect(); // Cierra la conexión después de actualizar
    } catch (error) {
        console.error('Error actualizando gimnasios:', error);
        mongoose.disconnect();
    }
}
