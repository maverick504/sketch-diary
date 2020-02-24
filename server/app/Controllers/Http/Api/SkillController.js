'use strict'

const Skill = use('App/Models/Skill')

class SkillController {

  async index ({ request }) {
    return await Skill.query().paginate(request.get().page, 25)
  }

  async main () {
    return await Skill.query().whereNull('parent_skill_id').fetch()
  }

}

module.exports = SkillController
