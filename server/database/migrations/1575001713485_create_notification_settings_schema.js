'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserNotificationSettingsSchema extends Schema {
  up () {
    this.create('notification_settings', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
      table.timestamps()

      table.foreign('user_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('notification_settings')
  }
}

module.exports = UserNotificationSettingsSchema
