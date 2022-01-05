<template>
  <div>
    <h1 class="pb-6">Categorías</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="categories"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando categorías... Por favor espere."
        no-data-text="No hay información de categorías, por favor cargue nuevas categorías."
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
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >Agregar categoría</v-btn
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
                        required
                      ></v-text-field>
                      <v-switch
                        v-model="editedItem.state"
                        :label="`¿Categoría activa?`"
                      ></v-switch>
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
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  data: () => ({
    categories: [],
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      state: true,
    },
    defaultItem: {
      name: "",
      state: "1",
    },
    search: "",
    headers: [
      {
        text: "Categoría",
        align: "start",
        filterable: true,
        value: "name",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
  }),
  methods: {
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
          "portfoliocategories/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente la categoría.`,
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
          "portfoliocategories/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function() {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente la categoría.`,
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let me = this;
      let portfolioId = item._id;
      confirm("Estás a punto de eliminar la categoría ¿Continuar?") &&
        axios
          .delete("portfoliocategories", {
            params: { id: portfolioId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente la categoría.`,
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
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };

      if (this.editedIndex > -1) {
        me.$store.dispatch("setLoadingOverlay");

        axios
          .put(
            "portfoliocategories",
            {
              _id: this.editedItem._id,
              name: this.editedItem.name,
              state: this.editedItem.state,
            },
            configuration
          )
          .then(function() {
            me.initialize();
            me.$store.dispatch("removeLoadingOverlay");
            me.$store.dispatch("setSnackbar", {
              text: "Se actualizó correctamente la categoría.",
            });
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("removeLoadingOverlay");
            me.$store.dispatch("setSnackbar", {
              text:
                "Hubo un error al actualizar la categoría, por favor actualice la página e intente nuevamente.",
              color: "error",
            });
          });
      } else {
        me.$store.dispatch("setLoadingOverlay");

        axios
          .post(
            "portfoliocategories",
            {
              name: this.editedItem.name,
              state: this.editedItem.state,
            },
            configuration
          )
          .then(function() {
            me.initialize();
            me.$store.dispatch("removeLoadingOverlay");
            me.$store.dispatch("setSnackbar", {
              text: "Se agregó correctamente la categoría.",
            });
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("removeLoadingOverlay");
            me.$store.dispatch("setSnackbar", {
              text:
                "Hubo un error al agregar la categoría, por favor actualice la página e intente nuevamente.",
              color: "error",
            });
          });
      }
      this.cleanForm();
      this.close();
    },
    cleanForm() {
      this.editedItem.name = "";
      this.editedItem.state = "";
    },
    initialize() {
      let me = this;
      axios
        .get("portfoliocategories")
        .then(function(response) {
          me.categories = response.data;
          me.loadingData = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva categoría" : "Editar categoría";
    },
  },
  created() {
    this.initialize();
  },
};
</script>

<style scoped lang="scss">
.inpFile {
  display: none;
}
.skeleton {
  display: inline-grid !important;
  border: 3px solid #fff;
  margin-bottom: 20px;
}
</style>
