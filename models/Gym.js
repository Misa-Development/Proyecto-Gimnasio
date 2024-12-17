const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'Tu Gimnasio' },
    backgroundColors: { type: String, default: '#000000, #61430b, #e49d1a' },
    image: { type: String, default: '/images/espartano.gif' },
    titleColor: { type: String, default: '#e4e01a' } // Añadir este campo
});

module.exports = mongoose.model('Gym', GymSchema);
