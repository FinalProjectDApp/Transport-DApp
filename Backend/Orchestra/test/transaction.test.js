const User = require('../models/user')
const Trx = require('../models/transaction')
require('dotenv').config()

//chai
var chai = require('chai')
var assert = chai.assert
var expect = chai.expect
var should = chai.should()
var chaiHttp = require('chai-http')
let app = require('../app.js')
chai.use(chaiHttp)

describe('Transaction', () => {
    let idUser = ''
    let idTrx = ''
    let emailUser = ''
    let newUser = {
        email: 'user@test.com',
        password: '123456'
    }
    
    beforeEach((done) => {
        User.create(newUser)
        .then((result) => {
        idUser = result._id
        emailUser = result.email
        Trx.create({
            transactionId: '66671293',
            category: 'Food',
            description: 'lorem Ipsum',
            bill: 'http://image.com',
            total: '200000',
            status: 'ok',
            email: 'a@mail.com',
            location: '{lat:101.01, long:-102.20}',
            user: idUser
        })
        .then(result2=>{            
            idTrx = result2._id;
            done();
            })
        })
        .catch((err) => {
        console.log(err);
        });
    })

    it('Show all the Transaction', (done) => {
        chai
        .request(app)
        .get('/trx')
        .set('email', emailUser)
        .end((err, res) => {
            expect(res).to.have.status(200)
            res.body.should.be.a('array');
            done();
        });
    });

    it('find Transaction by Id', (done) => {
        chai
        .request(app)
        .get(`/trx/${idTrx}`)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            done()
        })
    })

    it('find Transaction by Id (wrong id transaction )', (done) => {
        chai
        .request(app)
        .get(`/trx/$$12`)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(500)
            res.body.should.be.a('object')
            res.body.should.have.property('message')
            res.body.should.have.property('name').eql('CastError')
            done()
        })
    })

    it('Get Transactions by user email and create data cache to redis', (done) => {
        chai
        .request(app)
        .get(`/trx/user/user@test.com`)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            done()
        })
    })

    it('Get Transactions by user email on redis data cache', (done) => {
        chai
        .request(app)
        .get(`/trx/user/user@test.com`)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            done()
        })
    })

    it('Get All Transactions user with wrong email', (done) => { 
        chai
        .request(app)
        .get(`/trx/user/user@test`)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(500)
            res.body.should.be.a('object')
            done()
        })
    })

    it('Search Transaction by query of Description', (done) => {
        chai
        .request(app)
        .get(`/trx/find/lorem`)
        .set('email', emailUser)
        .end((err, res) => { 
            res.should.have.status(200)
            res.body.should.be.a('Array')
            done()
        })
    })

    it(`Create a new Transaction`, (done)=> {    
        let newTrx = {
            transactionId: '66671293',
            category: 'Food',
            description: 'lorem Ipsum',
            bill: 'http://image.com',
            total: '200000',
            status: 'ok',
            email: 'a@mail.com',
            location: '{lat:101.01, long:-102.20}',
        }
        chai
        .request(app)
        .post('/trx')
        .send(newTrx)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(201)
            res.body.should.be.a('object')
            res.body.should.have.property('message')
            res.body.should.have.property('data')
            res.body.should.have.property('message').eql('Data Saved')
            done()
        })
    })

    it(`Create a new transaction with empty field`, (done)=> {    
        let failTrx = {
            category: '',
            description: '',
            bill: '',
            total: '',
            status: ''
        }
        chai
        .request(app)
        .post('/trx')
        .send(failTrx)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(500)
            res.body.should.be.a('object')
            res.body.should.have.property('errors')
            done()
        })
    })

    it(`Create a new transaction without email user`, (done)=> {    
        let failTrx = {
            category: 'Drink',
            description: 'lorem Ipsum',
            bill: 'http://image.com',
            total: '200000',
            status: 'ok'
        }
        let wrongToken = 'qwertyuiop1234567890'
        chai
        .request(app)
        .post('/trx')
        .send(failTrx)
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.be.a('object')
            res.body.should.have.property('message')
            res.body.should.have.property('message').eql('Email Required')
            done()
        })
    })

    it('Show All My Transaction', (done) => {
        chai
        .request(app)
        .get('/trx/find/mytrx')
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            done()
        })
    })

    it('update/edit my article', (done) => {
        let updateTrx = {
            category: 'Drunk',
            description: 'lorem Ipsum Lorem',
            bill: 'http://images.com',
            total: '20000',
            status: 'warning'
        }
        chai
        .request(app)
        .put(`/trx/${idTrx}`)
        .set('email', emailUser)
        .send(updateTrx)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Data Updated')
            done()
        })
    })

    it('update/edit my article with empty field', (done) => {
        let updateTrx = {
            category: '',
            description: '',
            bill: '',
            total: '',
            status: ''
        }
        chai
        .request(app)
        .put(`/trx/${idTrx}`)
        .set('email', emailUser)
        .send(updateTrx)
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('All field must require')
            done()
        })
    })

    it('update/edit my article with wrong format', (done) => {
        let updateTrx = {update: {category: 'test'},
            description: '',
            bill: '',
            total: '',
            status: ''
        }
        chai
        .request(app)
        .put(`/trx/${idTrx}`)
        .set('email', emailUser)
        .send(updateTrx)
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('All field must require')
            done()
        })
    })

    it('update/edit my article with wrong id Transaction', (done) => {
        let updateTrx = {update: {category: 'test'},
            description: '',
            bill: '',
            total: '',
            status: ''
        }
        chai
        .request(app)
        .put(`/trx/$1`)
        .set('email', emailUser)
        .send(updateTrx)
        .end((err, res) => {
            res.should.have.status(500)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Cast to ObjectId failed for value "$1" at path "_id" for model "Transaction"')
            done()
        })
    })

    it('delete my Transaction', (done) => {
        chai
        .request(app)
        .delete(`/trx/${idTrx}`)
        .set('email', emailUser)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Data Deleted')
            done()
        })
    })

    it('delete my Transaction with wrong email', (done) => {
        let fakeEmail = 'fake@mail.com'
        chai
        .request(app)
        .delete(`/trx/${idTrx}`)
        .set('email', fakeEmail)
        .end((err, res) => {
            res.should.have.status(400)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Email not valid')
            done()
        })
    })

    afterEach((done) => { 
        Trx.remove({}, (err) => {
            User.remove({}, err=>{
                done();
            })
        });
    });
})