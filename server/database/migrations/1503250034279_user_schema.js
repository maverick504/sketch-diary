'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.json('avatar').nullable()
      table.string('username', 20).notNullable().unique().index()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('provider').notNullable()
      table.string('email_confirmation_token').nullable()
      table.timestamp('email_confirmed_at').nullable()
      table.string('password_reset_token').nullable()
      table.timestamp('upgraded_premium_at').nullable()
      table.enum('gender', ['male', 'female']).nullable()
      table.string('location').nullable()
      table.text('about').nullable()
      table.integer('completed_challenges_count').notNullable().unsigned().default(0)
      table.integer('received_skill_points_count').notNullable().unsigned().default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
