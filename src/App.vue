<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
    <Snackbar />
    <LoadingOverlay />
  </v-app>
</template>

<script>
import LoadingOverlay from "./components/LoadingOverlay";
import Snackbar from "./components/Snackbar";
export default {
  components: {
    LoadingOverlay,
    Snackbar,
  },
  async created() {
    await this.$store.dispatch("settings/getSettings", null, { root: true });
  },
};
</script>
