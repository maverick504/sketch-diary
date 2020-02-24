<template>
  <div class="container bg-white lg:border mx-auto lg:my-8">
    <div class="flex flex-col lg:flex-row">
      <div class="lg:w-1/4 lg:border-r">
        <router-link
          :to="{ name: 'settings.profile' }"
          active-class="border-l-4 border-primary"
          class="block p-4 hover:bg-gray-100 hover:text-primary"
        >
          Edit Profile
        </router-link>
        <router-link
          :to="{ name: 'settings.password' }"
          active-class="border-l-4 border-primary"
          class="block p-4 hover:bg-gray-100 hover:text-primary"
        >
          Change Password
        </router-link>
      </div>
      <div class="lg:w-3/4 px-4 py-4 lg:py-8">
        <nuxt-child/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth'
};
</script>
