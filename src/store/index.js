import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import userInfoMod from './modules/user-info-mod'

export default new Vuex.Store({
  strict: true,
  modules: {
    userInfoMod
  }
})
