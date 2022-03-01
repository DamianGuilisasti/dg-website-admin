<template>
  <v-container>
    <v-row v-if="!settings[0].isBackgroundVideoActivated">
      <v-col>
        <h1>Sliders</h1>
        <v-btn dark color="green" v-if="newOrder" @click="saveNewOrder"
          >Guardar nuevo orden</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="!settings[0].isBackgroundVideoActivated">
      <v-col cols="12">
        <draggable
          :list="sliders"
          ghost-class="ghost"
          :move="checkMove"
          @start="dragging = true"
          @end="dragging = false"
          v-if="sliders"
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
              :lazy-src="slider.sliderImg.url"
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

    <v-row v-if="!settings[0].isBackgroundVideoActivated">
      <v-col cols="12">
        <h1>Nivel de oscuridad del slider</h1>
      </v-col>
      <v-col xs="12" sm="12" md="12" lg="4" xl="3">
        <v-slider
          v-if="settings[0]"
          max="10"
          min="1"
          v-model="settings[0].sliderOverlayLevel"
          step="1"
          persistent-hint
          hint="1: Sin oscuridad | 10: Máxima oscuridad"
          ticks
          thumb-label="always"
          @change="saveNewSliderOverlayLevel"
        ></v-slider
      ></v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-switch
          @change="activeBackgroundVideo"
          v-model="settings[0].isBackgroundVideoActivated"
          :label="`¿Activar video de fondo?`"
        ></v-switch>
      </v-col>
    </v-row>

    <v-row v-if="settings[0].isBackgroundVideoActivated">
      <v-col cols="12">
        <h1>Video para el slider</h1>
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-if="!settings[0].videobackground.url"
          :loading="loadingVideo"
          v-model="videoUploaded"
          color="deep-purple accent-4"
          placeholder="Seleccionar video"
          prepend-icon="mdi-paperclip"
          outlined
          persistent-hint
          hint="El video debe estar en formato mp4."
          :show-size="1000"
        >
          <template v-slot:selection="{ index, text }">
            <v-chip
              v-if="index < 2"
              color="deep-purple accent-4"
              dark
              label
              small
            >
              {{ text }}
            </v-chip>

            <span
              v-else-if="index === 2"
              class="overline grey--text text--darken-3 mx-2"
            >
              +{{ files.length - 2 }} File(s)
            </span>
          </template>
        </v-file-input>
        <v-btn
          v-if="settings[0].videobackground.url"
          color="red--text"
          @click="deleteBackgroundVideo"
          >Eliminar video</v-btn
        >
      </v-col>

      <v-col cols="12">
        <h1>
          Imagen que se muestra mientras el video está cargando
        </h1>
      </v-col>
      <v-col cols="12">
        <v-file-input
          outlined
          dense
          required
          :rules="imageRules"
          :loading="loadingBackgroundImage"
          v-if="!settings[0].backgroundVideoImage.url"
          v-model="backgroundVideoImage"
          color="deep-purple accent-4"
          placeholder="Seleccionar imagen"
          prepend-icon="mdi-paperclip"
          persistent-hint
          hint="La imagen debe ser de formato PNG o JPG."
          :show-size="1000"
        ></v-file-input>
        <img
          height="150px"
          :src="settings[0].backgroundVideoImage.url"
          v-if="settings[0].backgroundVideoImage.url"
        />
      </v-col>
      <v-col>
        <v-btn
          v-if="settings[0].backgroundVideoImage.url"
          color="red--text"
          @click="deletebackgroundVideoImage"
          >Eliminar imagen</v-btn
        >
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
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
export default {
  name: "simple",
  display: "Simple",
  order: 0,
  components: {
    draggable,
  },
  data: () => ({
    valid: true,
    dragging: false,
    newSliderImg: false,
    dialog: false,
    file: "",
    imageUploaded: null,
    videoUploaded: null,
    backgroundVideoImage: null,
    loadingLogo: false,
    loadingVideo: false,
    loadingBackgroundImage: false,
    editedIndex: -1,
    editedItem: {
      title: "",
      subtitle: "",
      sliderImg: "",
      buttonText: "",
      buttonURL: "",
    },
    newOrder: false,
    imageRules: [
      (v) => !!v || "El archivo es requerido",
      (v) => (v && v.size > 0) || "El archivo es requerido",
    ],
  }),
  methods: {
    async deleteBackgroundVideo() {
      try {
        const result = await this.$store.dispatch(
          "sliders/deleteBackgroundVideo",
          {
            _id: this.settings[0]._id,
            deleteBackgroundVideo: this.settings[0].videobackground.public_id,
          },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          this.cleanForm();
          await this.getSettings();
          this.$store.dispatch("setSnackbar", {
            text: `Se eliminó correctamente el sliders con video.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo eliminar el slider con video.`,
          color: "red",
        });
      }
    },
    async deletebackgroundVideoImage() {
      try {
        const result = await this.$store.dispatch(
          "sliders/deleteBackgroundVideoImage",
          {
            _id: this.settings[0]._id,
            deleteBackgroundVideoImage: this.settings[0].backgroundVideoImage
              .public_id,
          },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          this.cleanForm();
          await this.getSettings();
          this.$store.dispatch("setSnackbar", {
            text: `Se eliminó correctamente la imagen de fondo del slider con video.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo eliminar la imagen de fondo del slider con video.`,
          color: "red",
        });
      }
    },

    validate() {
      return this.$refs.form.validate();
    },
    async activeBackgroundVideo() {
      await this.$store.dispatch(
        "sliders/activeBackgroundVideo",
        {
          _id: this.settings[0]._id,
          isBackgroundVideoActivated: this.settings[0]
            .isBackgroundVideoActivated,
        },
        {
          root: true,
        }
      );
      await this.getSliders();
    },
    async saveNewSliderOverlayLevel() {
      await this.$store.dispatch(
        "sliders/setSliderOverlayLevel",
        {
          _id: this.settings[0]._id,
          sliderOverlayLevel: this.settings[0].sliderOverlayLevel,
        },
        {
          root: true,
        }
      );
    },
    async saveNewOrder() {
      try {
        let me = this;
        const result = await this.$store.dispatch(
          "sliders/setSlidersOrder",
          { sliders: this.sliders },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          await me.getSliders();
          me.$store.dispatch("setSnackbar", {
            text: `Se modificó correctamente el orden de los sliders.`,
          });
        }
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo modificar el orden de los sliders.`,
          color: "red",
        });
      }
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
    save() {
      if (this.editedIndex > -1) {
        this.updateSlider();
      } else {
        this.createSlider();
      }
    },
    async createVideoSlider() {
      if (this.file === "") {
        return;
      }
      this.loadingVideo = true;

      let formData = new FormData();

      formData.append("video", this.file);

      const result = await this.$store.dispatch(
        "sliders/createVideoSlider",
        formData,
        {
          root: true,
        }
      );

      if (result.status === 204) {
        this.$store.dispatch("setSnackbar", {
          text: `Se creó correctamente el slider con video.`,
        });
        this.cleanForm();
        this.getSettings();
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo crear el slider.`,
          color: "red",
        });
      }
    },
    async createBackgroundImageSlider() {
      if (this.file === "") {
        return;
      }
      this.loadingBackgroundImage = true;

      let formData = new FormData();

      formData.append("_id", this.settings[0]._id);
      formData.append("image", this.file);

      console.log("jeje");

      const result = await this.$store.dispatch(
        "sliders/createBackgroundImageSlider",
        formData,
        {
          root: true,
        }
      );

      if (result.status === 204) {
        this.$store.dispatch("setSnackbar", {
          text: `Se creó correctamente la imagen de fondo para el slider con video.`,
        });
        this.cleanForm();
        this.getSettings();
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo crear la imagen de fondo para el slider con video.`,
          color: "red",
        });
      }
    },
    async createSlider() {
      try {
        if (this.validate()) {
          if (this.file === "") {
            return;
          }
          this.loadingLogo = true;
          let formData = new FormData();

          formData.append("title", this.editedItem.title);
          formData.append("subtitle", this.editedItem.subtitle);
          formData.append("buttonText", this.editedItem.buttonText);
          formData.append("buttonURL", this.editedItem.buttonURL);
          formData.append("image", this.file);

          const result = await this.$store.dispatch(
            "sliders/createSlider",
            formData,
            { root: true }
          );
          if (result.status === 204) {
            await this.getSliders();
            this.$store.dispatch("setSnackbar", {
              text: `Se agregó correctamente al slider.`,
            });
          }
          this.cleanForm();
        }
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo agregar al slider.`,
          color: "red",
        });
      }
    },
    async updateSlider() {
      try {
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
            formData.append("image", this.file);
          }

          const result = await me.$store.dispatch(
            "sliders/updateSlider",
            formData,
            { root: true }
          );
          if (result.status === 204) {
            await me.getSliders();
            me.$store.dispatch("setSnackbar", {
              text: `Se actualizó correctamente al slider.`,
            });
          }
          this.newSliderImg = false;
          this.cleanForm();
        }
      } catch (error) {
        console.log(e);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo actualizar al slider.`,
          color: "red",
        });
      }
    },
    async deleteSlider(slider) {
      try {
        let me = this;
        confirm("Estás a punto de eliminar el slider, ¿Continuar?") &&
          deleteConfirmed();

        async function deleteConfirmed() {
          const result = await me.$store.dispatch(
            "sliders/deleteSlider",
            {
              id: slider._id,
            },
            { root: true }
          );
          if (result.status === 204) {
            await me.getSliders();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente al slider.`,
            });
          }
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo eliminar al slider.`,
          color: "red",
        });
      }
    },
    cleanForm() {
      this.editedIndex = -1;
      this.loadingLogo = false;
      this.loadingVideo = false;
      this.loadingBackgroundImage = false;
      this.editedItem._id = "";
      this.editedItem.title = "";
      this.editedItem.subtitle = "";
      this.editedItem.buttonText = "";
      this.editedItem.buttonURL = "";
      this.editedItem.sliderImg = "";
      this.file = "";
      this.imageUploaded = null;
      this.videoUploaded = null;
      this.backgroundVideoImage = null;
      this.dialog = false;
    },
    async getSliders() {
      await this.$store.dispatch("sliders/getSliders", null, {
        root: true,
      });
    },
    async getSettings() {
      await this.$store.dispatch("settings/getSettings", null, {
        root: true,
      });
    },
    checkMove: function(e) {
      this.newOrder = true;
    },
  },
  watch: {
    imageUploaded: function() {
      this.file = event.target.files[0];
    },
    videoUploaded: function() {
      this.file = event.target.files[0];
      this.createVideoSlider();
    },
    backgroundVideoImage: function() {
      this.file = event.target.files[0];
      this.createBackgroundImageSlider();
    },
  },
  async created() {
    await this.getSettings();
    await this.getSliders();
  },
  computed: {
    ...mapGetters("settings", ["settings"]),
    ...mapGetters("sliders", ["sliders"]),
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
