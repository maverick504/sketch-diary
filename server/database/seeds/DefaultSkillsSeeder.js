'use strict'

/*
|--------------------------------------------------------------------------
| DefaultSkillsSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const ColorHash = require('color-hash')

class DefaultSkillsSeeder {
  async run () {
    // Colors are generated using an algorithm wich generates a color based on the slug.
    // Take a look at: https://github.com/zenozeng/color-hash

    var colorHash = new ColorHash({ lightness: 0.7 });

    await Database.table('skills').insert({
      name: 'Anatomy',
      short_name: 'Anatomy',
      slug: 'anatomy',
      color: colorHash.hex('anatomy')
    })

    await Database.table('skills').insert({
      name: 'Objects',
      short_name: 'Objects',
      slug: 'objects',
      color: colorHash.hex('objects')
    })

    await Database.table('skills').insert({
      name: 'Backgrounds',
      short_name: 'Backgrounds',
      slug: 'backgrounds',
      color: colorHash.hex('backgrounds')
    })

    await Database.table('skills').insert({
      name: 'Lineart',
      short_name: 'Lineart',
      slug: 'lineart',
      color: colorHash.hex('lineart')
    })

    await Database.table('skills').insert({
      name: 'Coloring',
      short_name: 'Coloring',
      slug: 'coloring',
      color: colorHash.hex('coloring')
    })

    await Database.table('skills').insert({
      name: 'Character design',
      short_name: 'Char. design',
      slug: 'character-design',
      color: colorHash.hex('character-design')
    })
  }
}

module.exports = DefaultSkillsSeeder
