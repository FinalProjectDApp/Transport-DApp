const Trx = require('../models/transaction')
const User = require('../models/user')
const axios = require('axios')
const hostTrx = 'http://localhost:3001'
const redis = require('redis')
const client = redis.createClient({host: 'localhost', port: 6379 });

module.exports = {
    read: function(req, res) {
        client.get('alltrx', function(err, alltrx){
            if (err) {
                res.status(400).json({message: 'redis error'})
            } else if(alltrx === null){
                axios({
                    method: 'GET',
                    url: `${hostTrx}/trx`,
                    headers: {
                        email: req.headers.email
                    }
                })
                .then((result) => {
                    client.set('alltrx', JSON.stringify(result.data), 'EX', 30)
                    res.status(200).json(result.data)
                }).catch((err) => {
                    res.status(500).json(err.response.data)
                });
            } else {
                res.status(200).json(JSON.parse(alltrx))
            }
        })
    },
    create: function(req, res) {
        axios({
            method: 'POST',
            url: `${hostTrx}/trx`,
            data: req.body,
            headers: {
                email: req.headers.email
            }
        })
        .then((result) => {
            client.del('alltrx')
            client.del(`trx${req.headers.email}`)
            res.status(201).json(result.data)
        })
        .catch((err) => {
            res.status(500).json(err.response.data)
        });
    },
    update: function(req, res) {
        if(req.body.category === '' || req.body.description === '' || req.body.bill === '' || req.body.total === '' || req.body.status === '' ){
            res.status(400).json({message: 'All field must require'})
        } else {
            axios({
                method: 'PUT',
                url: `${hostTrx}/trx/${req.params.id}`,
                headers: {
                    email: req.headers.email
                }
            })
            .then((result) => {
                res.status(200).json(result.data)
            })
            .catch((err) => {
                res.status(500).json(err.response.data)
            });
        }
    },
    del: function(req, res) {
        axios({
            method: 'DELETE',
            url: `${hostTrx}/trx/${req.params.id}`,
            headers: {
                email: req.headers.email
            }
        })
        .then((result) => {
            res.status(200).json(result.data)
        })
        // .catch((err) => {
        //     res.status(500).json(err.response.data)
        // });
    },
    findById: function(req, res) {
        axios({
            method: 'GET',
            url: `${hostTrx}/trx/${req.params.id}`,
            headers: {
                email: req.headers.email
            }
        })
        .then((result) => {
            res.status(200).json(result.data)
        }).catch((err) => {
            res.status(500).json(err.response.data)
        });
    },
    getMyTrx: function(req, res) {
        axios({
            method: 'GET',
            url: `${hostTrx}/trx/find/mytrx`,
            headers: {
                email: req.headers.email
            }
        })
        .then((result) => {
            res.status(200).json(result.data)
        }).catch((err) => {
            res.status(500).json(err.response.data)
        });
    },
    search: (req, res) => {
        axios({
            method: 'GET',
            url: `${hostTrx}/trx/find/${req.params.q}`,
            headers: {
                email: req.headers.email
            }
        })
        .then((result) => {
            res.status(200).json(result.data)
        })
        // .catch((err) => {
        //     res.status(500).json(err.response.data)
        // }) 
    },
    getTrxbyEmail: (req, res) => {
        client.get(`trx${req.params.email}`, function(err, trx){
            if(err){
                res.status(400).json({message: 'redis error'})
            } else if ( trx === null ){
                axios({
                    method: 'GET',
                    url: `${hostTrx}/trx/user/${req.params.email}`,
                    headers: {
                        email: req.headers.email
                    }
                })
                .then((result) => {
                    client.set(`trx${req.params.email}`, JSON.stringify(result.data), 'EX', 30)
                    res.status(200).json(result.data)
                })
                .catch((err) => {
                    res.status(500).json(err.response.data)
                });
            } else {
                res.status(200).json(JSON.parse(trx))
            }
        })
    }
}