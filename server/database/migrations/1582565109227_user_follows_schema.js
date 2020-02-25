'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserFollowsSchema extends Schema {
  up () {
    this.create('user_follows', (table) => {
      table.bigIncrements()
      table.integer('follower_id').unsigned().notNullable()
      table.integer('followed_id').unsigned().notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('deleted_at').nullable()

      table.foreign('follower_id').references('id').on('users').onDelete('cascade')
      table.foreign('followed_id').references('id').on('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('user_follows')
  }
}

module.exports = UserFollowsSchema
