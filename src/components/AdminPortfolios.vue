<template>
  <div>
    <h1 class="pb-6">Portfolio</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="portfolios"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando portfolios... Por favor espere."
        no-data-text="No hay información de portfolios, por favor cargue nuevos portfolios."
      >
        <template v-slot:item.state="{ item }">
          <v-chip :color="getStateColor(item.state)" dark>
            {{ getState(item.state) }}
          </v-chip>
        </template>

        <template v-slot:item.client="{ item }">
          {{ clientName(item) }}
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
              <v-dialog v-model="dialog" min-width="70%">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    >Agregar portfolio</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row align="center" justify="space-around">
                      <v-col cols="6">
                        <v-col cols="12">
                          <v-select
                            label="Seleccione el cliente"
                            :rules="nameRules"
                            required
                            v-model="editedItem.client"
                            item-text="lastname"
                            return-object
                            :items="clients"
                          ></v-select>
                          <v-text-field
                            v-model="editedItem.name"
                            label="Nombre"
                            :rules="nameRules"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-if="editedIndex != -1"
                            v-model="editedItem.slug"
                            label="URL Slug"
                          ></v-text-field>
                          <v-textarea
                            v-model="editedItem.description"
                            label="Descripción"
                          ></v-textarea>
                          <v-select
                            label="Seleccione categoría"
                            :rules="nameRules"
                            required
                            v-model="editedItem.category"
                            item-text="name"
                            item-value="_id"
                            :items="categoryList"
                          ></v-select>
                          <v-text-field
                            v-model="editedItem.problem"
                            label="Problema"
                          ></v-text-field>
                          <v-text-field
                            v-model="editedItem.solution"
                            label="Solución"
                          ></v-text-field>
                          <v-text-field
                            v-model="editedItem.link"
                            label="Link del proyecto"
                          ></v-text-field>
                        </v-col>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12">
                                <p class="mb-3">Imágenes: (Máximo 10)</p>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <div class="addNew d-flex" @click="inputClick">
                                  <v-row align="center">
                                    <v-col class="text-center">
                                      <v-icon size="40">mdi-plus</v-icon>
                                      <p>Agregar imagen</p>
                                    </v-col>
                                  </v-row>
                                </div>
                                <v-file-input
                                  v-if="editedIndex == -1"
                                  multiple
                                  outlined
                                  dense
                                  v-model="imageUploaded"
                                  color="deep-purple accent-4"
                                  placeholder="Seleccionar imágenes"
                                  prepend-icon="mdi-paperclip"
                                  persistent-hint
                                  class="mb-3 inpFile"
                                  name="images"
                                ></v-file-input>
                                <v-file-input
                                  v-if="editedIndex != -1"
                                  multiple
                                  outlined
                                  dense
                                  v-model="imageEditedUploaded"
                                  color="deep-purple accent-4"
                                  placeholder="Seleccionar imágenes"
                                  prepend-icon="mdi-paperclip"
                                  persistent-hint
                                  class="mb-3 inpFile"
                                  name="images"
                                ></v-file-input>
                              </v-col>
                              <p v-show="imageRequired" class="red--text">
                                Es obligatorio subir alguna imagen.
                              </p>
                              <v-col
                                cols="12"
                                v-if="uploadedImages.length >= 1"
                              >
                                <draggable
                                  :list="uploadedImages"
                                  ghost-class="ghost"
                                  @start="dragging = true"
                                  @end="dragging = false"
                                >
                                  <div
                                    v-for="(image, index) in uploadedImages"
                                    :key="index"
                                    class="image-preview"
                                    id="imagePreview"
                                  >
                                    <v-img
                                      :src="image.url"
                                      :lazy-src="image.url"
                                      height="120px"
                                      width="auto"
                                      alt="Image Preview"
                                    >
                                      <span
                                        class="removeButton"
                                        @click="deleteSavedImages(index)"
                                        >X</span
                                      ></v-img
                                    >
                                  </div>
                                  <v-skeleton-loader
                                    v-if="uploadingImages"
                                    class="skeleton"
                                    width="200"
                                    height="130"
                                    type="image"
                                  ></v-skeleton-loader>
                                </draggable>
                              </v-col>

                              <v-col
                                v-if="editedItem.portfolioimages"
                                class="portfolioImages"
                              >
                                <draggable
                                  :list="editedItem.portfolioimages"
                                  ghost-class="ghost"
                                  @start="dragging = true"
                                  @end="dragging = false"
                                >
                                  <div
                                    v-for="(image,
                                    index) in editedItem.portfolioimages"
                                    :key="index"
                                    class="image-preview"
                                    id="imagePreview"
                                  >
                                    <v-img
                                      :src="image.url"
                                      :lazy-src="image.url"
                                      height="120px"
                                      width="auto"
                                      alt="Image Preview"
                                    >
                                      <span
                                        class="removeButton"
                                        @click="deletePortfolioImages(index)"
                                        >X</span
                                      ></v-img
                                    >
                                  </div>
                                  <v-skeleton-loader
                                    v-if="uploadingEditedArrayImages"
                                    class="skeleton"
                                    width="200"
                                    height="125"
                                    type="image"
                                  ></v-skeleton-loader>
                                </draggable>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea
                              v-model="editedItem.clientReview"
                              label="Reseña del cliente"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ma-2" @click="close">Cancelar</v-btn>
                    <v-btn class="ma-2" color="success" @click="save">
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
import draggable from "vuedraggable";
import VueUploadMultipleImage from "vue-upload-multiple-image";
export default {
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  components: {
    VueUploadMultipleImage,
    draggable,
  },
  data: () => ({
    imageRequired: false,
    valid: true,
    nameRules: [(v) => !!v || "Este campo es obligatorio."],
    imageRules: [
      (v) => !!v || "El archivo es requerido",
      (v) => (v && v.size > 0) || "El archivo es requerido",
    ],
    categoryList: [],
    imageEditedUploaded: [],
    deletedImagesPublicID: [],
    uploadedImages: [],
    portfolios: [],
    clients: [],
    portfolioImages: "",
    uploadingImages: false,
    uploadingEditedArrayImages: false,
    dragging: false,
    imageUploaded: null,
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    editedItem: {
      client: "",
      name: "",
      clientReview: "",
      description: "",
      portfolioimages: [],
      problem: "",
      solution: "",
      category: [],
    },
    defaultItem: {
      client: "",
      name: "",
      clientReview: "",
      description: "",
      portfolioimages: [],
      problem: "",
      solution: "",
      category: [],
    },
    search: "",
    headers: [
      {
        text: "Cliente",
        align: "start",
        filterable: true,
        value: "client",
      },
      {
        text: "Categoría",
        filterable: true,
        value: `category.name`,
      },
      {
        text: "Slug",
        value: `slug`,
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
  }),
  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    getCategories() {
      let me = this;
      axios
        .get("portfoliocategories")
        .then(function(response) {
          me.categoryList = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    inputClick() {
      document
        .getElementsByClassName("inpFile")[0]
        .querySelector("button")
        .click();
    },
    clientName(item) {
      return item.client.name + " " + item.client.lastname;
    },
    getStateColor(state) {
      if (state === 1) return "green";
      else return "red";
    },
    getState(state) {
      if (state === 1) return "Activo";
      else return "Desactivado";
    },

    desactivateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "portfolios/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente el portfolio.`,
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
          "portfolios/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el portfolio.`,
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    deleteSavedImages(index) {
      let me = this;
      this.uploadedImages.map(function(i) {
        if (i.index == index) {
          me.deletedImagesPublicID.push(i.public_id);
        }
      });
      this.uploadedImages.splice(index, 1);
    },
    deletePortfolioImages(index) {
      let me = this;
      this.editedItem.portfolioimages.map(function(i) {
        if (i.index == index) {
          me.deletedImagesPublicID.push(i.public_id);
        }
      });
      this.editedItem.portfolioimages.splice(index, 1);
    },

    editItem(item) {
      this.editedIndex = this.portfolios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let me = this;
      let portfolioId = item._id;
      confirm("Estás a punto de eliminar el portfolio ¿Continuar?") &&
        axios
          .delete("portfolios", {
            params: { id: portfolioId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el portfolio.`,
            });
          })
          .catch(function(error) {
            console.log(error);
          });
    },

    close() {
      this.initialize();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (
        !this.editedItem.portfolioimages.length >= 1 &&
        !this.uploadedImages.length >= 1
      ) {
        this.valid = false;
        this.imageRequired = true;
      } else {
        this.valid = true;
        this.imageRequired = false;
      }
      if (this.validate() && this.valid) {
        let me = this;
        let header = { token: this.$store.state.token };
        let configuration = { headers: header };

        if (this.editedIndex > -1) {
          const uploadedImagesOrdered = [];

          me.$store.dispatch("setLoadingOverlay");

          if (me.editedItem.portfolioimages.length >= 1) {
            me.editedItem.portfolioimages.map(function(i, index) {
              uploadedImagesOrdered.push({
                public_id: i.public_id,
                url: i.url,
                index,
              });
            });
          }

          me.$store.dispatch("setLoadingOverlay");

          axios
            .put(
              "portfolios",
              {
                _id: this.editedItem._id,
                client: this.editedItem.client._id,
                name: this.editedItem.name,
                slug: this.editedItem.slug,
                description: this.editedItem.description || "",
                problem: this.editedItem.problem || "",
                solution: this.editedItem.solution || "",
                category: this.editedItem.category || "",
                link: this.editedItem.link || "",
                clientReview: this.editedItem.clientReview || "",
                portfolioimages: JSON.stringify(uploadedImagesOrdered) || "",
                deletedImagesPublicID: this.deletedImagesPublicID || "",
              },
              configuration
            )
            .then(function() {
              me.initialize();
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text: "Se actualizó correctamente el Portfolio.",
              });
            })
            .catch(function(error) {
              console.log(error);
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text:
                  "Hubo un error al actualizar el Portfolio, por favor actualice la página e intente nuevamente.",
                color: "error",
              });
            });
        } else {
          const uploadedImagesOrdered = [];

          me.$store.dispatch("setLoadingOverlay");

          if (me.uploadedImages.length >= 1) {
            me.uploadedImages.map(function(i, index) {
              uploadedImagesOrdered.push({
                public_id: i.public_id,
                url: i.url,
                index,
              });
            });
          }

          axios
            .post(
              "portfolios",
              {
                client: this.editedItem.client._id,
                name: this.editedItem.name,
                description: this.editedItem.description || "",
                problem: this.editedItem.problem || "",
                solution: this.editedItem.solution || "",
                category: this.editedItem.category || "",
                link: this.editedItem.link || "",
                clientReview: this.editedItem.clientReview || "",
                portfolioimages: JSON.stringify(uploadedImagesOrdered) || "",
                deletedImagesPublicID: this.deletedImagesPublicID || "",
              },
              configuration
            )
            .then(function() {
              me.initialize();
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text: "Se agregó correctamente el Portfolio.",
              });
            })
            .catch(function(error) {
              console.log(error);
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text:
                  "Hubo un error al agregar el Portfolio, por favor actualice la página e intente nuevamente.",
                color: "error",
              });
            });
        }
        this.cleanForm();
        this.close();
      }
    },
    cleanForm() {
      this.editedItem.client = "";
      this.editedItem.name = "";
      this.editedItem.description = "";
      this.editedItem.problem = "";
      this.editedItem.solution = "";
      this.editedItem.category = "";
      this.editedItem.link = "";
      this.editedItem.clientReview = "";
      this.uploadedImages = "";
      this.deletedImagesPublicID = [];
    },
    initialize() {
      let me = this;
      axios
        .get("portfolios")
        .then(function(response) {
          me.portfolios = response.data;
          me.loadingData = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getClients() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("clients", configuration)
        .then(function(response) {
          me.clients = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  watch: {
    imageEditedUploaded: function() {
      let me = this;

      let formData = new FormData();
      this.portfolioImages = Array.from(event.target.files);
      this.portfolioImages.map(function(file) {
        formData.append("images", file);
      });

      me.uploadingEditedArrayImages = true;

      axios
        .post("portfolios/uploadimage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: me.$store.state.token,
          },
        })
        .then(function(response) {
          const newImage = [
            {
              public_id: response.data[0].public_id,
              url: response.data[0].url,
              index: me.editedItem.portfolioimages.length,
            },
          ];

          me.editedItem.portfolioimages = [
            ...me.editedItem.portfolioimages,
            ...newImage,
          ];
          me.uploadingEditedArrayImages = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    imageUploaded: function() {
      let me = this;

      let formData = new FormData();
      this.portfolioImages = Array.from(event.target.files);
      this.portfolioImages.map(function(file) {
        formData.append("images", file);
      });

      me.uploadingImages = true;

      axios
        .post("portfolios/uploadimage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: me.$store.state.token,
          },
        })
        .then(function(response) {
          me.uploadedImages = [...me.uploadedImages, ...response.data];
          me.uploadingImages = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo portfolio" : "Editar portfolio";
    },
  },
  created() {
    this.initialize();
    this.getClients();
    this.getCategories();
  },
};
</script>

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

.portfolioImages div {
  display: flex;
}
</style>
