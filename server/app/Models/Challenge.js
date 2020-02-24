'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Challenge extends Model {
  skillPoints () {
    return this.belongsToMany('App/Models/Skill')
    .pivotTable('challenge_skills')
    .withPivot([
      'points'
    ])
  }

  references () {
    return this.hasMany('App/Models/ChallengeReference')
  }
}

module.exports = Challenge
