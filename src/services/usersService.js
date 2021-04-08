const userSchema = require('../schemas/userSchema')

exports.getUsers = () => {
    return userSchema.find({})
        .then(resolve => {
            return resolve
        })
        .catch(reject => {
            return reject
        })
}

exports.getOneUser = (userEmail) => {
    return userSchema.find({ email: userEmail })
        .then(resolve => {
            return resolve
        })
        .catch(reject => {
            return reject
        })
}

exports.saveUser = (body) => {
    let userToSave = new userSchema({
        email: body.email,
        password: body.password,
        fullname: body.fullname,
        userType: body.userType,
        addres: 'Default',
        verificationCode: 'Default'
    })
    return userToSave.save()
        .then(resolve => {
            return resolve
        })
        .catch(reject => {
            return reject
        })
}

exports.updatePassWord = (filter, update) => {
    return userSchema.findOneAndUpdate(filter, update)
        .then(resolve => resolve)
        .catch(reject => reject)
}


exports.updateUser = (filter, update) => {
    return userSchema.findOneAndUpdate(filter, update)
        .then(resolve => resolve)
        .catch(reject => reject)
}


exports.saveVerificationCode = (filter, update) => {
    return userSchema.findOneAndUpdate(filter, update)
        .then(resolve => resolve)
        .catch(reject => reject)
}