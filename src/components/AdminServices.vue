<template>
  <div>
    <h1 class="pb-6">Servicios</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="services"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando servicios... Por favor espere."
        no-data-text="No hay información de servicios, por favor cargue nuevos servicios."
      >
        <template v-slot:item.state="{ item }">
          <v-chip :color="getStateColor(item.state)" dark>
            {{ getState(item.state) }}
          </v-chip>
        </template>

        <template v-slot:item.clientReview="{ item }">
          <v-chip :color="getReviewColor(item.clientReview)" dark>
            {{ getClientReview(item.clientReview) }}
          </v-chip>
        </template>

        <template v-slot:item.shortdescription="{ item }">
          <v-chip :color="getShortDescriptionColor(item.shortdescription)" dark>
            {{ getShortDescription(item.shortdescription) }}
          </v-chip>
        </template>

        <template v-slot:item.description="{ item }">
          <v-chip :color="getDescriptionColor(item.description)" dark>
            {{ getDescription(item.description) }}
          </v-chip>
        </template>

        <template v-slot:item.servicesimages="{ item }">
          <v-chip :color="getServicesImagesColor(item.servicesimages)" dark>
            {{ getServicesImages(item.servicesimages) }}
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
              <v-dialog v-model="dialog" min-width="100%">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    >Agregar servicio</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row align="center" justify="space-around">
                      <v-col cols="12">
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
                        <v-text-field
                          v-model="editedItem.shortdescription"
                          label="Descripción corta"
                        ></v-text-field>
<!--                         <v-textarea
                          v-model="editedItem.clientReview"
                          label="Reseña del cliente"
                        ></v-textarea>
                        <v-text-field
                          v-model="editedItem.projectExample"
                          label="Proyecto de ejemplo"
                        ></v-text-field> -->
                        <p class="mb-3">Descripción larga:</p>
<!--                         <editor
                          api-key="cbu0y83h3jxnw2n3xk919xg5jen936gd66ez5qzvoqsdi4hb"
                          cloud-channel="5"
                          id="uuid"
                          plugins="image code"
                          tag-name="div"
                          value=""
                          :init="{
                            image_title: true,
                            automatic_uploads: true,
                            height: 500,
                            menubar: true,

                            plugins: ['fullpage'],
                            toolbar: 'undo redo | formatselect | bold italic',
                          }"
                        /> -->
                        <vue-editor
                          class="mb-5"
                          v-model="editedItem.description"
                        />
                      </v-col>

                      <v-col cols="12">
                        <p class="mb-3">
                          Imagen de fondo: (Requerido para que se muestre el
                          servicio)
                        </p>

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
                          <v-col v-if="uploadedImages.length >= 1">
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
                                height="120"
                                type="image"
                              ></v-skeleton-loader>
                            </draggable>
                          </v-col>

                          <v-col
                            v-if="editedItem.servicesimages"
                            class="servicesImages"
                          >
                            <draggable
                              :list="editedItem.servicesimages"
                              ghost-class="ghost"
                              @start="dragging = true"
                              @end="dragging = false"
                            >
                              <div
                                v-for="(image,
                                index) in editedItem.servicesimages"
                                :key="index"
                                class="image-preview"
                                id="imagePreview"
                              >
                                <v-img
                                  :src="image.url"
                                  height="120px"
                                  width="auto"
                                  alt="Image Preview"
                                >
                                  <span
                                    class="removeButton"
                                    @click="deleteServicesImages(index)"
                                    >X</span
                                  ></v-img
                                >
                              </div>
                              <v-skeleton-loader
                                v-if="uploadingEditedArrayImages"
                                class="skeleton"
                                width="200"
                                height="120"
                                type="image"
                              ></v-skeleton-loader>
                            </draggable>
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
import { VueEditor } from "vue2-editor";
import Editor from "@tinymce/tinymce-vue";

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
    VueEditor,
    Editor,
  },
  data: () => ({
    imageRequired: false,
    valid: true,
    nameRules: [(v) => !!v || "Este campo es obligatorio."],
    imageRules: [
      (v) => !!v || "El archivo es requerido",
      (v) => (v && v.size > 0) || "El archivo es requerido",
    ],
    imageEditedUploaded: [],
    deletedImagesPublicID: [],
    uploadedImages: [],
    services: [],
    servicesImages: "",
    uploadingImages: false,
    uploadingEditedArrayImages: false,
    dragging: false,
    imageUploaded: null,
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      clientReview: "",
      shortdescription: "",
      description: "",
      servicesimages: [],
    },
    defaultItem: {
      client: "",
      name: "",
      clientReview: "",
      shortdescription: "",
      description: "",
      servicesimages: [],
      problem: "",
      solution: "",
    },
    search: "",
    headers: [
      {
        text: "Nombre",
        align: "start",
        filterable: true,
        value: "name",
      },
      {
        text: "Slug",
        value: "slug",
      },
      {
        text: "Descripción corta",
        value: "shortdescription",
      },
      {
        text: "Descripción larga",
        value: "description",
      },
/*       {
        text: "Reseñas",
        filterable: true,
        value: "clientReview",
      }, */
      {
        text: "Imágen de fondo",
        filterable: true,
        value: "servicesimages",
      },

      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
  }),
  methods: {
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
    getClientReview(review) {
      if (review.length > 0) return "✔";
      else return "✖";
    },

    getReviewColor(review) {
      if (review.length > 0) return "green";
      else return "red";
    },

    getShortDescription(shortdescription) {
      if (shortdescription.length > 0) return "✔";
      else return "✖";
    },

    getShortDescriptionColor(shortdescription) {
      if (shortdescription.length > 0) return "green";
      else return "red";
    },

    getDescription(description) {
      if (description.length > 0) return "✔";
      else return "✖";
    },

    getDescriptionColor(description) {
      if (description.length > 0) return "green";
      else return "red";
    },

    getServicesImages(servicesimages) {
      if (servicesimages.length > 0) return "✔";
      else return "✖";
    },

    getServicesImagesColor(servicesimages) {
      if (servicesimages.length > 0) return "green";
      else return "red";
    },

    desactivateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "services/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente el servicio.`,
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
          "services/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el servicio.`,
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
    deleteServicesImages(index) {
      let me = this;
      this.editedItem.servicesimages.map(function(i) {
        if (i.index == index) {
          me.deletedImagesPublicID.push(i.public_id);
          me.editedItem.servicesimages.splice(index, 1);
        }
      });
    },

    editItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let me = this;
      let serviceId = item._id;
      confirm("Estás a punto de eliminar el servicio ¿Continuar?") &&
        axios
          .delete("services", {
            params: { id: serviceId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el servicio.`,
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
    validate() {
      return this.$refs.form.validate();
    },

    save() {
      if (
        !this.editedItem.servicesimages.length >= 1 &&
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

          if (me.editedItem.servicesimages.length >= 1) {
            me.editedItem.servicesimages.map(function(i, index) {
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
              "services",
              {
                _id: this.editedItem._id,
                name: this.editedItem.name,
                slug: this.editedItem.slug,
                shortdescription: this.editedItem.shortdescription || "",
                description: this.editedItem.description || "",
                projectExample: this.editedItem.projectExample || "",
                clientReview: this.editedItem.clientReview || "",
                servicesimages: JSON.stringify(uploadedImagesOrdered) || "",
                deletedImagesPublicID: this.deletedImagesPublicID || "",
              },
              configuration
            )
            .then(function() {
              me.initialize();
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text: "Se actualizó correctamente el Servicio.",
              });
            })
            .catch(function(error) {
              console.log(error);
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text:
                  "Hubo un error al actualizar el Servicio, por favor actualice la página e intente nuevamente.",
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
              "services",
              {
                name: this.editedItem.name,
                shortdescription: this.editedItem.shortdescription || "",
                description: this.editedItem.description || "",
                projectExample: this.editedItem.projectExample || "",
                clientReview: this.editedItem.clientReview || "",
                servicesimages: JSON.stringify(uploadedImagesOrdered) || "",
                deletedImagesPublicID: this.deletedImagesPublicID || "",
              },
              configuration
            )
            .then(function() {
              me.initialize();
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text: "Se agregó correctamente el Servicio.",
              });
            })
            .catch(function(error) {
              console.log(error);
              me.$store.dispatch("removeLoadingOverlay");
              me.$store.dispatch("setSnackbar", {
                text:
                  "Hubo un error al agregar el Servicio, por favor actualice la página e intente nuevamente.",
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
      this.editedItem.shortdescription = "";
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
        .get("services")
        .then(function(response) {
          me.services = response.data;
          me.loadingData = false;
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
      this.servicesImages = Array.from(event.target.files);
      this.servicesImages.map(function(file) {
        formData.append("images", file);
      });

      me.uploadingEditedArrayImages = true;

      axios
        .post("services/uploadimage", formData, {
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
              index: me.editedItem.servicesimages.length,
            },
          ];

          me.editedItem.servicesimages = [
            ...me.editedItem.servicesimages,
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
      this.servicesImages = Array.from(event.target.files);
      this.servicesImages.map(function(file) {
        formData.append("images", file);
      });

      me.uploadingImages = true;

      axios
        .post("services/uploadimage", formData, {
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
      return this.editedIndex === -1 ? "Nuevo Servicio" : "Editar Servicio";
    },
  },
  created() {
    this.initialize();
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

.servicesImages div {
  display: flex;
}
</style>
