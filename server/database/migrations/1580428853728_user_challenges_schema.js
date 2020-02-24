'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserCompletedChallengesSchema extends Schema {
  up () {
    this.create('user_challenges', (table) => {
      table.bigIncrements()
      table.integer('user_id').notNullable().unsigned()
      table.bigInteger('challenge_id').notNullable().unsigned()
      table.enum('status', [ 'snap-required', 'receiving-feedback', 'completed', 'snap-deleted' ]).notNullable()
      table.integer('time_taken').notNullable().nullable().unsigned()
      table.integer('total_received_skill_points').notNullable().unsigned().default(0)
      table.timestamps()

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.foreign('challenge_id').references('id').on('challenges').onDelete('cascade')
    })
  }

  down () {
    this.drop('user_challenges')
  }
}

module.exports = UserCompletedChallengesSchema
