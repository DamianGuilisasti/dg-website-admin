import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import App from "./App.vue";
import CoolLightBox from "vue-cool-lightbox";
import VueScrollactive from "vue-scrollactive";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(CoolLightBox);
Vue.use(VueScrollactive);

const { NODE_ENV } = process.env;

const connectionString =
  NODE_ENV === "development" ? "http://localhost:4000/api" : "/api";

axios.defaults.baseURL = connectionString;

new Vue({
  router,
  store,
  vuetify,
  render: function(h) {
    return h(App);
  },
}).$mount("#app");
