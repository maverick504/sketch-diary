'use strict'

const Antl = use('Antl')

class Register {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|username|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:8'
    }
  }

  get messages () {
    return {

      'username.required': Antl.formatMessage('validations.auth.register.username.required'),
      'username.username': Antl.formatMessage('validations.auth.register.username.username'),
      'username.unique': Antl.formatMessage('validations.auth.register.username.unique'),

      'email.required': Antl.formatMessage('validations.auth.register.email.required'),
      'email.email': Antl.formatMessage('validations.auth.register.email.email'),
      'email.unique': Antl.formatMessage('validations.auth.register.email.unique'),

      'password.required': Antl.formatMessage('validations.auth.register.password.required'),
      'password.min': Antl.formatMessage('validations.auth.register.password.min')

    }
  }

}

module.exports = Register
