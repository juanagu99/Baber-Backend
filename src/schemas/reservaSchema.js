const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservaSchema = Schema({
    idReserva: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    barber: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
})

const reservas = mongoose.model("bookings", ReservaSchema)
module.exports = reservas