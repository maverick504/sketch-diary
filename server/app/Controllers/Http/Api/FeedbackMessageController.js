'use strict'

const { validateAll } = use('Validator')
const FeedbackMessage = use('App/Models/FeedbackMessage')
const Antl = use('Antl')

class FeedbackMessageController {

  async store({ request, auth, response }) {
    const validationRules = {
      type: `required|in:challenge-suggestion,other-suggestion,bug-report,feature-request,other`,
      details: `required|max:5000`,
      origin_url: `max:2083`
    }

    const validationMessages = {
      // type
      'type.required': Antl.formatMessage('validations.generic.required', { field: 'type' }),
      'type.in': Antl.formatMessage('validations.generic.in', { field: 'type' }),
      // details
      'details.required': Antl.formatMessage('validations.generic.required', { field: 'details' }),
      'details.max': Antl.formatMessage('validations.generic.maxChar', { field: 'details', max: 5000 }),
      // origin_url
      'origin_url.max': Antl.formatMessage('validations.generic.maxChar', { field: 'origin_url', max: 2083 })
    }

    // Validate the fields in the request
    const validation = await validateAll([ request.type, request.details, request.origin_url ], validationRules, validationMessages)

    if (!validation.fails()) {
      try {
        const message = new FeedbackMessage()
        message.user_id = auth.user.id
        message.type = request.type
        message.details = request.details
        message.origin_url = request.origin_url
        message.metadata = {}
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

module.exports = FeedbackMessageController
