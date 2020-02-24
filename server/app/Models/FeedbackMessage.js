'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FeedbackMessage extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:CastAttributes')
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      metadata: 'json'
    }
  }

  static get createdAtColumn () {
    return 'created_at'
  }

  static get updatedAtColumn () {
    return null
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  snap () {
    return this.belongsTo('App/Models/Snap')
  }
}

module.exports = FeedbackMessage
