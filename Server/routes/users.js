const express = require('express');
const router = express.Router();
const {register, login, getAllUser} = require('../controllers/users')

router.get('/users', getAllUser)
router.post('/register', register)
router.post('/login', login)


module.exports = router;
