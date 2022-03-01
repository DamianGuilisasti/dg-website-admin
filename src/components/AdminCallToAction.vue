<template>
  <v-row>
    <v-col cols="12">
      <h1 class="pb-6">Call to action</h1>
      <v-form v-if="calltoaction">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Título"
              v-model="calltoaction.title"
              outlined
              persistent-hint
              hint="Dejar en vacío para desactivarlo - Esta información se mostrará en toda la página."
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Subtítulo"
              v-model="calltoaction.subtitle"
              outlined
              persistent-hint
              hint="Dejar en vacío para desactivarlo - Esta información se mostrará en toda la página."
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-if="calltoaction">
          <v-col cols="12">
            <v-text-field
              label="Texto botón"
              v-model="calltoaction.buttonText"
              outlined
              persistent-hint
              hint="Dejar en vacío para desactivarlo - Esta información se mostrará en toda la página."
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="URL del botón"
              v-model="calltoaction.link"
              outlined
              persistent-hint
              hint="Dejar en vacío para desactivarlo - Esta información se mostrará en toda la página."
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn color="success" class="mr-3" @click="updateCallToAction"
              >Guardar cambios</v-btn
            >
          </v-col>
        </v-row>

        <v-row class="mt-5">
          <v-col cols="12">
            <v-file-input
              :loading="loadingLogo"
              v-if="!calltoaction.backgroundImg.url"
              v-model="imageUploaded"
              color="deep-purple accent-4"
              label="Imagen de fondo"
              placeholder="Seleccionar imagen"
              prepend-icon="mdi-paperclip"
              outlined
              persistent-hint
              hint="La imagen debe ser de formato PNG o JPG."
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
          </v-col>
          <v-col cols="12">
            <p class="mb-3" v-if="calltoaction.backgroundImg.url">
              Imagen de fondo
            </p>
            <img
              height="100px"
              :src="calltoaction.backgroundImg.url"
              v-if="calltoaction.backgroundImg.url"
          /></v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              v-if="calltoaction.backgroundImg.url"
              color="red--text"
              class=""
              @click="deleteBackgroundImage"
              >Eliminar imagen</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    imageFile: "",
    loadingLogo: false,
    callToActionId: "",
    imageUploaded: null,
  }),
  methods: {
    cleanForm() {
      this.imageFile = "";
      this.imageUploaded = null;
      this.loadingLogo = false;
    },
    async getCallToActions() {
      await this.$store.dispatch("calltoactions/getCallToActions", null, {
        root: true,
      });
      if (this.calltoactions.length === 0) {
        this.createCallToAction();
      }
    },
    async createCallToAction() {
      await this.$store.dispatch(
        "calltoactions/createCallToAction",
        {
          title: "",
          subtitle: "",
          link: "",
          buttonText: "",
          backgroundImg: {
            public_id: "",
            url: "",
          },
        },
        {
          root: true,
        }
      );
      await this.getCallToActions();
    },
    async updateBackgroundImage() {
      this.loadingLogo = true;

      if (!event.target.files) {
        this.loadingLogo = false;
        return;
      }

      this.imageFile = event.target.files[0];

      let formData = new FormData();

      formData.append("calltoactionId", this.calltoaction._id);
      formData.append("image", this.imageFile);
      formData.append("public_id", this.calltoaction.backgroundImg.public_id);

      const result = await this.$store.dispatch(
        "calltoactions/updateBackgroundImage",
        formData,
        {
          root: true,
        }
      );

      if (result.status === 204) {
        this.$store.dispatch("setSnackbar", {
          text: `Se agregó correctamente la imagen del CallToAction.`,
        });
        this.cleanForm();
        await this.getCallToActions();
      } else {
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo actualizar la imagen del CallToAction.`,
          color: "red",
        });
        this.cleanForm();
        return;
      }
    },
    async deleteBackgroundImage() {
      try {
        const result = await this.$store.dispatch(
          "calltoactions/deleteBackgroundImage",
          {
            _id: this.calltoaction._id,
            public_id: this.calltoaction.backgroundImg.public_id,
          },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          this.$store.dispatch("setSnackbar", {
            text: `Se eliminó correctamente la imagen del CallToAction.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo eliminar la imagen del CallToAction.`,
          color: "red",
        });
      }
      await this.getCallToActions();
      this.imageFile = "";
      this.imageUploaded = null;
    },
    async updateCallToAction() {
      try {
        const result = await this.$store.dispatch(
          "calltoactions/updateCallToAction",
          {
            _id: this.calltoaction._id,
            title: this.calltoaction.title,
            subtitle: this.calltoaction.subtitle,
            link: this.calltoaction.link,
            buttonText: this.calltoaction.buttonText,
          },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          this.$store.dispatch("setSnackbar", {
            text: `Se actualizó correctamente el CallToAction.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo actualizar el CallToAction.`,
          color: "red",
        });
      }
    },
  },
  computed: {
    ...mapGetters("calltoactions", ["calltoactions"]),
    calltoaction() {
      return this.calltoactions[0];
    },
  },
  async created() {
    await this.getCallToActions();
  },
  watch: {
    imageUploaded: async function() {
      await this.updateBackgroundImage();
    },
  },
};
</script>
