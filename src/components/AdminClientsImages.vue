<template>
  <!--   class="mx-auto"  -->
  <v-container>
    <h1>Logos de Clientes</h1>
    <v-row>
      <v-col>
        <v-btn dark color="green" v-if="newOrder" @click="saveNewOrder"
          >Guardar nuevo orden</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <draggable
        style="display: contents"
        :list="logos"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <v-col
          class="moveCursor"
          cols="auto"
          v-for="logo in logos"
          :key="logo._id"
        >
          <v-img
            :src="logo.logoImg.url"
            :lazy-src="logo.logoImg.url"
            class="logoImg"
            height="200px"
            width="200px"
            ><span class="removeButton" @click="deleteClientLogo(logo)"
              >X</span
            ></v-img
          >
        </v-col>
      </draggable>
      <v-col cols="auto">
        <div class="addNew d-flex" @click="dialog = true">
          <v-row align="center">
            <v-col class="text-center">
              <v-icon size="40">mdi-plus</v-icon>
              <p>Agregar Logo</p>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Agregar logo</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    class="mt-5"
                    label="Logo del cliente"
                    outlined
                    required
                    :rules="imageRules"
                    dense
                    :loading="loadingLogo"
                    v-model="imageUploaded"
                    color="deep-purple accent-4"
                    placeholder="Seleccionar imagen"
                    prepend-icon="mdi-paperclip"
                    persistent-hint
                    hint="El logo debe ser de formato PNG o JPG."
                    :show-size="1000"
                  ></v-file-input>
                  <img
                    height="100px"
                    :src="editedItem.sliderImg.url"
                    v-if="editedItem.sliderImg.url"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    v-if="editedItem.sliderImg.url"
                    color="red--text"
                    @click="deleteSliderImg"
                    >Eliminar logo</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cleanForm()">
              Cancelar
            </v-btn>
            <v-btn
              color="green darken-1"
              :disabled="!valid"
              text
              @click="uploadLogo()"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  data: () => ({
    valid: true,
    imageRules: [
      (v) => !!v || "El archivo es requerido",
      (v) => (v && v.size > 0) || "El archivo es requerido",
    ],
    newSliderImg: false,
    dialog: false,
    logos: [],
    imageFile: "",
    imageUploaded: null,
    imageURL: "",
    loadingLogo: false,
    title: "",
    subtitle: "",
    editedIndex: -1,
    editedItem: {
      title: "",
      subtitle: "",
      sliderImg: "",
    },
    newOrder: false,
  }),

  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    checkMove: function(e) {
      this.newOrder = true;
    },
    saveNewOrder() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .post("logos/updateIndex", { logos: this.logos }, configuration)
        .then(function(response) {
          me.$store.dispatch("setSnackbar", {
            text: "Se actualizó correctamente el orden de los Logos.",
          });
          me.getLogos();
        })
        .catch(function(error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text:
              "Hubo un error al actualizar el orden de los Logos, por favor actualice la página e intente nuevamente.",
            color: "error",
          });
        });
    },
    deleteClientLogo(logo) {
      let me = this;
      let logoId = logo._id;
      confirm("Estás a punto de eliminar el logo, ¿Continuar?") &&
        axios
          .delete("logos", {
            params: { id: logoId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function(response) {
            me.getLogos();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el logo.`,
            });
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo eliminar el logo, por favor actualice e intente nuevamente.`,
              color: "red",
            });
          });
    },
    getLogos() {
      let me = this;
      axios
        .get("logos")
        .then(function(response) {
          me.logos = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    uploadLogo() {
      if (this.validate()) {
        if (this.imageFile === "") {
          return;
        }
        this.loadingLogo = true;
        let me = this;
        let formData = new FormData();

        formData.append("image", this.imageFile);

        axios
          .post("logos", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.loadingLogo = false;
            me.$store.dispatch("setSnackbar", {
              text: "Se subió correctamente el logo.",
            });
            me.cleanForm();
            me.getLogos();
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text:
                "Hubo un error al subir el logo, por favor actualice la página e intente nuevamente.",
              color: "error",
            });
          });
        this.dialog = false;
      }
    },
    cleanForm() {
      (this.imageFile = ""),
        (this.imageUploaded = null),
        (this.loadingLogo = false),
        (this.editedItem.title = ""),
        (this.editedItem.subtitle = "");
      this.dialog = false;
      this.editedIndex = -1;
    },
  },
  watch: {
    imageUploaded: function() {
      this.imageFile = event.target.files[0];
    },
  },
  created() {
    this.getLogos();
  },
};
</script>

<style scoped lang="scss">
.addNew {
  border-style: dashed !important;
  width: 200px;
  height: 200px;
  cursor: pointer;
  display: inline-flex !important;
  float: left;
}
.sliderCard {
  display: inline-block;
  float: left;
  height: 330px;
}
.removeButton {
  position: absolute;
  top: 10px;
  left: 15px;
  color: "red";
  font-size: 25px;
}
.logoImg .v-image__image .v-image__image--cover :hover {
  opacity: 0.5;
}
.moveCursor:hover {
  cursor: move;
}
@media (min-width: 1264px) {
}
.container {
  max-width: none !important;
}

@media (min-width: 960px) {
}
.container {
  max-width: none !important;
}
</style>
