require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    register: function(req, res){
        User.findOne({
            email: req.body.email
        })
        .then((resultUser) => {
            if(resultUser && resultUser.email === req.body.email){
                res.status(400).json({errors: {email : {message: 'Duplicate email'}}})
            } else {
                User.create({
                    email: req.body.email,
                    password: req.body.password
                })
                .then((result) => {
                    res.status(201).json(result)
                }).catch((err) => {
                    res.status(400).json(err)
                });
            }
        })
    },
    login: function(req, res){     
        User.findOne({
            email: req.body.email
        })
        .then((result) => {    
            if (!result){
                res.status(400).json({errors: {login: { message: "Invalid email/password" }}})
            } else {                
                let password = bcrypt.compareSync(req.body.password, result.password)                
                if(password){
                    let token = jwt.sign({
                        _id: result._id,
                        email: result.email
                    }, process.env.JWT_KEY)                    
                    res.status(200).json({accessToken: token})
                } else {
                    res.status(400).json({errors: {login: {message: "Invalid email/password"} }})
                }
            }
        })
        .catch(err => {
            res.status(500).json(err)
        });
    }
}