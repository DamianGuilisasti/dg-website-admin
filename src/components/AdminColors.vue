<template>
  <v-container fluid>
    <h1>Colores de la Página Web</h1>
    <v-row
      ><v-col> <h4>Color principal</h4></v-col></v-row
    >
    <v-row>
      <v-col>
        <v-color-picker
          dot-size="25"
          mode="hexa"
          hide-mode-switch
          swatches-max-height="200"
          v-model="settings[0].primaryColor"
        ></v-color-picker>
      </v-col>
    </v-row>
    <v-row
      ><v-col> <h4>Color secundario</h4></v-col></v-row
    >
    <v-row>
      <v-col>
        <v-color-picker
          dot-size="25"
          mode="hexa"
          hide-mode-switch
          swatches-max-height="200"
          v-model="settings[0].secondaryColor"
        ></v-color-picker>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn color="success" class="mr-3" @click="updateColor"
          >Guardar cambios</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  methods: {
    async updateColor() {
      try {
        const result = await this.$store.dispatch(
          "settings/updateColor",
          {
            _id: this.$store.state.settings.settings[0]._id,
            primaryColor: this.settings[0].primaryColor,
            secondaryColor: this.settings[0].secondaryColor,
          },
          { root: true }
        );
        if (result.status === 204) {
          this.$store.dispatch("setSnackbar", {
            text: `Se modificó correctamente el color.`,
          });
        }
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo modificar el color.`,
          color: "red",
        });
      }
    },
  },
  computed: {
    ...mapGetters("settings", ["settings"]),
  },
};
</script>
