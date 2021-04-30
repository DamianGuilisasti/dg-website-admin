<template>
  <div>
    <h1 class="pb-6">Portfolio</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="services"
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
            <v-dialog fullscreen v-model="dialog" max-width="500px">
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
                  <v-container>
                    <v-row align="center" justify="space-around">
                      <v-col cols="12">
                        <v-select
                          label="Seleccione el cliente"
                          v-model="editedItem.serviceType"
                          :items="clients"
                        ></v-select>
                      </v-col>
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
        text: "Cliente",
        align: "start",
        filterable: true,
        value: "client",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    services: [],
    clients: []
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
          "services/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente el portfolio.`,
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
          "services/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el portfolio.`,
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
      confirm("Estás a punto de eliminar el portfolio ¿Continuar?") &&
        axios
          .delete("services/delete", {
            params: { id: serviceId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el portfolio.`,
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
            "services/update",
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
              text: `Se actualizó correctamente el portfolio.`,
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
            "services/add",
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
              text: `Se agregó correctamente el portfolio.`,
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
        .get("services/list", configuration)
        .then(function (response) {
          me.services = response.data;
          me.loadingData = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getClients() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("clients/list", configuration)
        .then(function (response) {
          me.clients = response.data;
        })
        .catch(function (error) {
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>



