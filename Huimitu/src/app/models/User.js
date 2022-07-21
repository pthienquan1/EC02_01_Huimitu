const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true },
    fullAddress: { type: String, },
    city: { type: String, },
    country: { type: String, },
    telephone: { type: String, },
    isAdmin: { type: Boolean, default: false },
}, {
    timestamps: true,
});

mongoose.plugin(slug);
User.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('User', User);