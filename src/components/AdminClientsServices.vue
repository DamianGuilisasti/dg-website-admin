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
                  >Agregar servicio</v-btn
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
                          v-model="editedItem.name"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.description"
                          label="Descripción"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.price"
                          label="Precio"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-select
                          label="Tipo de servicio"
                          v-model="editedItem.serviceType"
                          :items="servicesType"
                        ></v-select>
                      </v-col>
                    </v-row>
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
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    servicesType: ["Fijo", "Mensual", "Anual"],
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      price: "",
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
        text: "Descripción",
        value: "description",
      },
      {
        text: "Tipo de servicio",
        value: "serviceType",
      },
      {
        text: "Precio",
        filterable: true,
        value: "price",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    services: [],
  }),
  methods: {
    //DataTable

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
          "clientservices/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente el servicio.`,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    activateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "clientservices/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el servicio.`,
          });
        })
        .catch(function (error) {
          console.log(error);
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
          .delete("clientservices", {
            params: { id: serviceId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el servicio.`,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
    },

    close() {
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
        axios
          .put(
            "clientservices/update",
            {
              _id: this.editedItem._id,
              name: this.editedItem.name,
              description: this.editedItem.description,
              price: this.editedItem.price,
              serviceType: this.editedItem.serviceType,
            },
            configuration
          )
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se actualizó correctamente el servicio.`,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        let me = this;
        let header = { token: this.$store.state.token };
        let configuration = { headers: header };
        axios
          .post(
            "clientservices/add",
            {
              name: this.editedItem.name,
              description: this.editedItem.description,
              price: this.editedItem.price,
              serviceType: this.editedItem.serviceType,
            },
            configuration
          )
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se agregó correctamente el servicio.`,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.close();
    },
    initialize() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("clientservices", configuration)
        .then(function (response) {
          me.services = response.data;
          me.loadingData = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo servicio" : "Editar servicio";
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



