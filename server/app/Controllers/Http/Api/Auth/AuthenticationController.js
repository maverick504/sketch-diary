'use strict'

const Database = use('Database')
const Event = use('Event')
const User = use('App/Models/User')
const NotificationSettings = use('App/Models/NotificationSettings')

class AuthenticationController {

  async register({ request, auth, response }) {
    try {
      const trx = await Database.beginTransaction()

      const data = request.only([ 'username', 'email', 'password' ])

      const user = await User.create({
        'username': data.username,
        'email': data.email,
        'password': data.password
      }, trx)

      const notificationSettings = await NotificationSettings.create({
        'user_id': user.id
      }, trx)

      const token = await auth.authenticator('jwt').generate(user)

      trx.commit()

      // Send email validation e-mail.
      Event.fire('AUTH_REGISTER', user)

      return response.json({
        status: 'success',
        data: token
      })
    } catch(error) {
      trx.rollback()
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem creating the user, please try again.'
      })
    }
  }

  async login({ request, auth, response }) {
    const data = request.only([ 'email', 'password' ])

    try {
      const token = await auth.authenticator('jwt').attempt(data.email, data.password)
      return response.json({
        status: 'success',
        data: token
      })
    } catch(error) {
      return response.status(400).json({
        status: 'error',
        message: 'Invalid email/password.'
      })
    }
  }

  async me({ auth, response }) {
    return response.json({
      status: 'success',
      data: auth.authenticator('jwt').user
    })
  }

  // Send email with email confirmation token.
  async sendConfirmEmail({ auth, request, response }) {
    // Check if email was already verified.
    if (auth.user.email_confirmed_at) {
      return response.status(400).json({
        status: 'error',
        message: 'Your email is already verified.'
      })
    }

    // Send email confirmation via email.
    Event.fire('AUTH_RESEND_CONFIRMATION', auth.user)

    // Return a success message.
    return response.json({
      status: 'success',
      message: 'Email sent. Check your email inbox.'
    })
  }
}

module.exports = AuthenticationController
