'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SkillsSchema extends Schema {
  up () {
    this.create('skills', (table) => {
      table.increments()
      table.integer('parent_skill_id').nullable().unsigned()
      table.string('name').notNullable()
      table.string('short_name').notNullable()
      table.string('slug').notNullable()
      table.string('color', 7).notNullable()
      table.timestamps()

      table.foreign('parent_skill_id').references('id').on('skills').onDelete('set null')
    })
  }

  down () {
    this.drop('skills')
  }
}

module.exports = SkillsSchema
