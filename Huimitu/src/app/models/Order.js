const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}    
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', schema);