<template>
  <t-modal
    v-model="show"
    :clickToClose="!form.busy"
    :escToClose="!form.busy"
    :hideCloseButton="true"
    header="Create snap"
    width="480"
    ref="modal"
  >

    <error-alert :form="form" class="mb-3"/>

    <has-error :form="form" field="user_challenge_id" class="mb-3"/>

    <template v-if="imageUrl">

      <template v-if="$device.isMobile">

        <div :style="{ backgroundImage: 'url(' + imageUrl + ')' }" class="relative w-full h-auto bg-cover bg-center">
          <div class="w-full h-0" style="padding-top: 177.77%;"></div>
        </div>

      </template>
      <template v-else>

        <t-input-group>
          <div class="flex w-full">
            <a :class="{ 'bg-primary text-white': form.aspect_ratio === '9:16', 'bg-gray-200 text-gray-900': form.aspect_ratio !== '9:16' }" href="#" class="w-1/2 p-2 text-center" @click="setAspectRatio('9:16')">
              9:16
            </a>
            <a :class="{ 'bg-primary text-white': form.aspect_ratio === '1:1', 'bg-gray-200 text-gray-900': form.aspect_ratio !== '1:1' }" href="#" class="w-1/2 p-2 text-center" @click="setAspectRatio('1:1')">
              1:1
            </a>
          </div>
          <has-error :form="form" field="aspect_ratio"/>
        </t-input-group>

        <div class="relative">
          <button
            type="button"
            class="absolute bg-transparent-black hover:bg-red w-10 h-10 text-white text-center z-50"
            style="top: 8px; right: 8px;"
            @click="clearImage()"
          >
            <trash-2-icon class="mx-auto"/>
          </button>
          <no-ssr>
            <vue-croppie
              ref="croppie"
              :viewport="croppieSettings.viewport"
              :boundary="croppieSettings.boundary"
              :enable-resize="false"
            ></vue-croppie>
          </no-ssr>
        </div>

      </template>

    </template>

    <template v-else>

      <label class="placeholder py-16 cursor-pointer" @click="$refs.file.click()">
        <upload-cloud-icon size="3x" class="inline-block mx-auto mb-4"/>
        <p>Click here to select an image...</p>
      </label>
      <input ref="file" class="hidden" type="file" accept="image/*" @change="fileChanged">

    </template>

    <template slot="footer">
      <t-button
        :class="{ 'button-loading': form.busy }"
        class="block w-full"
        type="button"
        variant="primary"
        size="lg"
        @click="save()"
      >
        Share
      </t-button>
    </template>

  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import { UploadCloudIcon, Trash2Icon } from 'vue-feather-icons'

export default {
  components: {
    UploadCloudIcon,
    Trash2Icon
  },

  data: function () {
    return {
      show: false,
      imageFile: null,
      imageUrl: null,
      croppieSettings: {
        viewport: { width: 200, height: 300 },
        boundary: { width: 400, height: 360 }
      },
      form: new Form({
        user_challenge_id: null,
        aspect_ratio: '9:16'
      })
    }
  },

  mounted () {
    this.$bus.$on('openCreateSnapModal', (options = {}) => {
      this.clearForm()

      if (options.userChallengeId) {
        this.form.user_challenge_id = options.userChallengeId
      }

      this.show = true
    })
  },

  methods: {
    setAspectRatio (value) {
      if (value === '9:16') {
        this.croppieSettings.viewport.width = 168.75
        this.croppieSettings.viewport.height = 300
        this.form.aspect_ratio = '9:16'
      } else if (value === '1:1') {
        this.croppieSettings.viewport.width = 200
        this.croppieSettings.viewport.height = 200
        this.form.aspect_ratio = '1:1'
      }

      return new Promise((resolve) => setTimeout(this.refreshCroppie, 1))
    },

    refreshCroppie () {
      this.$refs.croppie.refresh()

      this.$refs.croppie.bind({
        url: this.imageUrl,
      })
    },

    fileChanged (event) {
      this.imageFile = event.target.files[0]
      event.target.value = null

      this.imageUrl = URL.createObjectURL(this.imageFile)

      if(!this.$device.isMobile) {
        this.$nextTick(function () {
          this.refreshCroppie()
        })
      }
    },

    clearImage () {
      this.setAspectRatio('9:16')
      this.imageFile = null
      this.imageUrl = null

      this.form.clearErrors()
    },

    clearForm () {
      this.form.user_challenge_id = null
      this.setAspectRatio('9:16')
      this.imageFile = null
      this.imageUrl = null

      this.form.clearErrors()
    },

    async save () {
      this.form.clearErrors()
      this.form.busy = true

      try {
        let formData = new FormData()

        if(this.$device.isMobile) {
          formData.append('image', this.imageFile)
          formData.append('aspect_ratio', '9:16')
        } else {
          // Transform the croppie result as a file.
          const size = { width: 1080, height: this.form.aspect_ratio === '9:16' ? 1920 : 1080 }
          const output = await this.$refs.croppie.result({ format: 'jpeg', size: size, quality: 1 })
          const res = await fetch(output)
          const blob = await res.blob()
          const file = new File([blob], 'image.jpeg', {
            type: "image/jpeg"
          })

          formData.append('image', file)
          formData.append('aspect_ratio', this.form.aspect_ratio)
        }

        formData.append('user_challenge_id', this.form.user_challenge_id)

        const response = await this.$axios.post('snaps', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.snap = response.data

        // Show success message
        swal.fire({
          icon: 'success',
          title: 'Snap created successfully!',
          showConfirmButton: false,
          timer: 1500
        })

        // Redirect to the created snap.
        this.$router.push({ name: 'snaps.index' })
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
