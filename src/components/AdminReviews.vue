<template>
  <div>
    <h1 class="pb-6">Reseñas</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="reviews"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando reseñas... Por favor espere."
        no-data-text="No hay información de reseñas, por favor cargue nuevas reseñas."
      >
        <template v-slot:item.state="{ item }">
          <v-chip :color="getStateColor(item.state)" dark>
            {{ getState(item.state) }}
          </v-chip>
        </template>

        <template v-slot:top>
          <v-toolbar flat color="dark">
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar..."
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-dialog v-model="dialog" persistent max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    >Agregar Reseña</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row align="center" justify="space-around">
                        <v-col cols="12">
                          <v-text-field
                            required
                            :rules="nameRules"
                            v-model="editedItem.author"
                            label="Autor"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            required
                            :rules="nameRules"
                            v-model="editedItem.company"
                            label="Empresa"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            required
                            :rules="nameRules"
                            v-model="editedItem.text"
                            label="Texto"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          v-if="uploadedImage == null && editedItem.logo == ''"
                        >
                          <!--                           <div class="addNew d-flex" @click="inputClick">
                            <v-row align="center">
                              <v-col class="text-center">
                                <v-icon size="40">mdi-plus</v-icon>
                                <p>Agregar imagen</p>
                              </v-col>
                            </v-row>
                          </div> -->
                          <v-file-input
                            class="mt-5"
                            label="Logo del cliente"
                            outlined
                            required
                            :rules="imageRules"
                            dense
                            v-model="imageUploaded"
                            color="deep-purple accent-4"
                            placeholder="Seleccionar imagen"
                            prepend-icon="mdi-paperclip"
                            persistent-hint
                            hint="El logo debe ser de formato PNG o JPG."
                            :show-size="1000"
                          ></v-file-input>
                        </v-col>
                        <v-col v-if="uploadedImage">
                          <div class="image-preview" id="imagePreview">
                            <v-img
                              :src="uploadedImage.url"
                              height="120px"
                              width="auto"
                              alt="Image Preview"
                            >
                              <span
                                class="removeButton"
                                @click="deleteSavedImages()"
                                >X</span
                              ></v-img
                            >
                          </div>
                        </v-col>
                        <v-col>
                          <v-skeleton-loader
                            v-if="uploadingImages"
                            class="skeleton"
                            width="200"
                            height="120"
                            type="image"
                          ></v-skeleton-loader
                        ></v-col>
                        <v-col v-if="editedItem.logo" class="servicesImages">
                          <v-img
                            :src="editedItem.logo.url"
                            height="120px"
                            width="auto"
                            alt="Image Preview"
                          >
                            <span
                              class="removeButton"
                              @click="
                                deleteReviewImage(editedItem.logo.public_id)
                              "
                              >X</span
                            ></v-img
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ma-2" @click="close">Cancelar</v-btn>
                    <v-btn
                      class="ma-2"
                      color="success"
                      :disabled="!valid"
                      @click="save"
                    >
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-form>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)" class="mr-2"
            >mdi-delete</v-icon
          >
          <v-icon
            small
            @click="desactivateItem(item)"
            class="mr-2"
            v-if="item.state === 1"
            >mdi-eye-off</v-icon
          >
          <v-icon small @click="activateItem(item)" v-if="item.state === 0"
            >mdi-eye</v-icon
          >
        </template></v-data-table
      >
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    valid: true,
    imageRules: [
      (v) => !!v || "El archivo es requerido",
      (v) => (v && v.size > 0) || "El archivo es requerido",
    ],
    nameRules: [
      (v) => !!v || "Este campo es requerido",
    ],
    deletedLogoId: "",
    loadingData: true,
    imageUploaded: null,
    uploadedImage: null,
    reviews: [],
    uploadingImages: false,
    dialog: false,
    editedIndex: -1,
    editedItem: {
      author: "",
      text: "",
      company: "",
      logo: "",
    },
    search: "",
    headers: [
      {
        text: "Autor",
        align: "start",
        filterable: true,
        value: "author",
      },
      {
        text: "Empresa",
        filterable: true,
        value: "company",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    reviews: [],
  }),
  methods: {
    deleteSavedImages() {
      console.log("jeje");
      if (this.uploadedImage && this.editedIndex == -1) {
        let me = this;
        let header = { token: this.$store.state.token };
        let configuration = { headers: header };
        axios
          .post(
            "reviews/deleteCanceledLogo",
            {
              deletedLogoId: this.uploadedImage.public_id,
            },
            configuration
          )
          .then(function() {
            me.imageUploaded = null;
            me.uploadedImage = null;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    validate() {
      return this.$refs.form.validate();
      /*       if (this.editedItem.logo || this.uploadedImage) {
        console.log(true);
        return true;
      } else {
        console.log(false);
        return false;
      } */
    },
    /*     inputClick() {
      document
        .getElementsByClassName("inpFile")[0]
        .querySelector("button")
        .click();
    }, */
    deleteReviewImage(index) {
      this.deletedLogoId = index;
      this.editedItem.logo.url = "";
    },
    getStateColor(state) {
      if (state === 1) return "green";
      else return "red";
    },
    getState(state) {
      if (state === 1) return "Activa";
      else return "Desactivada";
    },

    desactivateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "reviews/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente la reseña.`,
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    activateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "reviews/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente la reseña.`,
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedIndex = this.reviews.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let me = this;
      let reviewsId = item._id;
      confirm("Estás a punto de eliminar la reseña ¿Continuar?") &&
        axios
          .delete("reviews", {
            params: { id: reviewsId },
            headers: { token: me.$store.state.token },
          })
          .then(function() {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente la reseña.`,
            });
          })
          .catch(function(error) {
            console.log(error);
          });
    },

    close() {
      this.dialog = false;
      if (this.uploadedImage && this.editedIndex == -1) {
        let header = { token: this.$store.state.token };
        let configuration = { headers: header };
        axios
          .post(
            "reviews/deleteCanceledLogo",
            {
              deletedLogoId: this.uploadedImage.public_id,
            },
            configuration
          )
          .then(function() {})
          .catch(function(error) {
            console.log(error);
          });
      }else{
        this.cleanForm();
      }

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });

      this.cleanForm();
    },

    save() {
      if (this.validate()) {
        let me = this;
        let header = { token: this.$store.state.token };
        let configuration = { headers: header };

        if (this.editedIndex > -1) {
          axios
            .put(
              "reviews",
              {
                _id: this.editedItem._id,
                author: this.editedItem.author,
                company: this.editedItem.company,
                text: this.editedItem.text,
                deletedLogoId: this.deletedLogoId,
                newLogo: this.uploadedImage,
              },
              configuration
            )
            .then(function() {
              me.initialize();
              me.$store.dispatch("setSnackbar", {
                text: `Se actualizó correctamente la reseña.`,
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          let me = this;
          let header = { token: this.$store.state.token };
          let configuration = { headers: header };

          axios
            .post(
              "reviews",
              {
                author: this.editedItem.author,
                text: this.editedItem.text,
                company: this.editedItem.company,
                logo: this.uploadedImage,
              },
              configuration
            )
            .then(function() {
              me.initialize();
              me.$store.dispatch("setSnackbar", {
                text: `Se agregó correctamente la reseña.`,
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        }
        this.cleanForm();
        this.close();
      }
    },
    cleanForm() {
      this.editedItem.author = "";
      this.editedItem.text = "";
      this.editedItem.company = "";
      this.editedItem.logo = "";
      this.uploadedImage = null;
    },
    initialize() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("reviews", configuration)
        .then(function(response) {
          me.reviews = response.data;
          me.loadingData = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva reseña" : "Editar reseña";
    },
  },
  watch: {
    imageUploaded: function() {
      let me = this;

      let formData = new FormData();

      formData.append("image", event.target.files[0]);

      me.uploadingImages = true;

      axios
        .post("reviews/uploadimage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: me.$store.state.token,
          },
        })
        .then(function(response) {
          me.uploadedImage = {
            public_id: response.data.public_id,
            url: response.data.url,
          };
          me.uploadingImages = false;
          me.valid = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  created() {
    this.initialize();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.addNew {
  margin-bottom: 10px;
  border-style: dashed !important;
  width: 200px;
  height: 120px;
  cursor: pointer;
  display: inline-flex !important;
  float: left;
}
.removeButton {
  position: absolute;
  top: 10px;
  left: 15px;
  color: "red";
  font-size: 25px;
  cursor: pointer;
}
.logoImg {
  margin-bottom: 20px;
}
.image-preview {
  display: inline-grid !important;
  height: 120px;
  max-width: 200px;
  border: 3px solid #fff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ccc;
}
.image_preview__image {
  display: block;
  width: 100%;
}
.inpFile {
  display: none;
}
.skeleton {
  display: inline-grid !important;
  border: 3px solid #fff;
  margin-bottom: 20px;
}
.servicesImages div {
  display: flex;
}
</style>
