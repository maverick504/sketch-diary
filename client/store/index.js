// getters
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },

  mainSkills(state) {
    return state.mainSkills
  }
}

// mutations
export const mutations = {
  UPDATE_USER (state, { user }) {
    state.auth.user = user
  },

  UPDATE_MAIN_SKILLS (state, { mainSkills }) {
    state.mainSkills = mainSkills
  }
}

// actions
export const actions = {
  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  updateMainSkills ({ commit }, payload) {
    commit('UPDATE_MAIN_SKILLS', payload)
  }
}
