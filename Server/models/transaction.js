const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    transactionId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description:  {
        type: String,
        required: true
    },
    bill:  {
        type: String,
        required: true
    },
    total:  {
        type: String,
        required: true
    },
    status:  {
        type: String,
        required: true
    },
    email:  {
        type: String,
        required: true
    },
    location:  {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

var Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction;