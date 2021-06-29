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
            max-width="400"
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

        <div class="addNew d-flex" @click="dialog = true">
          <v-row align="center">
            <v-col class="text-center">
              <v-icon size="40">mdi-plus</v-icon>
              <p>Agregar Slider</p>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

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
                <p v-if="editedItem.sliderImg.url" class="mb-5">
                  Imagen del Slider
                </p>
                <v-file-input
                  label="Imagen para Slider"
                  outlined
                  dense
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
          <v-btn color="green darken-1" text @click="save()"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    editedIndex: -1,
    editedItem: {
      title: "",
      subtitle: "",
      sliderImg: "",
    },
    newOrder: false,
  }),
  methods: {
    saveNewOrder() {
      let me = this;
      axios
        .post("sliders/updateIndex", { sliders: this.sliders })
        .then(function (response) {
          me.$store.dispatch("setSnackbar", {
            text: "Se actualizó correctamente el orden de los Sliders.",
          });
          me.getSliders();
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text:
              "Hubo un error al actualizar el orden de los sliders, por favor actualice la página e intente nuevamente.",
            color: "error",
          });
        });
    },
    checkMove: function (e) {
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
        .get("sliders/list")
        .then(function (response) {
          me.sliders = response.data;
        })
        .catch(function (error) {
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
      if (this.imageFile === "") {
        return;
      }
      this.loadingLogo = true;
      let me = this;
      let formData = new FormData();

      formData.append("title", this.editedItem.title);
      formData.append("subtitle", this.editedItem.subtitle);
      formData.append("image", this.imageFile);

      axios
        .post("sliders/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function () {
          me.loadingLogo = false;
          me.$store.dispatch("setSnackbar", {
            text: "Se subió correctamente el slider.",
          });
          me.cleanForm();
          me.getSliders();
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text:
              "Hubo un error al subir el slider, por favor actualice la página e intente nuevamente.",
            color: "error",
          });
        });
      this.dialog = false;
    },
    updateSlider() {
      this.loadingLogo = true;
      let me = this;
      let formData = new FormData();

      formData.append("_id", this.editedItem._id);
      formData.append("title", this.editedItem.title);
      formData.append("subtitle", this.editedItem.subtitle);
      formData.append("newSliderImg", this.newSliderImg);
      if (this.newSliderImg) {
        formData.append("image", this.imageFile);
      }

      axios
        .put("sliders/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          //me.updateNewLogo();
          me.loadingLogo = false;
          me.$store.dispatch("setSnackbar", {
            text: "Se actualizó correctamente el slider.",
          });
          me.cleanForm();
          me.getSliders();
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text:
              "Hubo un error al actualizar el slider, por favor actualice la página e intente nuevamente.",
            color: "error",
          });
        });
      this.dialog = false;
      this.newSliderImg = false;
    },
    deleteSlider(slider) {
      let me = this;
      let sliderId = slider._id;
      confirm("Estás a punto de eliminar el slider, ¿Continuar?") &&
        axios
          .delete("sliders/delete", {
            params: { id: sliderId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function (response) {
            me.getSliders();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente al slider.`,
            });
          })
          .catch(function (error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo eliminar al slider, por favor actualice e intente nuevamente.`,
              color: "red",
            });
          });
    },
    cleanForm() {
      (this.imageFile = ""),
        (this.imageUploaded = null),
        //(this.editedItem.imageURL = ""),
        (this.loadingLogo = false),
        (this.editedItem.title = ""),
        (this.editedItem.subtitle = "");
      this.dialog = false;
      this.editedIndex = -1;
    },
  },
  watch: {
    imageUploaded: function () {
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
  width: 400px;
  height: 330px;
  cursor: pointer;
  display: inline-flex !important;
  float: left;
}
.sliderCard {
  display: inline-block;
  float: left;
  height: 330px;
}
.moveCursor:hover {
  cursor: move;
}
</style>