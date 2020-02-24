'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChallengeReferencesSchema extends Schema {
  up () {
    this.create('challenge_references', (table) => {
      table.bigIncrements()
      table.bigInteger('challenge_id').notNullable().unsigned()
      table.string('image_url', 2048).notNullable().nullable()
      table.string('site_name', 256).nullable()
      table.string('origin_url', 2048).nullable()
      table.timestamps()

      table.foreign('challenge_id').references('id').on('challenges').onDelete('cascade')
    })
  }

  down () {
    this.drop('challenge_references')
  }
}

module.exports = ChallengeReferencesSchema
