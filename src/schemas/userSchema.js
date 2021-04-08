const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    addres: {
        type: String,
        required: true,
        default: 'Dfault'
    },
    verificationCode: {
        type: String,
        required: true,
        default: 'Dfault'
    },
    userType: {
        type: String,
        required: true,
        default: 'Dfault'
    }
})

const users = mongoose.model("user", UserSchema)
module.exports = users