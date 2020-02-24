'use strict'

const { BasePresenter } = require('edge.js')

class Index extends BasePresenter {

  get user () {
    const user = this.$data.user

    user.premium_member = user.upgraded_premium_at ? `since ${user.upgraded_premium_at}` : 'no'

    const usageMB = (user.total_storage_usage / 1024 / 1024)
    user.storage_usage_mb = usageMB.toFixed(2) + 'MB'

    return user
  }

}

module.exports = Index
