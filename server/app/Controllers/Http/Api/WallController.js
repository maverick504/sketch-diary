'use strict'

const Database = use('Database')
const Snap = use('App/Models/Snap')

class WallController {

  async global ({ request, auth }) {
    var query = Snap.query()

    if(auth.user) {
      query.select([
        'snaps.*',
        Database.raw("IF((snap_feedback_messages.id IS NOT NULL), 1, 0) AS logged_in_user_gived_feedback")
      ])
      .leftJoin('snap_feedback_messages', function () {
        this
        .on('snap_feedback_messages.snap_id', 'snaps.id')
        .on('snap_feedback_messages.user_id', auth.user.id)
      })
      .with('user', (builder) => {
        builder
        .select([
          'users.*',
          Database.raw("IF((`user_follows`.`id` IS NOT NULL AND `user_follows`.`deleted_at` IS NULL), 1, 0) AS logged_in_user_is_follower")
        ])
        .leftJoin('user_follows', function () {
          this.on('user_follows.followed_id', 'users.id')
          this.on('user_follows.follower_id', auth.user.id)
        })
      })
    } else {
      query.select([
        'snaps.*'
      ])
      .with('users')
    }

    query
    .with('userChallengePivot.challenge')
    .with('media')
    .orderBy('snaps.id', 'DESC')

    return query.paginate(request.get().page, 8)
  }

  async friends ({ request, auth }) {
    var query = Snap.query()

    query.select([
      'snaps.*',
      Database.raw("IF((snap_feedback_messages.id IS NOT NULL), 1, 0) AS logged_in_user_gived_feedback")
    ])
    .leftJoin('snap_feedback_messages', function () {
      this
      .on('snap_feedback_messages.snap_id', 'snaps.id')
      .on('snap_feedback_messages.user_id', auth.user.id)
    })
    .join('user_follows', function () {
      this
      .on('followed_id', 'snaps.user_id')
      .on('follower_id', auth.user.id)
    })
    .with('user', (builder) => {
      builder
      .select([
        'users.*',
        Database.raw("1 AS logged_in_user_is_follower")
      ])
    })
    .with('userChallengePivot.challenge')
    .with('media')
    .whereNull('user_follows.deleted_at')
    .orderBy('snaps.id', 'DESC')

    return query.paginate(request.get().page, 8)
  }

}

module.exports = WallController
