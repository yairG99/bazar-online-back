const mongoose = require('mongoose');

const clienteSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    instagram: {
        type: String,
    },
    tel: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});



module.exports = mongoose.model('Cliente', clienteSchema);