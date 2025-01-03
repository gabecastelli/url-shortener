const mongoose = require('mongoose');
const URLSchema = new mongoose.Schema({
    URLCode: String,
    longURL: String,
    shortURL: String,
    date: {
        type: String,
        default: Date.now
    }
});

module.exports = mongoose.model('URL', URLSchema)