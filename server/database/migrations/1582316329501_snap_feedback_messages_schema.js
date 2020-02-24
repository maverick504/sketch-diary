'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SnapFeedbackMessagesSchema extends Schema {
  up () {
    this.create('snap_feedback_messages', (table) => {
      table.bigIncrements()
      table.integer('user_id').unsigned().notNullable()
      table.bigInteger('snap_id').unsigned().notNullable()
      table.specificType('score', 'tinyint(5)').unsigned().notNullable()
      table.string('details', 500).nullable()
      table.timestamp('created_at')

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.foreign('snap_id').references('id').on('snaps').onDelete('cascade')
    })
  }

  down () {
    this.drop('snap_feedback_messages')
  }
}

module.exports = SnapFeedbackMessagesSchema
