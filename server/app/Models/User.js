'use strict'

const Model = use('Model')
const Hash = use('Hash')
const uuid = require('uuid/v4')

class User extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:CastAttributes')
    this.addTrait('@provider:Adonis/Acl/HasRole')
    this.addTrait('@provider:Adonis/Acl/HasPermission')
    this.addTrait('HasMedia', {
      modelFolderName: 'users',
      collections: {
        avatar: {
          columnName: 'avatar',
          variations: {
            'small': { width: 50, height: 50, force: true },
            'large': { width: 300, height: 300, force: true }
          }
        }
      }
    })

    /**
     * A hook to hash the password before creating the user
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.password = await Hash.make(userInstance.password)
      userInstance.provider = userInstance.provider || 'local'
      userInstance.email_confirmation_token = (userInstance.provider === 'local' ? uuid() : null)
    })
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      avatar: 'json'
    }
  }

  static get dates() {
    return super.dates.concat([ 'upgraded_premium_at' ])
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Hide password when user is fetched.
   */
  static get hidden () {
    return [ 'password' ]
  }

  challenges () {
    return this.belongsToMany('App/Models/Challenge')
    .pivotModel('App/Models/UserChallenge')
    .withPivot([ 'time_taken', 'status' ])
  }
}

module.exports = User
