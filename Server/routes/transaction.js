const express = require('express');
const router = express.Router();
const { read, create, update, del, findById, getMyTrx, search } = require('../controllers/transaction')
const { isLogin, isMine  } = require('../middleware/auth')

router.get('/', isLogin, read)
router.get('/:id', isLogin, findById)
router.get('/find/mytrx', isLogin, getMyTrx)
router.get('/find/:q', isLogin, search)
router.post('/', isLogin, create)
router.put('/:id', isLogin, isMine, update)
router.delete('/:id', isLogin, isMine, del)

module.exports = router;