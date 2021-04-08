const reservaSchema = require('../schemas/reservaSchema')


exports.newReserva = (body) => {
    let reservaTosave = new reservaSchema({
        idReserva: body.idReserva,
        description: body.description,
        client: body.client,
        barber: body.barber,
        date: body.date,
        state: body.state
    })
    return reservaTosave.save()
        .then(resolve => {
            return resolve
        })
        .catch(reject => {
            return reject
        })
}

exports.getReservas = () => {
    return reservaSchema.find({})
        .then(resolve => {
            return resolve
        })
        .catch(reject => {
            return reject
        })
}


exports.getOnereserva = (id) => {
    return userSchema.find({ idReserva: id })
        .then(resolve => {
            return resolve
        })
        .catch(reject => {
            return reject
        })
}

exports.updateState = (filter, update) => {
    return reservaSchema.findOneAndUpdate(filter, update)
        .then(resolve => resolve)
        .catch(reject => reject)
}