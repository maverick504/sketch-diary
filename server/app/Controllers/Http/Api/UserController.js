'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const UserFollow = use('App/Models/UserFollow')

class UserController {

  async show({ params, auth }) {
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    if(auth.user) {
      // Check if the authenticated user is following this user.
      // user.logged_in_user_is_follower = await auth.user.following(user.id)
    }

    return user
  }

  async followers({ request, params }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    // Return followers
    return await UserFollow
    .query()
    .with('follower')
    .where('followed_id', '=', user.id)
    .paginate(request.get().page, 15)
  }

  async followings({ request, params }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    // Return followings
    return await UserFollow
    .query()
    .with('followed')
    .where('follower_id', '=', user.id)
    .paginate(request.get().page, 15)
  }

  async follow({ params, auth, response }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    if(auth.user.id === user.id) {
      return response.status(400).json({
        status: 'error',
        message: "You can't follow yourself."
      })
    }

    // try {
      // Check if the user was followed previously.
      const followRelation = await UserFollow
      .query()
      .withTrashed()
      .where('follower_id', '=', auth.user.id)
      .where('followed_id', '=', user.id)
      .first()

      if(followRelation) {
        await followRelation.restore()
      } else {
        // Create a 'follow' relationship between the user and the post.
        await user.followers().attach([auth.user.id])
      }

      // Recount followers.
      await user.countFollowers()

      // Recount followings.
      await auth.user.countFollowings()
    // } catch(error) {
    //   return response.status(400).json({
    //     status: 'error',
    //     message: 'Something went wrong, please try again.'
    //   })
    // }
  }

  async unfollow({ params, auth, response }) {
    // Check if the user exists.
    const user = await User.query().where('username', '=', params.username).firstOrFail()

    // Detach the follower.
    await user.followers().detach([auth.user.id])

    // Recount followers.
    await user.countFollowers()

    // Recount followings.
    await auth.user.countFollowings()
  }

}

module.exports = UserController
