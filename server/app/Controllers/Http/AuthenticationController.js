'use strict'

const { validateAll } = use('Validator')
const Event = use('Event')
const Config = use('Config')
const Hash = use('Hash')
const User = use('App/Models/User')
const uuid = require('uuid/v4')

class AuthenticationController {

  async login({ request, auth, response }) {
    const rules = {
      email: 'required|email',
      password: 'required'
    }

    const { email, password } = request.only(['email', 'password'])

    const validation = await validateAll({ email, password }, rules)

    if (!validation.fails()) {
      try {
        await auth.authenticator('session').attempt(email, password)

        response.redirect('/')
      } catch(error) {
        return response.status(400).json({
          status: 'error',
          message: 'Invalid email/password.'
        })
      }
    } else {
      response.status(400).send(validation.messages());
    }
  }

  async logout ({ auth, response }) {
    await auth.logout()

    response.redirect('/')
  }

  async confirmEmail ({ params, response }) {
    const token = params.token

    // Check if token exists.
    if(!token.length) {
      return response.redirect('/')
    }

    const user = await User.findBy('email_confirmation_token', token)

    // If user exists.
    if(user) {
      user.email_confirmation_token = null
      user.email_confirmed_at = new Date()
      await user.save()
      return 'Account verified, thank you.'
    }

    return 'Email confirmation failed.'
  }

  async forgotPassword ({ request, response }) {
    const rules = {
      email: 'required|email'
    }

    const { email } = request.only(['email'])

    const validation = await validateAll({ email }, rules)

    if(!validation.fails()) {
      const user = await User.findBy('email', email)

      if(!user) {
        // For security reasons, return a success message even if the email isn't valid.
        return 'If the email you entered was right, in a minute you will receive the link to reset the password.'
      }

      // add reset token to user
      user.password_reset_token = uuid()
      await user.save()

      // send verification email
      Event.fire('AUTH_FORGOT_PASSWORD', user)

      return 'If the email you entered was right, in a minute you will receive the link to reset the password.'
    } else {
      response.status(400).send(validation.messages());
    }
  }

  async renderResetPassword ({ params, view }) {
    const token = params.token

    // Check if token exists
    if(!token.length) {
      return 'A token is required to reset password.'
    }

    // Find or fail user by password reset token.
    const user = await User.findBy('password_reset_token', token)
    if(!user) {
      return 'Invalid token.'
    }

    return view.render('auth.resetPassword', { token: token })
  }

  async resetPassword ({ request, response }) {
    const rules = {
      token: 'required',
      new_password: 'required|min:8'
    }

    const { token, new_password } = request.only(['token', 'new_password'])

    const validation = await validateAll({ token, new_password }, rules)

    if(!validation.fails()) {

      // Find or fail user by password reset token.
      const user = await User.findBy('password_reset_token', token)
      if(!user) {
        return 'Invalid token.'
      }

      // Set the user's new password.
      user.password = await Hash.make(new_password)
      user.password_reset_token = null
      await user.save()

      return response.redirect(Config.get('sketchDiary.subdomains.app') + '/login')
    } else {
      response.status(400).send(validation.messages());
    }
  }

}

module.exports = AuthenticationController
