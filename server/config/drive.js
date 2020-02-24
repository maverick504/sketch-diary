'use strict'

const Helpers = use('Helpers')
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default disk
  |--------------------------------------------------------------------------
  |
  | The default disk is used when you interact with the file system without
  | defining a disk name
  |
  */
  default: 'spaces',

  disks: {
    /*
    |--------------------------------------------------------------------------
    | Local
    |--------------------------------------------------------------------------
    |
    | Local disk interacts with the a local folder inside your application
    |
    */
    local: {
      root: Helpers.tmpPath(),
      driver: 'local'
    },

    /*
    |--------------------------------------------------------------------------
    | DigitalOcean Spaces
    |--------------------------------------------------------------------------
    |
    | spaces disk interacts with a bucket on DO Spaces
    |
    */
    spaces: {
      driver: 's3',
      key: Env.get('SPACES_KEY'),
      secret: Env.get('SPACES_SECRET'),
      endpoint: Env.get('SPACES_ENDPOINT'),
      bucket: Env.get('SPACES_BUCKET'),
      region: Env.get('SPACES_REGION'),
    }
  }
}
