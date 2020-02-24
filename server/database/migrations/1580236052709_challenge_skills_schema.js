'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChallengeSkillPointsSchema extends Schema {
  up () {
    this.create('challenge_skills', (table) => {
      table.bigIncrements()
      table.bigInteger('challenge_id').notNullable().unsigned()
      table.integer('skill_id').notNullable().unsigned()
      table.integer('points').notNullable().unsigned().default(0)
      table.timestamps()

      table.foreign('challenge_id').references('id').on('challenges').onDelete('cascade')
      table.foreign('skill_id').references('id').on('skills').onDelete('cascade')
    })
  }

  down () {
    this.drop('challenge_skills')
  }
}

module.exports = ChallengeSkillPointsSchema
