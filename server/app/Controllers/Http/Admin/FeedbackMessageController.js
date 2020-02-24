'use strict'

const FeedbackMessage = use('App/Models/FeedbackMessage')

class FeedbackMessageController {

  async index ({ request, view }) {
    const feedbackMessages = await FeedbackMessage.query().with('user').paginate(request.get().page, 15)

    return view.render('admin.feedbackMessages.index', { feedbackMessages: feedbackMessages.toJSON() })
  }

}

module.exports = FeedbackMessageController
