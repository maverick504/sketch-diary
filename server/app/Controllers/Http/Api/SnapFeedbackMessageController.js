'use strict'

const { validateAll } = use('Validator')
const SnapFeedbackMessage = use('App/Models/SnapFeedbackMessage')
const Snap = use('App/Models/Snap')
const Antl = use('Antl')

class SnapFeedbackMessageController {

  async snapIndex ({ request, params, auth }) {
    return SnapFeedbackMessage.query()
    .with('user')
    .leftJoin('snaps', 'snaps.id', '=', 'snap_feedback_messages.snap_id')
    .where('snaps.user_id', '=', auth.user.id)
    .where('snaps.id', '=', params.id)
    .orderBy('snap_feedback_messages.created_at', 'DESC')
    .paginate(request.get().page, 8)
  }

  async store({ request, auth, params, response }) {
    // Check if the snap exists
    const snap = await Snap.query()
    .with('userChallengePivot')
    .where('id', '=', params.id)
    .firstOrFail()

    // Check if the snap has been created by the user who is trying to send feedback.
    if (snap.user_id === auth.user.id) {
      return response.status(400).json({
        status: 'error',
        message: "You cannot send feedback to a snap created by yourself!"
      })
    }

    // Check if the snap is still receiving feedback.
    const userChallengePivot = snap.getRelated('userChallengePivot')
    if (userChallengePivot.status !== 'receiving-feedback') {
      return response.status(400).json({
        status: 'error',
        message: "This snap is not receiving feedback anymore!"
      })
    }

    // Check if the user already sent feedback for this snap.
    const feedback = await SnapFeedbackMessage.query()
    .where('snap_feedback_messages.user_id', '=', auth.user.id)
    .where('snap_feedback_messages.snap_id', '=', snap.id)
    .first()

    if (feedback) {
      return response.status(400).json({
        status: 'error',
        message: "You've already sent feedback for this snap!"
      })
    }

    const validationRules = {
      score: `required|integer|min:1|max:5`,
      details: `max:500`
    }

    const validationMessages = {
      // score
      'score.required': Antl.formatMessage('validations.generic.required', { field: 'score' }),
      'score.integer': Antl.formatMessage('validations.generic.integer', { field: 'score' }),
      'score.min': Antl.formatMessage('validations.generic.minVal', { field: 'score', min: 5 }),
      'score.max': Antl.formatMessage('validations.generic.maxVal', { field: 'score', max: 5 }),
      // details
      'details.max': Antl.formatMessage('validations.generic.maxVal', { field: 'details', max: 500 })
    }

    const { score, details } = request.only([ 'score', 'details' ])

    // Validate the fields in the request
    const validation = await validateAll({ score, details }, validationRules, validationMessages)

    if (!validation.fails()) {
      try {
        const message = new SnapFeedbackMessage()
        message.user_id = auth.user.id
        message.snap_id = snap.id
        message.score = score
        message.details = details
        await message.save()

        // Return a success message
        return response.json({
          status: 'success',
          data: message
        })
      } catch(error) {
        return response.status(500).json({
          status: 'error',
          message: Antl.get('messages.errors.500')
        })
      }
    } else {
      response.status(400).send(validation.messages())
    }
  }

}

module.exports = SnapFeedbackMessageController
