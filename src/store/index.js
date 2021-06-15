import Vue from "vue";
import Vuex from "vuex";
import decode from "jwt-decode";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingOverlay: false,
    snackbar: { showing: false, text: "", color: "" },
    token: null,
    userDB: null,
  },
  mutations: {
    SET_LOADINGOVERLAY(state, loadingOverlay) {
      state.loadingOverlay = loadingOverlay;
    },
    REMOVE_LOADINGOVERLAY(state, loadingOverlay) {
      state.loadingOverlay = loadingOverlay;
    },
    SET_SNACKBAR(state, snackbar) {
      state.snackbar = snackbar;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, User) {
      if (User) {
        state.userDB = User.id;
      } else {
        state.userDB = null;
      }
    },
  },
  actions: {
    setLoadingOverlay({ commit }, loadingOverlay) {
      loadingOverlay = true;
      commit("SET_LOADINGOVERLAY", loadingOverlay);
    },
    removeLoadingOverlay({ commit }, loadingOverlay) {
      loadingOverlay = false;
      commit("REMOVE_LOADINGOVERLAY", loadingOverlay);
    },
    setSnackbar({ commit }, snackbar) {
      snackbar.showing = true;
      snackbar.color = snackbar.color || "success";
      commit("SET_SNACKBAR", snackbar);
    },
    saveToken({ commit }, token) {
      commit("setToken", token);
      const User = decode(token);
      commit("setUser", User);
      localStorage.setItem("token", token);
    },
    exit({ commit }) {
      commit("setToken", null);
      commit("setUser", null);
      localStorage.removeItem("token");
      router.push({ name: "Login" });
    },
    autoLogin({ commit }) {
      let token = localStorage.getItem("token");
      if (token) {
        commit("setToken", token);
        const User = decode(token);
        commit("setUser", User);
      } else {
        router.push({ name: "Login" });
      }
    },
  },
  modules: {},
});
