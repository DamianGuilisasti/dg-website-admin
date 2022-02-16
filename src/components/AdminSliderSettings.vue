<template>
  <!--   class="mx-auto"  -->
  <v-container>
    <h1>Sliders</h1>
    <v-row>
      <v-col>
        <v-btn dark color="green" v-if="newOrder" @click="saveNewOrder"
          >Guardar nuevo orden</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <draggable
          :list="sliders"
          ghost-class="ghost"
          :move="checkMove"
          @start="dragging = true"
          @end="dragging = false"
        >
          <v-card
            v-for="slider in sliders"
            :key="slider._id"
            class="mb-5 mr-5 sliderCard moveCursor"
            draggable="true"
          >
            <v-img
              class="white--text align-end"
              height="200px"
              :src="slider.sliderImg.url"
            >
              <v-card-title>{{ slider.title }}</v-card-title>
            </v-img>

            <v-card-subtitle class="pb-0"> Subtítulo: </v-card-subtitle>

            <v-card-text class="text--primary">
              <div>{{ slider.subtitle }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="green" text @click="editSlider(slider)">
                Editar
              </v-btn>

              <v-btn color="red" text @click="deleteSlider(slider)">
                Eliminar
              </v-btn>
            </v-card-actions>
          </v-card>
        </draggable>

        <div class="addNew" @click="dialog = true">
          <v-row align="center">
            <v-col class="text-center">
              <v-icon size="40">mdi-plus</v-icon>
              <p>Agregar Slider</p>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Título"
                    required
                    v-model="editedItem.title"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Subtítulo"
                    v-model="editedItem.subtitle"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Texto del Botón"
                    v-model="editedItem.buttonText"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="URL del Botón"
                    v-model="editedItem.buttonURL"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <p v-if="editedItem.sliderImg.url" class="mb-5">
                    Imagen del Slider
                  </p>
                  <v-file-input
                    label="Imagen para Slider"
                    outlined
                    dense
                    required
                    :rules="imageRules"
                    :loading="loadingLogo"
                    v-if="!editedItem.sliderImg.url"
                    v-model="imageUploaded"
                    color="deep-purple accent-4"
                    placeholder="Seleccionar imagen"
                    prepend-icon="mdi-paperclip"
                    persistent-hint
                    hint="El Slider debe ser de formato PNG o JPG."
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
                    >Eliminar slider</v-btn
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
              @click="save()"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
    <!--     <v-row>
      <v-col cols="3"
        ><v-slider
          max="10"
          min="1"
          v-model="value"
          step="1"
          thumb-label
          ticks
        ></v-slider
      ></v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import axios from "axios";
import draggable from "vuedraggable";
export default {
  name: "simple",
  display: "Simple",
  order: 0,
  components: {
    draggable,
  },
  data: () => ({
    value: 0,
    valid: true,
    imageRules: [
      (v) => !!v || "El archivo es requerido",
      (v) => (v && v.size > 0) || "El archivo es requerido",
    ],
    dragging: false,
    newSliderImg: false,
    dialog: false,
    sliders: [],
    imageFile: "",
    imageUploaded: null,
    imageURL: "",
    loadingLogo: false,
    title: "",
    subtitle: "",
    buttonText: "",
    buttonURL: "",
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
    saveNewOrder() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .post("sliders/updateIndex", { sliders: this.sliders }, configuration)
        .then(function() {
          me.$store.dispatch("setSnackbar", {
            text: "Se actualizó correctamente el orden de los Sliders.",
          });
          me.getSliders();
        })
        .catch(function(error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text:
              "Hubo un error al actualizar el orden de los sliders, por favor actualice la página e intente nuevamente.",
            color: "error",
          });
        });
    },
    checkMove: function(e) {
      this.newOrder = true;
    },
    deleteSliderImg() {
      this.editedItem.sliderImg = "";
      this.newSliderImg = true;
    },
    editSlider(slider) {
      this.editedIndex = this.sliders.indexOf(slider);
      this.editedItem = Object.assign({}, slider);
      this.dialog = true;
    },
    getSliders() {
      let me = this;
      axios
        .get("sliders")
        .then(function(response) {
          me.sliders = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    save() {
      if (this.editedIndex > -1) {
        this.updateSlider();
      } else {
        this.uploadSlider();
      }
    },
    uploadSlider() {
      if (this.validate()) {
        if (this.imageFile === "") {
          return;
        }
        this.loadingLogo = true;
        let me = this;
        let formData = new FormData();

        formData.append("title", this.editedItem.title);
        formData.append("subtitle", this.editedItem.subtitle);
        formData.append("buttonText", this.editedItem.buttonText);
        formData.append("buttonURL", this.editedItem.buttonURL);
        formData.append("image", this.imageFile);

        axios
          .post("sliders", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.loadingLogo = false;
            me.$store.dispatch("setSnackbar", {
              text: "Se subió correctamente el slider.",
            });
            me.cleanForm();
            me.getSliders();
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text:
                "Hubo un error al subir el slider, por favor actualice la página e intente nuevamente.",
              color: "error",
            });
          });
        this.dialog = false;
      }
    },
    updateSlider() {
      if (this.validate()) {
        this.loadingLogo = true;
        let me = this;
        let formData = new FormData();
        formData.append("_id", this.editedItem._id);
        formData.append("title", this.editedItem.title);
        formData.append("subtitle", this.editedItem.subtitle);
        formData.append("buttonText", this.editedItem.buttonText);
        formData.append("buttonURL", this.editedItem.buttonURL);
        formData.append("newSliderImg", this.newSliderImg);
        if (this.newSliderImg) {
          formData.append("image", this.imageFile);
        }

        axios
          .put("sliders", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.loadingLogo = false;
            me.$store.dispatch("setSnackbar", {
              text: "Se actualizó correctamente el slider.",
            });
            me.cleanForm();
            me.getSliders();
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text:
                "Hubo un error al actualizar el slider, por favor actualice la página e intente nuevamente.",
              color: "error",
            });
          });
        this.dialog = false;
        this.newSliderImg = false;
      }
    },
    deleteSlider(slider) {
      let me = this;
      let sliderId = slider._id;
      confirm("Estás a punto de eliminar el slider, ¿Continuar?") &&
        axios
          .delete("sliders", {
            params: { id: sliderId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.cleanForm();
            me.getSliders();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente al slider.`,
            });
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo eliminar al slider, por favor actualice e intente nuevamente.`,
              color: "red",
            });
          });
    },
    cleanForm() {
      this.imageFile = "";
      this.loadingLogo = false;
      this.editedItem._id = "";
      this.editedItem.title = "";
      this.editedItem.subtitle = "";
      this.editedItem.buttonText = "";
      this.editedItem.buttonURL = "";
      this.editedItem.sliderImg = "";
      this.dialog = false;
      this.editedIndex = -1;
      this.imageUploaded = null;
    },
  },
  watch: {
    imageUploaded: function() {
      this.imageFile = event.target.files[0];
    },
  },
  created() {
    this.getSliders();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo slider" : "Editar slider";
    },
  },
};
</script>

<style scoped lang="scss">
.addNew {
  border-style: dashed !important;
  //width: 400px;
  width: 100%;
  height: 330px;
  cursor: pointer;
  display: inline-flex !important;
  float: left;
}
.sliderCard {
  display: inline-block;
  float: left;
  height: auto;
  width: 100%;
}
.moveCursor:hover {
  cursor: move;
}
@media only screen and (min-width: 1260px) {
  .sliderCard,
  .addNew {
    width: 28%;
  }
} // Extra large devices
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
