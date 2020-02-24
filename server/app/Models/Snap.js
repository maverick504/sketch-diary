'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Snap extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:CastAttributes')
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      logged_in_user_gived_feedback: 'boolean'
    }
  }

  static get createdAtColumn () {
    return 'created_at'
  }

  static get updatedAtColumn () {
    return null
  }

  async countFeedbackMessages () {
    const query = await this.feedbackMessages().count()
    const total = query[0]['count(*)'] || 0

    this.feedback_messages_count = total

    await this.save()
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  userChallengePivot () {
    return this.belongsTo('App/Models/UserChallenge')
  }

  media () {
    return this.hasMany('App/Models/SnapMedia')
  }

  feedbackMessages () {
    return this.hasMany('App/Models/SnapFeedbackMessage')
  }
}

module.exports = Snap
