'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChallengesSchema extends Schema {
  up () {
    this.create('challenges', (table) => {
      table.bigIncrements()
      table.string('title').notNullable()
      table.string('slug').notNullable()
      table.enum('difficulty_level', [ 'beginner', 'medium', 'advanced' ]).notNullable()
      table.text('estimated_time').nullable()
      table.text('body').notNullable()
      table.enum('status', [ 'draft', 'pending', 'published' ]).notNullable().default('draft')
      table.timestamps()
    })
  }

  down () {
    this.drop('challenges')
  }
}

module.exports = ChallengesSchema
