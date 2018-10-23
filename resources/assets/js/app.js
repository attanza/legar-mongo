import Vue from "vue";
import Vuetify from "vuetify";
import VeeValidate from "vee-validate";
import axios from "axios";
import store from "./store";

/**
 * AXIOS
 */

window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

let token = document.querySelector('[name="_csrf"]');
if (token) {
  window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.value;
} else {
  console.error(
    "CSRF token not found: https://adonisjs.com/docs/3.2/csrf-protection"
  );
}

/**
 * Vue js
 */

window.Vue = Vue;
Vue.prototype.$bus = new Vue();

/**
 * Vuetify
 */

Vue.use(Vuetify);

/**
 * VeeValidate
 */

Vue.use(VeeValidate);

/**
 * Components
 */

import DefaultLayout from "./components/Layout";
import {
  initStore,
  rightToolbar,
  sidebar,
  sessionError,
  Loader
} from "./components";
import { login, roles, roleDetail, users, userDetail, products } from "./pages";

const components = {
  DefaultLayout,
  login,
  initStore,
  rightToolbar,
  sidebar,
  roles,
  sessionError,
  roleDetail,
  Loader,
  users,
  userDetail,
  products
};

/**
 * Vue Instance
 */

const app = new Vue({
  el: "#app",
  store,
  components,
  data: {
    drawer: null,
    toolbarTitle: "Legar"
  }
});
