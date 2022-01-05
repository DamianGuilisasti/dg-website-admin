<template>
  <div>
    <h1 class="pb-6">Publicaciones</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="posts"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando publicaciones... Por favor espere."
        no-data-text="No hay información de publicaciones, por favor cargue nuevas publicaciones."
      >
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
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >Agregar publicación</v-btn
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
                          v-model="editedItem.title"
                          label="Título"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="space-around">
                      <v-col class="d-flex">
                        <v-select
                          label="Seleccione categoría"
                          v-model="editedItem.category"
                        ></v-select>
                      </v-col>
                      <v-col class="d-flex">
                        <v-btn tile color="success">
                          <v-icon left> mdi-plus </v-icon>
                          nueva categoría
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-row align="center" justify="space-around">
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          solo
                          name="input-7-4"
                          label="Publicación"
                          outlined
                        ></v-textarea>
                      </v-col>
                    </v-row>

                    <v-row align="center" justify="space-around">
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          label="Seleccione autor"
                          v-model="editedItem.author"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.tags"
                          label="Etiquetas"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!--                     <v-row align="center" justify="space-around">
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                        v-if="imagepreview === ''"
                      >
                        <v-file-input
                          label="Imagen principal"
                          chips
                          accept="image/*"
                          show-size
                        ></v-file-input>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                        v-if="imagepreview !== ''"
                      >
                        <img
                          :src="imagepreview"
                          style="width: 100px; height: 100px"
                        />

                        <v-icon
                          @click="deletePreview"
                          dark
                          color="red"
                          style="
                            position: absolute;
                            margin-top: 5px;
                            left: 40px;
                          "
                        >
                          mdi-close
                        </v-icon>
                      </v-col>
                    </v-row>

                    <v-row align="center" justify="space-around">
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                        v-if="imagepreview === ''"
                      >
                        <v-file-input
                          label="Imágenes secundarias"
                          chips
                          accept="image/*"
                          show-size
                        ></v-file-input>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                        v-if="imagepreview !== ''"
                      >
                        <img
                          :src="imagepreview"
                          style="width: 100px; height: 100px"
                        />

                        <v-icon
                          @click="deletePreview"
                          dark
                          color="red"
                          style="
                            position: absolute;
                            margin-top: 5px;
                            left: 40px;
                          "
                        >
                          mdi-close
                        </v-icon>
                      </v-col>
                    </v-row> -->
                  </v-container>
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
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbarAdd" color="success">
        <p>Publicación agregada correctamente.</p>
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbarAdd = false"
            >Cerrar</v-btn
          >
        </template>
      </v-snackbar>

      <v-snackbar v-model="snackbarUpdate" color="success">
        <p>Publicación actualizada correctamente.</p>
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbarUpdate = false"
            >Cerrar</v-btn
          >
        </template>
      </v-snackbar>

      <v-snackbar v-model="snackbarDelete" color="warning">
        <p>Publicación eliminada correctamente.</p>
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbarDelete = false"
            >Cerrar</v-btn
          >
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    editedItem: {
      title: "",
      category: "",
      author: "",
      tags: "",
    },
    snackbarAdd: "",
    snackbarUpdate: "",
    snackbarDelete: "",
    search: "",
    headers: [
      {
        text: "Título",
        align: "start",
        filterable: true,
        value: "title",
      },
      {
        text: "Categoría",
        filterable: true,
        value: "category",
      },
      {
        text: "Fecha",
        filterable: true,
        value: "date",
      },
      {
        text: "Autor",
        filterable: true,
        value: "author",
      },
      {
        text: "Etiquetas",
        filterable: true,
        value: "tags",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    posts: [],
  }),
  methods: {
    editItem(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.posts.indexOf(item);
      confirm("Estás a punto de eliminar el producto ¿Continuar?") &&
        this.desserts.splice(index, 1);
    },

    close() {
      //this.imagepreview = "";
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      let me = this;
      if (this.editedIndex > -1) {
        axios
          .put("posts/update", {
            // _id: this.editedItem._id,
            // code: this.editedItem.code,
            // name: this.editedItem.name,
            // description: this.editedItem.description,
            // category: this.editedItem.category,
            // stock: this.editedItem.stock,
            // price: this.editedItem.price,
          })
          .then(function (response) {
            me.initialize();
            me.snackbarUpdate = true;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        let me = this;
        let formData = new FormData();

        formData.append("title", "asd"); //this.editedItem.title
        formData.append("category", "asd2"); //this.editedItem.category
        formData.append("author", "asd3"); //this.editedItem.author
        formData.append("tags", "asd4"); //this.editedItem.tags

        axios
          .post("posts/add", formData, {
            headers: {
              Accept: "text/plain",
            },
          })
          .then(function (response) {
            me.snackbarAdd = true;
            me.initialize();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.close();
    },
    initialize() {
      let me = this;
      axios
        .get("posts")
        .then(function (response) {
          me.posts = response.data;
          me.loadingData = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva publicación"
        : "Editar publicación";
    },
  },
  created() {
    this.initialize();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>



