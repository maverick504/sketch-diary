<template>
  <nav :class="{ 'bg-white border-b': dark !== true, 'bg-gray-900 border-b border-black': dark === true }" class="fixed pin-t w-full whitespace-no-wrap z-40">
    <div class="flex container mx-auto">
      <div class="mx-0">
        <router-link :to="{ name: 'dashboard.index' }" class="h-full flex items-center px-4">
          <h1>
            <span :class="{ [ dark ? 'text-white' : 'text-primary' ]: true }" class="text-xl font-bold mr-1">SketchDiary</span><!--
         --><span :class="{ [ dark ? 'text-gray-200' : 'text-gray-600' ]: true }" class="text-sm">Beta</span>
          </h1>
        </router-link>
      </div>
      <div class="flex-grow hidden md:flex justify-start">
        <router-link
          :to="{ name: 'snaps.index' }"
          :class="{ [textColorClass]: true }"
          class="inline-block p-4"
        >
          <compass-icon size="1.5x" class="inline"/><span class="align-middle ml-1">Explore</span>
        </router-link>
        <router-link
          :to="{ name: 'challenges.index' }"
          :class="{ [textColorClass]: true }"
          class="inline-block p-4"
        >
          <pen-tool-icon size="1.5x" class="inline"/><span class="align-middle ml-1">Draw</span>
        </router-link>
      </div>
      <div class="flex-grow flex justify-end">
        <template v-if="isAuthenticated">
          <router-link
            :to="{ name: 'dashboard.index' }"
            :class="{ [textColorClass]: true }"
            class="hidden md:inline-block p-4"
          >
            <bar-chart-2-icon size="1.5x" class="inline"/><span class="hidden md:inline align-middle ml-1">Dashboard</span>
          </router-link><!--
       --><t-dropdown
            :button-props="{
              baseClass: 'inline-block focus:outline-none',
              defaultClass: (dark ? 'bg-gray-900 hover:bg-gray-900 ' : 'bg-white hover:bg-white ') + textColorClass,
              defaultSizeClass: 'p-4'
            }"
            :visible-arrow="false"
            :dropdown-class="(dark ? 'bg-gray-900 border border-black' : 'bg-white border') + ' w-64 shadow-md py-4 z-10'"
            placement="bottom"
            trigger="click"
            class="inline-block"
          >
            <template slot="button-content">
              <user-icon size="1.5x" class="inline"/>
            </template>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'settings.profile' }"
                  :class="{ [textColorClass]: true }"
                  class="block no-underline px-6 py-2"
                  active-class="text-primary"
                >
                  Settings
                </router-link>
              </li>
              <li class="h-4"/>
                <li>
                  <button
                    :class="{ [textColorClass]: true }"
                    class="block w-full text-left px-6 py-2"
                    @click.prevent="logout"
                  >
                    Log out
                  </button>
                </li>
            </ul>
          </t-dropdown>
        </template><!--
     --><template v-if="!isAuthenticated">
          <t-button
            base-class="inline-block"
            default-class="text-primary"
            default-size-class="p-4"
            @click="$bus.$emit('openLoginModal')"
          >
            <log-in-icon size="1.5x" class="inline"/><span class="hidden md:inline align-middle ml-1">Log in</span>
          </t-button><!--
       --><router-link
            :to="{ name: 'auth.register' }"
            class="inline-block p-4 text-primary"
          >
            <user-plus-icon size="1.5x" class="inline"/><span class="hidden md:inline align-middle ml-1">Register</span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import { LogInIcon, UserPlusIcon, CompassIcon, PenToolIcon, ClockIcon, BarChart2Icon, UserIcon } from 'vue-feather-icons'

export default {
  components: {
    LogInIcon,
    UserPlusIcon,
    CompassIcon,
    PenToolIcon,
    ClockIcon,
    BarChart2Icon,
    UserIcon
  },

  props: {
    dark: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated', 'loggedInUser' ]),

    textColorClass () {
      return this.dark ? 'text-white hover:text-primary' : 'text-gray-900 hover:text-primary'
    }
  },

  methods: {
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
