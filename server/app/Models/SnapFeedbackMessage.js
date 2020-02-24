'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SnapFeedbackMessage extends Model {
  static boot () {
    super.boot()

    /**
     * Recount feedback messages on the related snap after the message is created.
     */
    this.addHook('afterCreate', async (feedbackMessageInstance) => {
      const snap = await feedbackMessageInstance.snap().first()
      await snap.countFeedbackMessages()
    })
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

module.exports = SnapFeedbackMessage
