'use strict'

/*
|--------------------------------------------------------------------------
| ChallengeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Skill = use('App/Models/Skill')

class ChallengeSeeder {
  async run () {
    const skills = await Skill.all()

    if(skills.rows.length == 0) {
      return
    }

    for (let i = 0; i < 25; i++) {
      const challenge = await Factory.model('App/Models/Challenge').create()

      let skillsIds = []
      const totalSkills = Math.floor(Math.random() * 3)

      while (skillsIds.length < totalSkills) {
        const skill = skills.rows[Math.floor(Math.random() * skills.rows.length)]

        if(!(skill.id in skillsIds)) {
          skillsIds.push(skill.id)
        }
      }

      await challenge.skillPoints().sync(skillsIds, (row) => {
        row.points = 5
      })
    }
  }
}

module.exports = ChallengeSeeder
