'use strict'

const { validateAll } = use('Validator')
const Challenge = use('App/Models/Challenge')
const Skill = use('App/Models/Skill')
const ChallengeSkillPoints = use('App/Models/ChallengeSkillPoints')
const ChallengeReference = use('App/Models/ChallengeReference')
const slugify = require('slugify')

class ChallengeController {

  async index ({ request, view }) {
    const challenges = await Challenge.query().paginate(request.get().page, 15)

    return view.render('admin.challenges.index', { challenges: challenges.toJSON() })
  }

  async create ({ request, view }) {
    return view.render('admin.challenges.create')
  }

  async store ({ session, request, response }) {
    const rules = {
      title: 'required',
      difficulty_level: 'required|in:beginner,medium,advanced',
      estimated_time: 'required|in:5,10,15,20,25,30,45,60',
      body: 'required'
    }

    const { title, difficulty_level, estimated_time, body, status } = request.only([ 'title', 'difficulty_level', 'estimated_time', 'body', 'status' ])

    // Validate the fields in the request
    const validation = await validateAll({ title, difficulty_level, estimated_time, body, status }, rules)

    if (!validation.fails()) {
      // Store the challenge on database.
      const challenge = new Challenge()
      challenge.title = title
      challenge.slug = slugify(title)
      challenge.difficulty_level = difficulty_level
      challenge.estimated_time = estimated_time
      challenge.body = body
      challenge.status = 'draft'
      await challenge.save()

      return response.redirect(`/admin/challenges/${challenge.id}/edit`)
    } else {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }
  }

  async edit ({ request, params, view }) {
    // Get the required challenge
    const challenge = await Challenge.findOrFail(params.id)

    return view.render('admin.challenges.edit.details', { challenge: challenge })
  }

  async update ({ session, request, params, response }) {
    // Get the required challenge
    const challenge = await Challenge.query().with('skillPoints').where('id', '=', params.id).firstOrFail()

    const rules = {
      title: 'required',
      difficulty_level: 'required|in:beginner,medium,advanced',
      estimated_time: 'required|in:5,10,15,20,25,30,45,60',
      body: 'required',
      status: 'required|in:draft,pending,published'
    }

    const { title, difficulty_level, estimated_time, body, status } = request.only([ 'title', 'difficulty_level', 'estimated_time', 'body', 'status' ])

    // Validate the fields in the request
    const validation = await validateAll({ title, difficulty_level, estimated_time, body, status }, rules)

    if (!validation.fails()) {
      if (status === 'pending' || status === 'published') {
        const challengeSkillPoints = challenge.getRelated('skillPoints')
        if(challengeSkillPoints.rows.length === 0) {
          session.flash({ notification: {
            message: `Cannot change status to ${status} because the challenge doesn't have skill points yet.`,
            type: 'error'
          } })

          return response.redirect('back')
        }
      }

      challenge.title = title
      challenge.slug = slugify(title)
      challenge.difficulty_level = difficulty_level
      challenge.estimated_time = estimated_time
      challenge.body = body
      challenge.status = status
      await challenge.save()

      return response.redirect(`/admin/challenges/${challenge.id}/edit`)
    } else {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }
  }

  async editSkillPoints ({ request, params, view }) {
    // Get all the skills to populate skill select
    const skills = await Skill.all()

    // Get the required challenge
    const challenge = await Challenge.findOrFail(params.id)

    // Get the required challenge
    const challengeSkillPoints = await ChallengeSkillPoints.query().with('skill').where('challenge_id', '=', challenge.id).fetch()

    return view.render('admin.challenges.edit.skillPoints', {
      skills: skills,
      challenge: challenge,
      challengeSkillPoints: challengeSkillPoints.toJSON()
    })
  }

  async addSkillPoints ({ session, request, params, response }) {
    // Get the required challenge
    const challenge = await Challenge.findOrFail(params.id)

    if (challenge.status === 'pending' || challenge.status === 'published') {
      session.flash({ notification: {
        message: `Cannot modify skill points because the challenge was already published.`,
        type: 'error'
      } })

      return response.redirect('back')
    }

    const rules = {
      skill_id: 'required',
      points: 'required'
    }

    const { skill_id, points } = request.only([ 'skill_id', 'points' ])

    // Validate the fields in the request
    const validation = await validateAll({ skill_id, points }, rules)

    if (!validation.fails()) {
      const challengeSkillPoints = new ChallengeSkillPoints()
      challengeSkillPoints.challenge_id = challenge.id
      challengeSkillPoints.skill_id = skill_id
      challengeSkillPoints.points = points
      await challengeSkillPoints.save()

      return response.redirect('back')
    } else {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }
  }

  async removeSkillPoints ({ session, params, response }) {
    // Get the relationship with the challenge and the skill
    const relationship = await ChallengeSkillPoints.findOrFail(params.id)

    // Get the challenge
    const challenge = await Challenge.findOrFail(relationship.challenge_id)

    if (challenge.status === 'pending' || challenge.status === 'published') {
      session.flash({ notification: {
        message: `Cannot modify skill points because the challenge was already published.`,
        type: 'error'
      } })

      return response.redirect('back')
    }

    // Delete relation
    await relationship.delete()

    return response.redirect('back')
  }

  async editReferences ({ request, params, view }) {
    // Get the required challenge
    const challenge = await Challenge.findOrFail(params.id)

    // Get the required challenge
    const challengeReferences = await ChallengeReference.query().where('challenge_id', '=', challenge.id).fetch()

    return view.render('admin.challenges.edit.references', {
      challenge: challenge,
      challengeReferences: challengeReferences
    })

  }
  async addReference ({ session, request, params, response }) {
    // Get the required challenge
    const challenge = await Challenge.findOrFail(params.id)

    const rules = {
      image_url: 'required|max:2048',
      site_name: 'required|max:256',
      origin_url: 'required|max:2048'
    }

    const { image_url, site_name, origin_url } = request.only([ 'image_url', 'site_name', 'origin_url' ])

    // Validate the fields in the request
    const validation = await validateAll({ image_url, site_name, origin_url }, rules)

    if (!validation.fails()) {
      const challengeReference = new ChallengeReference()
      challengeReference.challenge_id = challenge.id
      challengeReference.image_url = image_url
      challengeReference.site_name = site_name
      challengeReference.origin_url = origin_url
      await challengeReference.save()

      return response.redirect('back')
    } else {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }
  }

  async removeReference ({ params, response }) {
    // Get the reference
    const reference = await ChallengeReference.findOrFail(params.id)

    // Delete the reference
    await reference.delete()

    return response.redirect('back')
  }

}

module.exports = ChallengeController
