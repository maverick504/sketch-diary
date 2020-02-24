'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NotificationSettings extends Model {
  static get table () {
    return 'notification_settings'
  }
}

module.exports = NotificationSettings
