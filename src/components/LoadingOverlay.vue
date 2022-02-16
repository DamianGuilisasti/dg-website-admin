<template>
  <v-overlay v-if="loadingOverlay">
    <v-progress-circular
      color="#fff"
      indeterminate
      size="100"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["loadingOverlay"]),
  },
};
</script>
