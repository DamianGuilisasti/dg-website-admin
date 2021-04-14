<template>
  <!--   class="mx-auto"  -->
  <v-container>
    <h1>Sliders</h1>
    <v-row>
      <v-col cols="12">
        <v-card
          max-width="400"
          v-for="slider in sliders"
          :key="slider._id"
          class="mb-5 mr-5 sliderCard"
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
            <v-btn color="green" text> Editar </v-btn>

            <v-btn color="red" text> Eliminar </v-btn>
          </v-card-actions>
        </v-card>
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
          <span class="headline">Agregar Slider</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Título"
                  required
                  v-model="title"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Subtítulo"
                  v-model="subtitle"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  label="Imagen para Slider"
                  outlined
                  dense
                  :loading="loadingLogo"
                  v-if="!imageURL"
                  v-model="imageUploaded"
                  color="deep-purple accent-4"
                  placeholder="Seleccionar imagen"
                  prepend-icon="mdi-paperclip"
                  persistent-hint
                  hint="El Slider debe ser de formato PNG o JPG."
                  :show-size="1000"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="uploadSlider">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    sliders: [],
    imageFile: "",
    imageUploaded: null,
    imageURL: "",
    loadingLogo: false,
    title: "",
    subtitle: "",
  }),
  methods: {
    getSliders() {
      let me = this;
      axios
        .get("sliders/list")
        .then(function (response) {
          me.sliders = response.data;
          console.log(me.sliders);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    uploadSlider() {
      if (this.imageFile === "") {
        return;
      }
      this.loadingLogo = true;
      let me = this;
      let formData = new FormData();

      formData.append("title", this.title);
      formData.append("subtitle", this.subtitle);
      formData.append("image", this.imageFile);

      axios
        .post("sliders/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          //me.updateNewLogo();
          me.loadingLogo = false;
          me.$store.dispatch("setSnackbar", {
            text: "Se subió correctamente el slider.",
          });
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
  },
  watch: {
    imageUploaded: function () {
      this.imageFile = event.target.files[0];
    },
  },
  created() {
    this.getSliders();
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
.v-card__actions {
  float: right !important;
}
</style>