'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const Config = use('Config')

// ADMIN ROUTES

Route.group(() => {

  Route.get('dashboard', 'Admin/DashboardController.index')

  Route.get('challenges', 'Admin/ChallengeController.index')
  Route.get('challenges/create', 'Admin/ChallengeController.create')
  Route.post('challenges', 'Admin/ChallengeController.store')
  Route.get('challenges/:id/edit', 'Admin/ChallengeController.edit')
  Route.patch('challenges/:id', 'Admin/ChallengeController.update')
  Route.get('challenges/:id/edit/skill-points', 'Admin/ChallengeController.editSkillPoints')
  Route.post('challenges/:id/add-skill-points', 'Admin/ChallengeController.addSkillPoints')
  Route.delete('challenge-skill-points/:id', 'Admin/ChallengeController.removeSkillPoints')
  Route.get('challenges/:id/edit/references', 'Admin/ChallengeController.editReferences')
  Route.post('challenges/:id/add-reference', 'Admin/ChallengeController.addReference')
  Route.delete('challenge-references/:id', 'Admin/ChallengeController.removeReference')

  Route.get('feedback', 'Admin/FeedbackMessageController.index')

}).prefix('admin')
.middleware(['auth:session', 'is:(administrator)'])
.middleware('throttle:30,60')

// API ROUTES

Route.group(() => {

  Route.get('/', () => {
    return { app_name: 'sketchDiary', version: '0.1' }
  })

  Route.post('login', 'Api/Auth/AuthenticationController.login').validator('auth/Login')
  Route.post('register', 'Api/Auth/AuthenticationController.register').validator('auth/Register')
  Route.get('me', 'Api/Auth/AuthenticationController.me').middleware(['auth:jwt'])
  Route.post('send-confirm-email' , 'Api/Auth/AuthenticationController.sendConfirmEmail').middleware(['auth:jwt'])

  Route.patch('settings/profile', 'Api/SettingsController.updateProfile').middleware(['auth:jwt'])
  Route.patch('settings/avatar', 'Api/SettingsController.updateAvatar').middleware(['auth:jwt'])
  Route.patch('settings/password', 'Api/SettingsController.updatePassword').middleware(['auth:jwt'])

  Route.get('user/stats', 'Api/StatsController.index').middleware(['auth:jwt'])
  Route.get('user/snaps', 'Api/SnapController.userIndex').middleware(['auth:jwt'])

  Route.get('users/:username', 'Api/UserController.show')
  Route.get('users/:username/followers', 'Api/UserController.followers')
  Route.get('users/:username/followings', 'Api/UserController.followings')
  Route.post('users/:username/follow', 'Api/UserController.follow').middleware(['auth:jwt'])
  Route.post('users/:username/unfollow', 'Api/UserController.unfollow').middleware(['auth:jwt'])

  Route.get('skills', 'Api/SkillController.index')
  Route.get('main-skills', 'Api/SkillController.main')

  Route.get('challenges', 'Api/ChallengeController.index')
  Route.get('challenges/:id', 'Api/ChallengeController.show')
  Route.post('challenges/:id/mark-as-complete', 'Api/ChallengeController.markAsComplete').middleware(['auth:jwt'])
  Route.post('challenges/:id/mark-as-uncomplete', 'Api/ChallengeController.markAsUncomplete').middleware(['auth:jwt'])

  Route.get('user-challenges/:id', 'Api/UserChallengeController.show').middleware(['auth:jwt'])
  Route.delete('user-challenges/:id', 'Api/UserChallengeController.destroy').middleware(['auth:jwt'])

  Route.get('walls/global', 'Api/WallController.global')
  Route.get('walls/friends', 'Api/WallController.friends')

  Route.get('snaps/:id', 'Api/SnapController.show')
  Route.post('snaps', 'Api/SnapController.store').middleware(['auth:jwt'])
  Route.delete('snaps/:id', 'Api/SnapController.destroy')
  Route.post('snaps/:id/views', 'Api/SnapController.countView')
  Route.get('snaps/:id/feedback', 'Api/SnapFeedbackMessageController.snapIndex').middleware(['auth:jwt'])
  Route.post('snaps/:id/feedback', 'Api/SnapFeedbackMessageController.store').middleware(['auth:jwt'])

  Route.post('feedback', 'Api/FeedbackMessageController.store').middleware(['auth:jwt'])

}).prefix('api')

// SESSION AUTHENTICATION ROUTES

// Login, logout.
Route.on('/login').render('auth.login')
Route.post('/auth/login', 'AuthenticationController.login')
Route.get('/logout', 'AuthenticationController.logout').middleware(['auth:session'])

// Confirm email.
Route.get('/confirm-email/:token', 'AuthenticationController.confirmEmail')

// Forgot password.
Route.on('/forgot-password').render('auth.forgotPassword')
Route.post('/auth/forgot-password', 'AuthenticationController.forgotPassword')

// Reset password.
Route.get('/reset-password/:token', 'AuthenticationController.renderResetPassword')
Route.post('/auth/reset-password', 'AuthenticationController.resetPassword')

// NORMAL ROUTES

Route.get('/', ({ response }) => response.redirect(Config.get('sketchDiary.subdomains.app')))

// ERROR PAGES

Route.get('404', ({ view }) => view.render('errors/404'))
