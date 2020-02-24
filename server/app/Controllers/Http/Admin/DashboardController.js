'use strict'

const User = use('App/Models/User')

class DashboardController {

  async index ({ view }) {
    const countUsers = await User.query().count()
    const totalUsers = countUsers[0]['count(*)']

    const countPremiumUsers = await User.query().whereNotNull('upgraded_premium_at').count()
    const totalPremiumUsers = countPremiumUsers[0]['count(*)']

    const latestRegisteredUsers = await User.query().orderBy('created_at', 'desc').limit(10).fetch()

    return view.render('admin.dashboard', {
      totalUsers: totalUsers,
      totalPremiumUsers: totalPremiumUsers,
      latestRegisteredUsers: latestRegisteredUsers.toJSON()
    })
  }

}

module.exports = DashboardController
