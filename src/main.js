import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import CoolLightBox from "vue-cool-lightbox";
import VueScrollactive from "vue-scrollactive";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

Vue.config.productionTip = false;

Vue.use(CoolLightBox);
Vue.use(VueScrollactive);

/* if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = "http://localhost:4000/api";
} else { */
  axios.defaults.baseURL = "/api";
/* } */

//axios.defaults.baseURL = "http://localhost:4000/api"; //cambiar en producción dejar solo el /api

new Vue({
  router,
  store,
  vuetify,
  render: function(h) {
    return h(App);
  },
}).$mount("#app");
