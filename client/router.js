import Vue from 'vue'
import Router from 'vue-router'
import { scrollBehavior } from '~/utils'

const page = path => () => import(`~/pages/${path}`).then(m => m.default || m)

Vue.use(Router)

const routes = [
  { path: '/login', name: 'auth.login', component: page('auth/login.vue') },
  { path: '/register', name: 'auth.register', component: page('auth/register.vue') },

  { path: '/settings',
    component: page('settings/index.vue'),
    children: [
      { path: '', redirect: { name: 'settings.profile' } },
      { path: 'profile', name: 'settings.profile', component: page('settings/profile.vue'), meta: { group: 'settings' } },
      { path: 'password', name: 'settings.password', component: page('settings/password.vue'), meta: { group: 'settings' } }
    ]
  },

  { path: '/dashboard', name: 'dashboard.index', component: page('dashboard/index.vue'), alias: '/' },

  { path: '/snaps', name: 'snaps.index', component: page('snaps/index.vue') },

  { path: '/challenges', name: 'challenges.index', component: page('challenges/index.vue') },
  { path: '/challenges/:id', name: 'challenges.show', component: page('challenges/show/index.vue') },
]

export function createRouter () {
  return new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })
}
