'use strict'

/*
|--------------------------------------------------------------------------
| AdminSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Adonis/Acl/Role')
const User = use('App/Models/User')
const Hash = use('Hash')

class AdminSeeder {
  async run () {
    // Create the administrator role.
    const roleAdmin = new Role()
    roleAdmin.name = 'Administrator'
    roleAdmin.slug = 'administrator'
    roleAdmin.description = 'manage administration privileges'
    await roleAdmin.save()

    // Create a user.
    const user = await User.create({
      'username': 'admin',
      'email': 'admin@gmail.com',
      'password': 'password'
    })

    // Attach the administrator role to the created user.
    await user.roles().attach([roleAdmin.id])
  }
}

module.exports = AdminSeeder
