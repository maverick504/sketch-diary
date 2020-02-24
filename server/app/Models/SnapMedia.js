'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SnapMedia extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:CastAttributes')
    this.addTrait('HasMedia', {
      modelFolderName: 'snaps',
      collections: {
        image: {
          columnName: 'variations',
          variations: {
            '1080w': { width: 1080, height: 1920, force: true },
            '540w': { width: 540, height: 960, force: true },
            '320x320f': { width: 320, height: 320, force: true },
            '38x38f': { width: 38, height: 38, force: true }
          }
        }
      }
    })
  }

  static get table () {
    return 'snap_media'
  }

  /**
   * add values to cast to upon set
   */
  static get casts () {
    return {
      variations: 'json'
    }
  }

  static get createdAtColumn () {
    return 'created_at'
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = SnapMedia
