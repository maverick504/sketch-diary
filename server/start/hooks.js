const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Validator = use('Validator')
  const Database = use('Database')
  const Config = use('Config')
  const View = use('Adonis/Src/View')

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
      */
      return
    }

    const [ table, column ] = args
    const row = await Database.table(table).where(column, value).first()

    if (!row) {
      throw message
    }
  }

  const usernameFn = async (data, field, message, args, get) => {
    const value = get(data, field).toLowerCase()

    const validUsername = /^[a-zA-Z0-9_]{1,20}$/.test(value)

    const unavailableUsernames = Config.get('sketchDiary.unavailableUsernames')

    if(unavailableUsernames.includes(value)) {
      throw message
    }

    if(!validUsername) {
      throw message
    }
  }

  const validAspectRatioFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return
    }

    const values = [ '9:16', '1:1' ]
    if(!values.includes(value)) {
      throw message
    }
  }

  Validator.extend('exists', existsFn)
  Validator.extend('username', usernameFn)
  Validator.extend('validAspectRatio', validAspectRatioFn)

  // Make the configuration accessible in all views.
  View.global('config', function (key) {
    return Config.get(key)
  })
})
