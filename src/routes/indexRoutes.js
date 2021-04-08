const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const reservasController = require('../controllers/reservasController')

router.get('/', (req, res, next) => res.send({ "response": "server works" }))


// rutas de users
router.post('/login', usersController.login)
router.post('/registry', usersController.saveUser)
router.post('/checkEmail', usersController.checkEmail)
router.post('/checkValidationCode', usersController.checkValidationCode)
router.post('/changePassword', usersController.changePassword)
router.post('/updateUser', usersController.updateUser)
router.get('/getUser', usersController.getOneUser)

//rutas de reservas
router.get('/getReservas', reservasController.getAllReservas)
router.post('/newReserva', reservasController.saveReserva)
router.post('/updateState', reservasController.updateState)

module.exports = router