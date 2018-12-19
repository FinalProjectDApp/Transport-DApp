const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;

var isEmail = function(val) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
}

const userSchema = new Schema({
    email:  {
        type: String,
        unique: [true, `Duplicate email`],
        required: [true, 'Email is required'],
        validate: [isEmail, 'Please input correct email']
    },
    password: {
        type: String,
        minlength:[6, 'password min 6 character'],
        required: [true, 'Password is required']
    }
});

userSchema.pre('save', function(next){
    var salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    next()
  })

var User = mongoose.model('User', userSchema)

module.exports = User;