'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Subdomains
  |--------------------------------------------------------------------------
  |
  | The subdomains under the sketchdiary domain.
  |
  */

  subdomains: {
    main: Env.get('MAIN_SUBDOMAIN_URL', 'http://localhost:3333'),
    app: Env.get('APP_SUBDOMAIN_URL', 'http://localhost:5000')
  },

  /*
  |--------------------------------------------------------------------------
  | Maximum Storage
  |--------------------------------------------------------------------------
  |
  | The maximum file storage for different user levels.
  |
  */

  maximumStorage: {
    common: Env.get('MAXIMUM_STORAGE_COMMON_USERS', 1024 * 1024 * 1024), // 1 GB
    premium: Env.get('MAXIMUM_STORAGE_PREMIUM_USERS', 1024 * 1024 * 1024 * 10) // 10 GB
  },

  /*
  |--------------------------------------------------------------------------
  | Unavailable Usernames
  |--------------------------------------------------------------------------
  |
  | Usernames that cannot be used, E.g.: sketchdiary, home, notifications, etc.
  | This isn't a profanity filter. There should be added usernames like
  | 'notifications' (https://app,sketchdiary.com/notifications), which interfers
  | with the notifications route.
  |
  | IMPORTANT: put all the unavailable usernames in lower case.
  | The validation function will pass the values to lower case so it is case insensitive.
  |
  */

  unavailableUsernames: [
    'sketchdiary',
    'sketch-diary',
    'plazacomics',
    'plaza-comics',
    'drawvania',
    'draw-vania',
    'auth',
    'login',
    'register',
    'account',
    'home',
    'browse',
    'explore',
    'search',
    'followings',
    'followers',
    'popular',
    't',
    'tag',
    'tags',
    'u',
    'user',
    'users',
    'p',
    'post',
    'posts',
    'c',
    'challenge',
    'challenges',
    'notifications',
    'settings',
    'd',
    'draw',
    'drawing',
    'drawings',
    'i',
    'illustration',
    'illustrations',
    't',
    'tutorial',
    'tutorials',
    'channel',
    'channels'
  ]
}
