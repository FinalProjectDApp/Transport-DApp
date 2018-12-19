require('dotenv').config()
const User = require('../models/user')
const Trx = require('../models/transaction')

module.exports = {
    isLogin: function(req, res, next){
        if(req.headers.email){         
                User.findOne({
                    email: req.headers.email
                })
                .then((result) => {
                    if(result){
                        req.decoded = result
                        next()
                    } else {
                        res.status(400).json({message: 'Email not valid'})
                    }
                })
        } else {
            res.status(400).json({message: 'Email Required'})
        } 
    },
    isMine: function(req, res, next){    
        Trx.findOne({
            _id: req.params.id
        })
        .then((result) => {
            if(String(result.user) === String(req.decoded._id)){
                next()
            }
        })
        .catch((err) => {
            res.status(500).json(err)
        });
    }
}