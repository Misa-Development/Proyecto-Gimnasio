const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: Date,
    userId: mongoose.Schema.Types.ObjectId  // Relacionar el gasto con el usuario
});

module.exports = mongoose.model('Expense', ExpenseSchema);
