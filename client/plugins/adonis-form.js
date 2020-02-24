class Form {
  constructor (data = {}) {
    this.busy = false
    this.errorMessage = null
    this.errors = {}

    Object.assign(this, data)
  }

  clearErrors (response) {
    this.errorMessage = null
    this.errors = []
  }

  handleErrorResponse (response) {
    const responseData = response.data

    this.errorMessage = null
    this.errors = []

    if(Array.isArray(responseData)) {
      for(var i=0; i<responseData.length; i++) {
        let error = responseData[i]

        if(!Array.isArray(this.errors[error.field])) {
          this.errors[error.field] = []
        }
        this.errors[error.field].push(error.message)
      }
    } else {
      this.errorMessage = responseData.message
    }

    this.busy = false
  }

  keys () {
    return Object.keys(this).filter(key => !Form.ignore.includes(key))
  }

  hasErrorMessage () {
    return this.errorMessage !== null
  }

  getErrorMessage () {
    return this.errorMessage
  }

  hasErrors (field) {
    return this.errors[field] !== undefined
  }

  getErrors (field) {
    return this.errors[field]
  }

  getFirstError (field) {
    return this.errors[field][0]
  }
}

Form.ignore = ['busy', 'errorMessage', 'errors']

export default Form
