const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'Nombre del Gimnasio' }
});

module.exports = mongoose.model('Gym', GymSchema);
