const express = require('express');
const router = express.Router();
const {register, login, getUser} = require('../controllers/users')

// router.get('/', (req, res)=>{
//   res.status(200).send('Server is On')
// })
router.post('/register', register)
router.post('/login', login)

module.exports = router;
