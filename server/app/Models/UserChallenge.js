'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserChallenge extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  challenge () {
    return this.belongsTo('App/Models/Challenge')
  }

  snap () {
    return this.hasOne('App/Models/Snap')
  }
}

module.exports = UserChallenge
