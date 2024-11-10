const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    surname: String,
    Sexo: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
    diseases: String,
    medicalClearance: Boolean,
    membershipStart: Date,
    membershipEnd: Date,
    isConfirmed: { type: Boolean, default: false },
    isEmailConfirmed: { type: Boolean, default: false },
    gymName: { type: String, default: 'Coloque el nombre del Gimnasio' }  // Añadir campo para el nombre del gimnasio
});

module.exports = mongoose.model('User', UserSchema);
