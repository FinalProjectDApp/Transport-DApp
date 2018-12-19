const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

// Uncomment this line if you've created app.js
const app = require('../app');
const clearUsersCollection = require('../helpers/clearUsersCollection');

chai.use(chaiHttp);

describe('Authentication tests', function () {
  describe('POST /register', function () {
    before(async function () {
      try {
        await clearUsersCollection();
      } catch (e) {
        console.log(e);
      }
    });

    it('should send a newly created user object with hashed password and a 201 status code', async function () {
      const user = { email: 'dimitri@mail.com', password: 'secret' };

      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);      
      expect(response).to.have.status(201);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('email');
      expect(response.body).to.have.property('password');
      expect(response.body.password).to.not.equal(user.password);
    });

    it('should send an error object with a message and a 400 status code (duplicate email)', async function () {
      const user = { email: 'dimitri@mail.com', password: 'secrets' };
      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('email');
      expect(response.body.errors.email.message).to.equal('Duplicate email');
    });

    it("should send an error object with a message and a 400 status code (no email key)", async function () {
      const user = { password: 'secrets' };
      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('email');
      expect(response.body.errors.email.message).to.equal('Email is required');
    });

    it("should send an error object with a message and a 400 status code (email === '')", async function () {
      const user = { email: '', password: 'secrets' };
      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('email');
      expect(response.body.errors.email.message).to.equal('Email is required');
    });

    it('should send an error object with a message and a 400 status code (no password key)', async function () {
      const user = { email: 'dimitri@mail.com' };
      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);
      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('email');
      expect(response.body.errors.email.message).to.equal('Duplicate email');
    });

    it("should send an error object with a message and a 400 status code (password === '')", async function () {
      const user = { email: 'dimitri@mail.com', password: '' };
      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('email');
    });

    it("should send an error object with messages and a 400 status code (no email and password keys)", async function () {
      const user = {};
      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email.message).to.equal("Email is required");
      expect(response.body.errors).to.have.property('password');
      expect(response.body.errors.password.message).to.equal('Password is required');
    });

    it("should send an error object with messages and a 400 status code (email === '' and password === '')", async function () {
      const user = { email: '', password: '' };
      const response = await chai
                              .request(app)
                              .post('/register')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property("email");
      expect(response.body.errors.email.message).to.equal("Email is required");
      expect(response.body.errors).to.have.property('password');
      expect(response.body.errors.password.message).to.equal('Password is required');
    });
  });

  describe('POST /login', function () {
    after(async function () {
      try {
        await clearUsersCollection();
      } catch (e) {
        console.log(e);
      }
    });

    it('should send an access token that contains user data (generated from JWT) and a 200 status code', async function () {
      const user = { email: 'dimitri@mail.com', password: 'secret' };
      const response = await chai
                              .request(app)
                              .post('/login')
                              .send(user);
      
      expect(response).to.have.status(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('accessToken');

      const decoded = jwt.decode(response.body.accessToken);

      expect(decoded).to.have.property('_id');
      expect(decoded).to.have.property('email');
      expect(decoded.email).to.equal(user.email);
    });

    it('should send an error object with a message and a 400 status code (invalid email)', async function () {
      const user = { email: 'dimitri@gmail.com', password: 'secret' };
      const response = await chai
                              .request(app)
                              .post('/login')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('login');
      expect(response.body.errors.login.message).to.equal('Invalid email/password');
    });

    it("should send an error object with a message and a 400 status code (invalid password)", async function () {
      const user = { email: 'dimitri@mail.com', password: 'secrets' };
      const response = await chai
                              .request(app)
                              .post('/login')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('login');
      expect(response.body.errors.login.message).to.equal('Invalid email/password');
    });

    it('should send an error object with a message and a 400 status code (invalid email and password)', async function () {
      const user = { email: 'dimitri@gmail.com', password: 'secrets' };
      const response = await chai
                              .request(app)
                              .post('/login')
                              .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('login');
      expect(response.body.errors.login.message).to.equal('Invalid email/password');
    });

    it('should send an error object (wrong format email', async function () {
      const user = { email: {email: 'dwi@test.com'}, password: 'secrets' };
      const response = await chai
                              .request(app)
                              .post('/login')
                              .send(user);
      expect(response).to.have.status(500);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('message');
    });

    it('should send array of All User', async function () {
      const response = await chai
                              .request(app)
                              .get('/users')
      expect(response).to.have.status(200);
      expect(response.body).to.be.an("array");
    });
  });
});
