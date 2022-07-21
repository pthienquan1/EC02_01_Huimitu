const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://khiemlethanh:180bhahuygiap@cluster0.mf2ks.mongodb.net/Shopee_fake?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Connect to database failed');
    }
}

module.exports = { connect };