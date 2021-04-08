const usersService = require('../services/usersService')
const bcrypt = require('../utilities/bcrypt')
const jwt = require('../utilities/jwt')
const nodeMailer = require('../utilities/nodeMailer')

exports.getUsers = async(req, res, next) => {
    try {
        let users = await usersService.getUsers()
        if (users.length === 0) {
            throw 'Not Found'
        }
        res.status(200).json({ "data": users })
    } catch (error) {
        res.status(404).json({ "reject": error })
    }
}

exports.getOneUser = async(req, res, next) => {
    try {
        let response = await usersService.getOneUser(req.query.email)
        res.send({ "response": response })
    } catch (error) {
        res.send({ "error": error })
    }
}

exports.saveUser = async(req, res, next) => {
    try {
        if (req.body.email && req.body.password && req.body.fullname && req.body.userType) {
            if (validateEmail(req.body.email)) {
                let user = await usersService.getOneUser(req.body.email)
                if (user.length !== 0) {
                    res.status(400)
                        .json({
                            "response": 'User already in use',
                            "error": "E2001",
                            "errorDescription": "Este correo ya se encuentra registrado"
                        })
                } else {
                    req.body.password = await bcrypt.encryptPassword(req.body.password)
                    let userSaved = await usersService.saveUser(req.body)
                    if (userSaved.errors) {
                        res.status(400).json({
                            "response": userSaved._message,
                            "error": "E2004",
                            "errorDescription": userSaved.message
                        })
                    } else {
                        let token = await jwt.getToken(req.body.email)
                        let userData = {
                            "userName": req.body.fullname,
                            "userEmail": req.body.email,
                            "userAddres": userSaved.addres,
                            "userType": userSaved.userType,
                            "token": token
                        }
                        res.status(201).json({
                            "response": "user Saved",
                            "userData": userData
                        })
                    }
                }
            } else {
                res.status(400)
                    .json({
                        "response": "invalid email",
                        "error": "E2008",
                        "errorDescription": "El correo no cumple con la expresion regular"
                    });
            }
        } else {
            res.status(400).json({
                "error": "E2024",
                "errorDescription": "Faltan campos por diligenciar"
            })
        }
    } catch (error) {
        // debo poner un logger
        res.status(500)
            .json({
                "error": "E2020",
                "errorDescription": 'Algo salió mal, estamos trabajando en ello'
            })
    }
}

exports.login = async(req, res, next) => {
    try {
        if (req.body.email && req.body.password) {
            if (validateEmail(req.body.email)) {
                let user = await usersService.getOneUser(req.body.email)
                if (user.length === 0) {
                    res.status(400)
                        .json({
                            "response": 'User are not registered',
                            "error": "E2002",
                            "errorDescription": "Usuario no registrado"
                        })
                } else {
                    let compare = await bcrypt.compare(req.body.password, user[0].password)
                    if (compare) {
                        let token = await jwt.getToken(req.body.email)
                        let userData = {
                            "userName": user[0].fullname,
                            "userEmail": req.body.email,
                            "userAddres": user[0].addres,
                            "userType": user[0].userType,
                            "token": token
                        }
                        res.status(200)
                            .json({
                                "response": "Welcome",
                                "userData": userData
                            });
                    } else {
                        res.status(400)
                            .json({
                                "response": "incorrect password",
                                "error": "E2003",
                                "errorDescription": "Contraseña incorrecta"
                            });
                    }
                }
            } else {
                res.status(400)
                    .json({
                        "response": "invalid email",
                        "error": "E2008",
                        "errorDescription": "El correo no cumple con la expresion regular"
                    });
            }
        } else {
            res.status(400).json({
                "error": "E2005",
                "errorDescription": "Falta tu correo y/o contraseña"
            })
        }
    } catch (error) {
        res.status(500)
            .json({
                "error": "E2020",
                "errorDescription": "Error inesperado, estamos trabajando en ello"
            })
    }
}

exports.checkEmail = async(req, res, next) => {
    try {
        if (req.body.email) {
            if (validateEmail(req.body.email)) {
                let user = await usersService.getOneUser(req.body.email)
                if (user.length === 0) {
                    res.status(400)
                        .json({
                            "error": "E2007",
                            "errorDescription": "Usuario no registrado"
                        })
                } else {
                    let responseNodeMailer = await nodeMailer.sendVerificationCode(req.body.email, user[0].fullname)
                    if (responseNodeMailer.error) {
                        throw responseNodeMailer.error
                    } else {
                        await usersService.saveVerificationCode({ "email": req.body.email }, { "verificationCode": responseNodeMailer.verificationCode })
                        res.status(200)
                            .json({
                                "response": "Se envió código de verificación con exito",
                            })
                    }
                }
            } else {
                res.status(400)
                    .json({
                        "response": "invalid email",
                        "error": "E2008",
                        "errorDescription": "El correo no cumple con la expresion regular"
                    });
            }
        } else {
            res.status(400)
                .json({
                    "error": "E2006",
                    "errorDescription": "Falta el campo Email"
                })
        }
    } catch (error) {
        res.status(500)
            .json({
                "error": "E2020",
                "errorDescription": "Error inesperado, estamos trabajando en ello"
            })
    }
}

exports.checkValidationCode = async(req, res, next) => {
    try {
        if (req.body.verificationCode && req.body.email) {
            let user = await usersService.getOneUser(req.body.email)
            if (user.length !== 0) {
                if (user[0].verificationCode === req.body.verificationCode) {
                    res.status(200)
                        .json({
                            "response": 'codigo valido',
                        })
                } else {
                    res.status(400)
                        .json({
                            "response": 'invalid verificacion Code',
                            "error": "E2009",
                            "errorDescription": "El código de verificación no coincide con el enviado a tu correo"
                        })
                }

            } else {
                res.status(400)
                    .json({
                        "response": 'User are not registered',
                        "error": "E2002",
                        "errorDescription": "Usuario no registrado"
                    })
            }

        } else {
            res.status(400)
                .json({
                    "error": "E2010",
                    "errorDescription": "Faltan campos en el cuerpo la petición"
                })
        }

    } catch (error) {
        res.status(500)
            .json({
                "error": "E2020",
                "errorDescription": "Error inesperado, estamos trabajando en ello"
            })
    }
}

exports.changePassword = async(req, res, next) => {
    try {
        if (req.body.email && req.body.password) {
            let user = await usersService.getOneUser(req.body.email)
            if (user.length === 0) {
                res.status(400)
                    .json({
                        "response": 'User are not registered',
                        "error": "E2002",
                        "errorDescription": "Usuario no registrado"
                    })
            } else {
                req.body.password = await bcrypt.encryptPassword(req.body.password)
                await usersService.updatePassWord({ "email": req.body.email }, { "password": req.body.password })
                await usersService.saveVerificationCode({ "email": req.body.email }, { "verificationCode": 'Default' })
                res.status(200)
                    .json({
                        "response": "Se cambió la contraseña",
                    })

            }
        } else {
            res.status(400).json({
                "error": "E2024",
                "errorDescription": "Faltan campos por diligenciar"
            })
        }

    } catch (error) {
        res.status(500)
            .json({
                "error": "E2020",
                "errorDescription": "Error inesperado, estamos trabajando en ello"
            })
    }
}

exports.updateUser = async(req, res, next) => {
    try {
        if (req.body.email && req.body.fullname) {
            let user = await usersService.getOneUser(req.body.email)
            if (user.length === 0) {
                res.status(400)
                    .json({
                        "response": 'User are not registered',
                        "error": "E2002",
                        "errorDescription": "Usuario no registrado"
                    })
            } else {
                req.body.password = await bcrypt.encryptPassword(req.body.password)
                await usersService.updateUser({ "email": req.body.email }, { "fullname": req.body.fullname })
                res.status(200)
                    .json({
                        "response": "Se actualizó el usuario",
                    })

            }
        } else {
            res.status(400).json({
                "error": "E2024",
                "errorDescription": "Faltan campos por diligenciar"
            })
        }

    } catch (error) {
        res.status(500)
            .json({
                "error": "E2020",
                "errorDescription": "Error inesperado, estamos trabajando en ello"
            })
    }
}

const validateEmail = (email) => {
    return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)
}