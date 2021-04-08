var jwt = require('jsonwebtoken');

exports.getToken = (email) => {
    return jwt.sign({userEmail: email}, 'more than a service')
}

exports.verify = (token) => {
    return jwt.verify(token, 'more than a service')
}