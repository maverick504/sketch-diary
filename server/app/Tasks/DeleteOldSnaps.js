'use strict'

const Task = use('Task')
const Env = use('Env')
const Logger = use('Logger')
const Database = use('Database')

class DeleteOldSnaps extends Task {
  static get schedule () {
    if(Env.get('NODE_ENV') === 'development') {
      return '*/10 * * * * *'
    } else {
      return '0 */10 * * * *'
    }
  }

  async handle () {
    Logger.info('handling DeleteOldSnaps')

    var dateTo = new Date()
    dateTo.setDate(dateTo.getDate() - 7)

    // Convert date to SQL date: https://stackoverflow.com/a/21482470/5854695

    const pad = function (num) {
      return ('00'+num).slice(-2)
    }

    dateTo = dateTo.getUTCFullYear()       + '-' +
             pad(dateTo.getUTCMonth() + 1) + '-' +
             pad(dateTo.getUTCDate())      + ' ' +
             pad(dateTo.getUTCHours())     + ':' +
             pad(dateTo.getUTCMinutes())   + ':' +
             pad(dateTo.getUTCSeconds())

    const query = `
      DELETE snaps FROM snaps
      LEFT JOIN user_challenges ON user_challenges.id = snaps.user_challenge_id
      WHERE snaps.created_at < ? AND user_challenges.status = 'completed'
    `

    await Database.raw(query, [ dateTo ])

    Logger.info('successfully handled DeleteOldSnaps')
  }
}

module.exports = DeleteOldSnaps
