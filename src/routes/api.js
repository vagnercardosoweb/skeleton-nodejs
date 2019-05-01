// Global
const express = require('express')

// Configs
const router = express.Router()

// Controllers
const UserController = require('../controllers/Api/UserController')

// Routes
router.get('/', UserController.index)

module.exports = router
