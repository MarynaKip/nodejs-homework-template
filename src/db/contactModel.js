const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    }
});

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Contact }