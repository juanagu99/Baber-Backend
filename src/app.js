const express = require('express')
const app = express()

const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')

const dbConnection = require('./utilities/dbConecction').conect(process.env.MONGO_ROUTE)
const router = require('./routes/indexRoutes.js')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)

module.exports = app;