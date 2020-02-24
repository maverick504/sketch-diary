'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SnapMediaSchema extends Schema {
  up () {
    this.create('snap_media', (table) => {
      table.bigIncrements()
      table.bigInteger('snap_id').unsigned().nullable()
      table.integer('order').unsigned().nullable()
      table.json('variations').nullable()
      table.integer('storage_usage').notNullable().unsigned().default(0) // The storage used by all the variations.
      table.timestamp('created_at').notNullable()

      table.foreign('snap_id').references('id').on('snaps').onDelete('cascade')
    })
  }

  down () {
    this.drop('snap_media')
  }
}

module.exports = SnapMediaSchema
