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

  async countFollowings () {
    const query = await this.followings().count()
    this.total_followings = query[0]['count(*)'] || 0

    await this.save()
  }

  async countFollowers () {
    const query = await this.followers().count()
    this.total_followers = query[0]['count(*)'] || 0

    await this.save()
  }

  followers () {
    return this.belongsToMany('App/Models/User', 'followed_id', 'follower_id', 'id', 'id')
    .pivotModel('App/Models/UserFollow')
  }

  followings () {
    return this.belongsToMany('App/Models/User', 'follower_id', 'followed_id', 'id', 'id')
    .pivotModel('App/Models/UserFollow')
  }

  challenges () {
    return this.belongsToMany('App/Models/Challenge')
    .pivotModel('App/Models/UserChallenge')
    .withPivot([ 'time_taken', 'status' ])
  }
}

module.exports = User
