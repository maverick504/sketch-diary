'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ChallengeSkillPoints extends Model {
  static get table () {
    return 'challenge_skills'
  }

  skill() {
    return this.belongsTo('App/Models/Skill', 'skill_id', 'id')
  }
}

module.exports = ChallengeSkillPoints
