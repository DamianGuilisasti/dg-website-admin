import Vue from "vue";
import Vuex from "vuex";
import Repository from "../repositories/Repository";
import decode from "jwt-decode";
import router from "../router/index";

Vue.use(Vuex);

const calltoactions = {
  namespaced: true,
  state: { calltoactions: [] },
  mutations: {
    setCallToActions(state, payload) {
      state.calltoactions = payload;
    },
  },
  actions: {
    async getCallToActions({ commit }, payload) {
      const response = await Repository.get(`/calltoactions`, {
        headers: { token: this.state.token },
      });
      commit("setCallToActions", response.data);
    },
    async createCallToAction({ commit }, payload) {
      const response = await Repository.post(`/calltoactions`, payload, {
        headers: { token: this.state.token },
      });
      return response;
    },
    async updateCallToAction({ commit }, payload) {
      const response = await Repository.put(`/calltoactions`, payload, {
        headers: { token: this.state.token },
      });
      return response;
    },
    async deleteBackgroundImage({ commit }, payload) {
      const response = await Repository.put(
        `/calltoactions/deleteBackground`,
        payload,
        {
          headers: { token: this.state.token },
        }
      );
      return response;
    },
    async deleteCallToAction({ commit }, payload) {
      const response = await Repository.delete(`/calltoactions`, {
        params: payload,
        headers: { token: this.state.token },
      });
      return response;
    },
    async activateItem({ commit }, payload) {
      const response = await Repository.put(
        `/calltoactions/activate`,
        { _id: payload._id },
        {
          headers: { token: this.state.token },
        }
      );
      return response;
    },
    async desactivateItem({ commit }, payload) {
      const response = await Repository.put(
        `/calltoactions/desactivate`,
        { _id: payload._id },
        {
          headers: { token: this.state.token },
        }
      );
      return response;
    },
  },
  getters: {
    calltoactions: (state) => {
      return state.calltoactions;
    },
  },
};

const expenses = {
  namespaced: true,
  state: { expenses: [] },
  mutations: {
    setExpenses(state, payload) {
      state.expenses = payload;
    },
  },
  actions: {
    async getExpenses({ commit }, payload) {
      const response = await Repository.get(`/expenses`, {
        headers: { token: this.state.token },
      });
      commit("setExpenses", response.data);
    },
    async createExpense({ commit }, payload) {
      const response = await Repository.post(`/expenses`, payload, {
        headers: { token: this.state.token },
      });
      return response;
    },
    async updateExpense({ commit }, payload) {
      const response = await Repository.put(`/expenses`, payload, {
        headers: { token: this.state.token },
      });
      return response;
    },
    async deleteExpense({ commit }, payload) {
      const response = await Repository.delete(`/expenses`, {
        params: payload,
        headers: { token: this.state.token },
      });
      return response;
    },
    async activateItem({ commit }, payload) {
      const response = await Repository.put(
        `/expenses/activate`,
        { _id: payload._id },
        {
          headers: { token: this.state.token },
        }
      );
      return response;
    },
    async desactivateItem({ commit }, payload) {
      const response = await Repository.put(
        `/expenses/desactivate`,
        { _id: payload._id },
        {
          headers: { token: this.state.token },
        }
      );
      return response;
    },
  },
  getters: {
    expenses: (state) => {
      return state.expenses;
    },
  },
};

const menus = {
  namespaced: true,
  state: { menus: [] },
  mutations: {
    setMenus(state, payload) {
      state.menus = payload;
    },
  },
  actions: {
    async getMenus({ commit }, payload) {
      const response = await Repository.get(`/menus`, {
        headers: { token: this.state.token },
      });
      commit("setMenus", response.data);
    },
    async createMenu({ commit }, payload) {
      const response = await Repository.post(`/menus`, payload, {
        headers: { token: this.state.token },
      });
      return response;
    },
    async updateMenu({ commit }, payload) {
      const response = await Repository.put(`/menus`, payload, {
        headers: { token: this.state.token },
      });
      return response;
    },
    async deleteMenu({ commit }, payload) {
      const response = await Repository.delete(`/menus`, {
        params: payload,
        headers: { token: this.state.token },
      });
      return response;
    },
    async activateItem({ commit }, payload) {
      const response = await Repository.put(
        `/menus/activate`,
        { _id: payload._id },
        {
          headers: { token: this.state.token },
        }
      );
      return response;
    },
    async desactivateItem({ commit }, payload) {
      const response = await Repository.put(
        `/menus/desactivate`,
        { _id: payload._id },
        {
          headers: { token: this.state.token },
        }
      );
      return response;
    },
    async saveNewOrder({ commit }, payload) {
      const response = await Repository.post(`/menus/saveNewOrder`, payload, {
        headers: { token: this.state.token },
      });
      return response;
    },
  },
  getters: {
    menus: (state) => {
      return state.menus;
    },
  },
};

export default new Vuex.Store({
  state: {
    loadingOverlay: false,
    snackbar: { showing: false, text: "", color: "" },
    token: null,
    userDB: null,
  },

  mutations: {
    setLoadingOverlay(state, loadingOverlay) {
      state.loadingOverlay = loadingOverlay;
    },
    removeLoadingOverlay(state, loadingOverlay) {
      state.loadingOverlay = loadingOverlay;
    },
    setSnackbar(state, snackbar) {
      state.snackbar = snackbar;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, User) {
      if (User) {
        state.userDB = User.id;
        state.name = User.name;
      } else {
        state.userDB = null;
      }
    },
  },

  actions: {
    setLoadingOverlay({ commit }, loadingOverlay) {
      loadingOverlay = true;
      commit("setLoadingOverlay", loadingOverlay);
    },
    removeLoadingOverlay({ commit }, loadingOverlay) {
      loadingOverlay = false;
      commit("removeLoadingOverlay", loadingOverlay);
    },
    setSnackbar({ commit }, snackbar) {
      snackbar.showing = true;
      snackbar.color = snackbar.color || "success";
      commit("setSnackbar", snackbar);
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
  modules: {
    expenses: expenses,
    menus: menus,
    calltoactions: calltoactions,
  },
});
