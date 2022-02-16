<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar.showing"
      :color="snackbar.color"
      timeout="8000"
    >
      <p class="white--text">{{ snackbar.text }}</p>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbar.showing = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["snackbar"]),
  },
};
</script>
