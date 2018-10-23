import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const state = {
  user: null,
  currentEdit: null
};
const mutations = {
  user(state, user) {
    state.user = user;
  },
  currentEdit(state, data) {
    state.currentEdit = data;
  }
};
export default new Vuex.Store({
  state,
  mutations
});
