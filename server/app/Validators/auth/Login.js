'use strict'

const Antl = use('Antl')

class Login {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required',
      password: 'required'
    }
  }

  get messages () {
    return {

      'email.required': Antl.formatMessage('validations.auth.login.email.required'),

      'password.required': Antl.formatMessage('validations.auth.login.password.required')

    }
  }

}

module.exports = Login
