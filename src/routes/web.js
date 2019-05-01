// Global
const express = require('express')

// Configs
const router = express.Router()

// Controllers
const IndexController = require('../controllers/IndexController')

// Routes
router.get('/', IndexController.index)

module.exports = router
