'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserFollow extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return 'updated_at'
  }

  follower() {
    return this.belongsTo('App/Models/User', 'follower_id', 'id')
  }

  followed() {
    return this.belongsTo('App/Models/User', 'followed_id', 'id')
  }
}

module.exports = UserFollow
