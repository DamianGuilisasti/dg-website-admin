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
import { mapState } from "vuex";
import LoadingOverlay from "./components/LoadingOverlay";
import Snackbar from "./components/Snackbar";
export default {
  components: {
    LoadingOverlay,
    Snackbar,
  },
  computed: {
    ...mapState(["snackbar"]),
  },
};
</script>