const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: String,
    surname: String,
    age: Number,
    email: String,
    gender: String,
    diseases: String,
    medicalClearance: Boolean,
    membershipStart: Date,
    membershipEnd: Date,
    userId: mongoose.Schema.Types.ObjectId  // Relacionar cliente con el usuario
});

module.exports = mongoose.model('Client', ClientSchema);
