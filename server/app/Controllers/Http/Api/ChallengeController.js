'use strict'

const { validateAll } = use('Validator')
const Database = use('Database')
const Challenge = use('App/Models/Challenge')
const UserChallenge = use('App/Models/UserChallenge')
const UserSkill = use('App/Models/UserSkill')

class ChallengeController {

  async index ({ request, auth }) {
    var query = Challenge.query().where('challenges.status', '=', 'published')

    if(auth.user) {
      query.select([
        'challenges.*',
        'user_challenges.status AS completion_status'
      ])
      .leftJoin('user_challenges', function () {
        this
        .on('user_challenges.challenge_id', 'challenges.id')
        .on('user_challenges.user_id', auth.user.id)
      })
    } else {
      query.select([ 'challenges.*' ])
    }

    const skillId = request.get().skill_id

    if(skillId) {
      query.leftJoin('challenge_skills', 'challenge_skills.challenge_id', '=', 'challenges.id')
      query.where('challenge_skills.skill_id', '=', skillId)
    }

    return query.orderBy('challenges.id')
    .paginate(request.get().page, 8)
  }

  async show ({ request, auth, params }) {
    var query = Challenge.query().where('challenges.status', '=', 'published')

    const _with = request.get().with

    // Parse the required relationships from the url params
    if(_with) {
      const validRelations = [ 'skillPoints', 'references' ]

      const relations = _with.split(",")

      // Limit relations
      if(relations.length > validRelations.length) {
        return response.status(400).json({
          status: 'error',
          message: 'Too many relations.'
        })
      }

      // Filter relations and keep only valid relations.
      for(var i=0; i<relations.length; i++) {
        if(validRelations.includes(relations[i])) {
          query.with(relations[i])
        }
      }
    }

    const challenge = await query.where('id', '=', params.id).firstOrFail()

    // Check if the authenticated user has a relationship with this challenge
    if(auth.user) {
      challenge.userRelationship = await UserChallenge.query()
      .with('snap')
      .where('user_id', '=', auth.user.id)
      .where('challenge_id', '=', challenge.id)
      .orderBy('updated_at', 'DESC') // Users can complete a challenge many times, but we want the latest relationship.
      .first()
    }

    return challenge
  }

  async markAsComplete ({ request, auth, params, response }) {
    const challenge = await Challenge.query()
    .where('id', '=', params.id)
    .where('challenges.status', '=', 'published')
    .firstOrFail()

    // Prevent users from completing the same challenge multiple times.
    const timesCompleted = await UserChallenge.query()
    .where('user_id', '=', auth.user.id)
    .where('challenge_id', '=', challenge.id)
    .count()

    if(timesCompleted[0]['count(*)'] > 0) {
      return response.status(400).send({
        message: 'Challenge already completed!'
      })
    }

    const rules = {
      time_taken: 'required|integer|min:0',
    }

    const { time_taken } = request.only([ 'time_taken' ])

    // Validate the fields in the request
    const validation = await validateAll({ time_taken }, rules)

    if (!validation.fails()) {
      const userChallengeRelationship = UserChallenge.create({
        user_id: auth.user.id,
        challenge_id: challenge.id,
        status: 'snap-required',
        time_taken: time_taken
      })

      return userChallengeRelationship
    } else {
      response.status(400).send(validation.messages())
    }
  }

}

module.exports = ChallengeController
