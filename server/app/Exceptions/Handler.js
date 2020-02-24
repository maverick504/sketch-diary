'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    if(
      (error.name === 'HttpException' && error.message.startsWith('E_ROUTE_NOT_FOUND')) ||
      (error.name === 'InvalidSessionException' || error.name === 'ForbiddenException' || error.name === 'ModelNotFoundException')
    ) {
      // For security reasons, We don't want the user to know if this is an admin route, so we redirect to a 404 page.
      if(request.request.url.startsWith('/api/')) {
        return response.status(404).send()
      } else {
        return response.redirect('/404')
      }
    } else if(error.name === 'HttpException' && error.message.startsWith('E_GUEST_ONLY')) {
      return response.redirect('/')
    }

    return super.handle(error, { request, response })
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    // ...
  }
}

module.exports = ExceptionHandler
