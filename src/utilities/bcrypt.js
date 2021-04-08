const bcrypt = require('bcrypt');

exports.encryptPassword = (password) => {
    return bcrypt.hash(password, 6)
    .then(resolve => resolve)
    .catch(reject => reject)
}

exports.compare = (password, hash) => {
    return bcrypt.compare(password, hash)
    .then(resolve => resolve)
    .catch(reject => reject)
}