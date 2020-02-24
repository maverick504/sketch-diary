import swal from 'sweetalert2'

export default function ({$axios, app}) {
  $axios.interceptors.response.use(
    function (response) {
      return response
    },

    function (error) {
      const code = parseInt(error.response && error.response.status)

      if ([401, 403].includes(code)) {
        app.$auth.logout()

        swal.fire({
          type: 'warning',
          title: 'Sesion Expired!',
          text: "Your session has expired. please login again"
        })
      } else {
        return Promise.reject(error)
      }
    }
  )
}
