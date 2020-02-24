'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSkillsSchema extends Schema {
  up () {
    this.create('user_skills', (table) => {
      table.bigIncrements()
      table.integer('user_id').notNullable().unsigned()
      table.integer('skill_id').notNullable().unsigned()
      table.integer('received_skill_points_count').notNullable().unsigned().default(0)
      table.timestamps()

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.foreign('skill_id').references('id').on('skills').onDelete('cascade')
    })
  }

  down () {
    this.drop('user_skills')
  }
}

module.exports = UserSkillsSchema
