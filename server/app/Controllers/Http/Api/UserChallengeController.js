'use strict'

const { validateAll } = use('Validator')
const UserChallenge = use('App/Models/UserChallenge')

class UserChallengeController {

  async show ({ request, auth, params }) {
    var query = auth.user.challenges()

    const _with = request.get().with

    // Parse the required relationships from the url params
    if(_with) {
      const relations = _with.split(",")

      // Limit relations
      if(relations.length > 5) {
        return response.status(400).json({
          status: 'error',
          message: 'Too many relations.'
        })
      }

      // Filter relations and keep only valid relations.
      for(var i=0; i<relations.length; i++) {
        if([ 'skillPoints', 'references' ].includes(relations[i])) {
          query.with(relations[i])
        }
      }
    }

    return await query.where('user_challenges.id', '=', params.id).firstOrFail()
  }

  async destroy ({ auth, params, response }) {
    const relationship = await UserChallenge.query()
    .where('user_challenges.id', '=', params.id)
    .where('user_challenges.user_id', '=', auth.user.id)
    .firstOrFail()

    switch(relationship.status) {
      case 'snap-required':
        // Delete the relationship
        await relationship.delete()

        // Return a success message
        return response.json({
          status: 'success'
        })

        break
      case 'receiving-feedback':
        // ...

        break
      case 'completed':
        // ...

        break
    }
  }

}

module.exports = UserChallengeController
