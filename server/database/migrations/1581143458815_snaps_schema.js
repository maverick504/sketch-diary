'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SnapsSchema extends Schema {
  up () {
    this.create('snaps', (table) => {
      table.bigIncrements()
      table.integer('user_id').unsigned().notNullable()
      table.bigInteger('user_challenge_id').unsigned().nullable()
      table.enum('aspect_ratio', [ '9:16', '1:1' ]).notNullable()
      table.integer('media_count').notNullable().unsigned().default(0)
      table.integer('storage_usage_count').notNullable().unsigned().default(0) // The size of all the media variations.
      table.integer('views_count').notNullable().unsigned().default(0)
      table.integer('feedback_messages_count').notNullable().unsigned().default(0)
      table.timestamp('created_at').notNullable()

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.foreign('user_challenge_id').references('id').on('user_challenges').onDelete('set null')
    })
  }

  down () {
    this.drop('snaps')
  }
}

module.exports = SnapsSchema
