'use strict'

const { validateAll } = use('Validator')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Database = use('Database')
const Snap = use('App/Models/Snap')
const SnapMedia = use('App/Models/SnapMedia')
const UserChallenge = use('App/Models/UserChallenge')

class SnapController {

  async index ({ request, auth }) {
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
    } else {
      query.select([
        'snaps.*'
      ])
    }

    query
    .with('user')
    .with('userChallengePivot.challenge')
    .with('media')
    .orderBy('snaps.id', 'DESC')

    return query.paginate(request.get().page, 8)
  }

  async userIndex ({ request, auth }) {
    return Snap.query()
    .select('snaps.*')
    .with('userChallengePivot')
    .with('media')
    .where('snaps.user_id', '=', auth.user.id)
    .orderBy('snaps.id', 'DESC')
    .paginate(request.get().page, 8)
  }

  async show ({ params, auth }) {
    var query = Snap.query()
    .with('user')
    .with('userChallengePivot.challenge')
    .with('media')
    .where('snaps.id', '=', params.id)

    if(auth.user) {
      query.select([
        'snaps.*'
      ])
    } else {
      query.select([
        'snaps.*'
      ])
    }

    return query.firstOrFail()
  }

  async store({ request, auth, response }) {
    const rules = {
      user_challenge_id: `required|exists:user_challenges,id`,
      aspect_ratio: `required|validAspectRatio`
    }

    const { user_challenge_id, aspect_ratio } = request.only([ 'user_challenge_id', 'aspect_ratio' ])

    // Validate the fields in the request
    const validation = await validateAll({ user_challenge_id, aspect_ratio }, rules)

    if (!validation.fails()) {
      // Get the user-challenge pivot.
      const userChallenge = await UserChallenge.query()
      .where('id', '=', user_challenge_id)
      .where('user_id', '=', auth.user.id)
      .orderBy('created_at', 'ASC')
      .first()

      if (!userChallenge) {
        return response.status(400).json({
          status: 'error',
          message: 'The user-challenge pivot is not valid'
        })
      }

      // Check if the user-challenge pivot is already related to a snap.
      const snapCount = await Database.from('snaps')
      .where('user_challenge_id', '=', userChallenge.id)
      .count()

      if (snapCount[0]['count(*)'] > 0) {
        return response.status(400).json({
          status: 'error',
          message: 'Another snap is already related to this user-challenge pivot'
        })
      }

      // The image will be moved to a temporal path before being streamed to the cloud
      const image = request.file('image', {
        types: [ 'jpeg', 'jpg', 'png' ],
        size: '5mb'
      })

      if(!image) {
        return response.status(400).json({
          status: 'error',
          message: 'An image file is required'
        })
      }

      const tmpFolder = Helpers.tmpPath('uploads')
      const tmpFilename = new Date().valueOf() + '.jpg'
      const tmpPath = tmpFolder + '/' + tmpFilename

      // Try to move the image to a temporal path
      await image.move(tmpFolder, {
        name: tmpFilename,
        overwrite: true
      })

      if (!image.moved()) {
        return response.status(400).json({
          status: 'error',
          message: image.error().message
        })
      }

      // Try to store the create the post and his media.
      const trx = await Database.beginTransaction()

      try {
        // Store a new snap on database.
        const snap = new Snap()
        snap.user_id = auth.user.id
        snap.user_challenge_id = userChallenge.id
        await snap.save(trx)

        // Store one row for the snaps's media.
        const media = new SnapMedia()
        media.snap_id = snap.id
        media.order = 1
        await media.save(trx)

        // Update collection variations according to selected aspect ratio.
        media.setCollection('image', {
          columnName: 'variations',
          variations: {
            '1080w': { width: 1080, height: aspect_ratio === '9:16' ? 1920 : 1080, force: true },
            '540w': { width: 540, height: aspect_ratio === '9:16' ? 960 : 540, force: true },
            '320x320f': { width: 320, height: 320, force: true },
            '38x38f': { width: 38, height: 38, force: true }
          }
        })

        // Store the image image on the cloud.
        const stream = Drive.disk('local').getStream(tmpPath)
        await media.storeVariations('image', stream, false)

        // Calculate the total storage used by media.
        media.storage_usage = media.calculateCollectionStorageUsage('image')
        await media.save(trx)

        // Change the user-challenge pivot status to 'receiving-feedback'.
        userChallenge.status = 'receiving-feedback'
        await userChallenge.save(trx)

        trx.commit()
      } catch(error) {
        trx.rollback()

        return response.status(500).json({
          status: 'error',
          message: 'Something went wrong, please try again.'
        })
      }
    } else {
      response.status(400).send(validation.messages())
    }
  }

  async destroy ({ params, auth, response }) {
    // Get the required snap
    const snap = await Snap.findOrFail(params.id)

    // Check if the snap is owned by the authenticated user
    if(snap.user_id !== auth.user.id) {
      return response.status(400).json({
        status: 'error',
        message: "You cannot delete this snap because you don't own it."
      })
    }

    // Get the user-challenge pivot related to this snap.
    const userChallenge = await UserChallenge.findOrFail(snap.user_challenge_id)

    // Delete the snap
    await snap.delete()

    // TODO: delete images (the entire image variations folder).
    // ...

    // Update user-challenge pivot status.
    userChallenge.status = 'snap-required'
    await userChallenge.save()

    // Return a success message
    return response.json({
      status: 'success'
    })
  }

  async countView ({ params, response }) {
    await Snap.query()
    .where('snaps.id', '=', params.id)
    .update({
      views_count: Database.raw('snaps.views_count + 1')
    })

    return response.status(200).json({
      status: 'success'
    })
  }

}

module.exports = SnapController
