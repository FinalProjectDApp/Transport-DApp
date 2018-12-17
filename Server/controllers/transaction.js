const Trx = require('../models/transaction')
const User = require('../models/user')

module.exports = {
    read: function(req, res) {
        Trx.find()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        });
    },
    create: function(req, res) {
        Trx.create({
            category: req.body.category,
            description: req.body.description,
            bill: req.body.bill,
            total: req.body.total,
            status: req.body.status,
            user: req.decoded._id
        })
        .then((result) => {
            res.status(201).json({message: 'Data Saved', data: result})
        })
        .catch((err) => {
            res.status(500).json(err)
        });
    },
    update: function(req, res) {
        if(req.body.category === '' || req.body.description === '' || req.body.bill === '' || req.body.total === '' || req.body.status === '' ){
            res.status(400).json({message: 'All field must require'})
        } else {
            Trx.updateOne({
                _id: req.params.id
            }, {
                category: req.body.category,
                description: req.body.description,
                bill: req.body.bill,
                total: req.body.total,
                status: req.body.status,
            })
            .then((result) => {
                res.status(200).json({message: 'Data Updated', data: result})
            })
            .catch((err) => {
                res.status(500).json(err)
            });
        }
    },
    del: function(req, res) {
        Trx.deleteOne({
            _id: req.params.id
        })
        .then((result) => {
            res.status(200).json({message: 'Data Deleted', data: result})
        })
        .catch((err) => {
            res.status(500).json(err)
        });
    },
    findById: function(req, res) {
        Trx.findOne({
            _id: req.params.id
        })
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        });
    },
    getMyTrx: function(req, res) {
        Trx.find({
            user: req.decoded._id
        })
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        });
    },
    search: (req, res) => {
        var regexQuery = {
            description: new RegExp(req.params.q, 'i')
        }
        Trx.find(regexQuery)
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        }) 
    },
    getTrxbyEmail: (req, res) => {
        User.findOne({
            email: req.params.email
        })
        .then((user) => {
            Trx.find({
                user: user._id
            })
            .then((trx) => {
                res.status(200).json(trx)
            })
        }).catch((err) => {
            res.status(500).json(err)
        });
    }
}