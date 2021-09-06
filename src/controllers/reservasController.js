const reservasService = require('../services/reservasService')
const uuid = require('../utilities/uuid')
const usersService = require('../services/usersService')


exports.saveReserva = async(req, res, next) => {
    try {
        if (req.body.description && req.body.email && req.body.barber && req.body.date) {
            //valdiación de existencia del cliente
            try {             

                console.log(req.body.email);
                let user = await usersService.getOneUser(req.body.email)

                if (user.length === 0) {
                    res.status(201).json({
                        "response": "Cliente no existe",
                    })
                }else{

                    let barber = await usersService.getOneUser(req.body.email)
                    if (barber.length === 0) {
                        res.status(201).json({
                            "response": "Barbero no existe",
                        });
                    }else{

                        req.body.state = 'pending'
                        req.body.idReserva = uuid.generateCode()
                        let userSaved = await reservasService.newReserva(req.body);
    
                        if (userSaved.errors) {
                            res.status(400).json({
                                "response": userSaved._message,
                                "error": "E2004",
                                "errorDescription": userSaved.message
                            })
                        } else {
                            res.status(201).json({
                                "response": "Reserva guardada",
                            })
                        }

                    }                    
                   
                }
            } catch (error) {               
                res.status(400)
                .json({
                        "response": 'Error de server',
                        "error": "E2004",
                        "errorDescription": "Error en el server"
                    })
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


exports.updateState = async(req, res, next) => {
    try {
        if (req && req.body.idReserva) {
            await reservasService.updateState({ "idReserva": req.body.idReserva }, { "state": "done" })
            res.status(200)
                .json({
                    "response": "Se cambió el estado del servicio a done",
                })

        } else {
            res.status(400).json({
                "error": "E2024",
                "errorDescription": "Falta el campo idReserva"
            })
        }

    } catch (error) {
        res.status(400).json({
            "error": "E2024",
            "errorDescription": error
        })
    }
}

exports.getAllReservas = async(req, res, next) => {
    try {
        const reservas = await reservasService.getReservas()
        res.status(200)
            .json({
                "reservas": reservas
            })
    } catch (error) {
        res.status(400).json({
            "error": "E2024",
            "errorDescription": error
        })
    }
}