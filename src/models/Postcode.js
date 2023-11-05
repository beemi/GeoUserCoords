const mongoose = require('mongoose');

const postcodeSchema = new mongoose.Schema({
    postcode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    data: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Postcode = mongoose.model('Postcode', postcodeSchema);

module.exports = Postcode;
