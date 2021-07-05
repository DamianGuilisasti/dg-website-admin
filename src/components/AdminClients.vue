<template>
  <div>
    <h1 class="pb-6">Clientes</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="clients"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando clientes... Por favor espere."
        no-data-text="No hay información de clientes, por favor cargue nuevos clientes."
      >
        <template v-slot:item.services="{ item }">
          {{ clientServices(item) }}
        </template>

        <template v-slot:item.monthlypayment="{ item }">
          {{ clientMonthlyPayment(item) }}
        </template>

        <!--         <template v-slot:item.totalpayment="{ item }">
          {{ clientTotalPayment(item) }}
        </template> -->

        <template v-slot:item.state="{ item }">
          <v-chip :color="getStateColor(item.state)" dark>
            {{ getState(item.state) }}
          </v-chip>
        </template>

        <template v-slot:item.isPaid="{ item }">
          <v-chip :color="getIsPaidColor(item.isPaid)" dark>
            {{ getIsPaid(item.isPaid) }}
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
                  >Agregar cliente</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Nombre"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.lastname"
                          label="Apellido"
                          :rules="lastnameRules"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                          :rules="emailRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model.number="editedItem.phone"
                          label="Teléfono"
                          type="number"
                          :rules="phoneRules"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.address"
                          label="Dirección"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row
                      align="center"
                      justify="space-around"
                      v-if="editedIndex == -1"
                    >
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          label="Seleccione servicio/s"
                          v-model="editedItem.services"
                          :items="servicesList"
                          @change="servicesAdded"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-row
                      align="center"
                      justify="space-around"
                      v-if="editedIndex > -1"
                    >
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          label="Agregar servicio/s"
                          v-model="updatedServices"
                          :items="servicesList"
                          @change="editedServicesAdd"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-row v-if="editedIndex > -1">
                      <v-col cols="12">
                        <v-data-table
                          :headers="servicesHeaderEdited"
                          :items="editedItem.services"
                          :items-per-page="5"
                          class="elevation-1"
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-icon
                              small
                              @click="deleteClientService(item)"
                              class="mr-2"
                              >mdi-close</v-icon
                            >
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>

                    <v-row v-if="servicesArray.length > 0">
                      <v-col cols="12">
                        <v-data-table
                          :headers="servicesHeader"
                          :items="servicesArray"
                          :items-per-page="5"
                          class="elevation-1"
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-icon
                              small
                              @click="servicesArray.splice(item, 1)"
                              class="mr-2"
                              >mdi-close</v-icon
                            >
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>

                    <!--                     <v-row align="center" v-if="servicesArray.length > 0">
                      <v-col class="d-flex" cols="12">
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Servicio</th>
                                <th class="text-left">Fecha de alta</th>
                                <th class="text-left">Cancelar</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(item, k) in servicesArray"
                                :key="item.text"
                              >
                                <td>{{ item.text }}</td>
                                <td>
                                  <v-menu
                                    :ref="'dialog' + k"
                                    v-model="item.menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="item.date"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="item.serviceDate"
                                        label="Seleccione fecha de alta"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                      ></v-text-field>
                                    </template>

                                    <v-date-picker
                                      v-model="item.serviceDate"
                                      no-title
                                      scrollable
                                    >
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        text
                                        color="primary"
                                        @click="item.menu = false"
                                      >
                                        Cancel
                                      </v-btn>
                                      <v-btn
                                        text
                                        color="primary"
                                        @click="
                                          $refs['dialog' + k][0].save(item.date)
                                        "
                                      >
                                        OK
                                      </v-btn>
                                    </v-date-picker>
                                  </v-menu>
                                </td>
                                <td>
                                    <v-icon
                                      small
                                      @click="servicesArray.splice(item, 1)"
                                      class="mr-2"
                                      >mdi-cancel</v-icon
                                    >
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
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
          <v-icon small @click="deleteClient(item)" class="mr-2"
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
          <v-icon
            small
            @click="isNotPaidItem(item)"
            class="mr-2"
            v-if="item.isPaid === true"
            >mdi-currency-usd-off</v-icon
          >
          <v-icon small @click="isPaidItem(item)" v-if="item.isPaid === false"
            >mdi-currency-usd</v-icon
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
    updatedServices: [],
    item: {
      menu: false,
    },
    servicesList: [],
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      services: "",
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
        text: "Apellido",
        filterable: true,
        value: "lastname",
      },
      {
        text: "Email",
        filterable: true,
        value: "email",
      },
      {
        text: "Teléfono",
        filterable: true,
        value: "phone",
      },
      {
        text: "Servicios",
        filterable: true,
        value: "services",
      },
      {
        text: "Pago mensual",
        filterable: true,
        value: "monthlypayment",
      },
      {
        text: "Abonado",
        filterable: true,
        value: "isPaid",
      },
      /*       {
        text: "Total pagado",
        filterable: true,
        value: "totalpayment",
      }, */
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    servicesHeader: [
      {
        text: "Servicio",
        align: "start",
        value: "text",
      },
      /*       {
        text: "Fecha de alta",
        value: "serviceDate",
      }, */
      { text: "Eliminar servicio", value: "actions" },
    ],
    servicesHeaderEdited: [
      {
        text: "Servicio",
        align: "start",
        value: "name",
      },
      /*       {
        text: "Fecha de alta",
        value: "serviceDate",
      }, */
      { text: "Eliminar servicio", value: "actions" },
    ],
    servicesArray: [],
    clients: [],
    nameRules: [
      (v) => !!v || "El nombre es requerido",
      (v) => (v && v.length >= 3) || "El nombre debe ser mayor a 3 caracteres",
    ],
    lastnameRules: [
      (v) => !!v || "El apellido es requerido",
      (v) =>
        (v && v.length >= 3) || "El apellido debe ser mayor a 3 caracteres",
    ],
    emailRules: [
      (v) => !!v || "El email es requerido",
      (v) => /.+@.+\..+/.test(v) || "El email debe ser válido",
    ],
    phoneRules: [
      (v) =>
        typeof v == "number" ||
        "El teléfono debe ser válido, escribir solo números",
    ],
  }),
  methods: {
    //Services

    deleteClientService(item) {
      const index = this.editedItem.services.indexOf(item);
      this.editedItem.services.splice(index, 1);
    },

    servicesAdded(event) {
      let me = this;
      let id = event;
      this.servicesList.map(function (i) {
        if (id == i.value) {
          const repeated = me.servicesArray.findIndex((x) => x.text == i.text);
          if (repeated == -1) {
            me.servicesArray.push({
              text: i.text,
              //serviceDate: new Date().toISOString().substr(0, 10),
            });
          } else {
            me.$store.dispatch("setSnackbar", {
              text: `Este servicio ya fue agregado.`,
              color: "red",
            });
          }
        }
      });
    },

    editedServicesAdd(event) {
      let me = this;
      let id = event;
      this.servicesList.map(function (i) {
        if (id == i.value) {
          const repeated = me.editedItem.services.findIndex(
            (x) => x.name == i.text
          );
          if (repeated == -1) {
            me.editedItem.services.push({
              name: i.text,
            });
          } else {
            me.$store.dispatch("setSnackbar", {
              text: `Este servicio ya fue agregado.`,
              color: "red",
            });
          }
        }
      });
    },

    servicesSelect() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      let serviceList = [];
      axios
        .get("services/list", configuration)
        .then(function (response) {
          serviceList = response.data;
          serviceList.map(function (i) {
            me.servicesList.push({ text: i.name, value: i._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clientServices(item) {
      const elements = [];
      item.services.map(function (i) {
        elements.push(i.name);
      });
      return elements.join(", ");
    },
    clientMonthlyPayment(item) {
      let price = 0;
      item.services.map(function (i) {
        price += i.price;
      });
      return price;
    },

    //DataTable

    getStateColor(state) {
      if (state === 1) return "green";
      else return "red";
    },
    getState(state) {
      if (state === 1) return "Activo";
      else return "Desactivado";
    },

    getIsPaidColor(isPaid) {
      if (isPaid === true) return "green";
      else return "red";
    },
    getIsPaid(isPaid) {
      if (isPaid === true) return "Si";
      else return "No";
    },

    desactivateItem(item) {
      let me = this;
      axios
        .put("clients/desactivate", {
          _id: item._id,
        })
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente el cliente ${
              item.name + " " + item.lastname
            }.`,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    activateItem(item) {
      let me = this;
      axios
        .put("clients/activate", {
          _id: item._id,
        })
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el cliente ${
              item.name + " " + item.lastname
            }.`,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    isPaidItem(item) {
      let me = this;
      axios
        .put("clients/clientIsPaid", {
          _id: item._id,
        })
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `El cliente ${
              item.name + " " + item.lastname
            } pagó correctamente.`,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    isNotPaidItem(item) {
      let me = this;
      axios
        .put("clients/clientIsNotPaid", {
          _id: item._id,
        })
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `El cliente ${
              item.name + " " + item.lastname
            } no abonó el servicio.`,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //Init

    initialize() {
      let me = this;
      axios
        .get("clients/list")
        .then(function (response) {
          me.clients = response.data;
          if (response.data.length == 0) {
            me.loadingData = false;
          }
          me.loadingData = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /*     clientServices(item) {
      const elements = [];
      item.services.map(function (i) {
        elements.push(i.service.name);
      });
      return elements.join(", ");
    }, */

    /* clientTotalPayment(item) {
      //obtener la cantidad de DIAS que el cliente tuvo/tiene el servicio.
      //dividir el costo del servicio /30 así se calcula cuanto paga por día.
      //calcular diferencia de dias entre la fecha que solicitó el servicio y la fecha actual.
      const today = new Date();

      // To calculate the time difference of two dates
      //const Difference_In_Time = today - item.services.  date1.getTime();

      // To calculate the no. of days between two dates
      //const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      let total = 0;

      item.services.map(function (i) {
        // let time = today - i.serviceDate.date.getTime();
        // let days = time / (1000 * 3600 * 24);
        // let subtotal = days * i.service.price;
        // total += subtotal;
        // console.log(total);
      });

      let price = 0;
      item.services.map(function (i) {
        price += i.service.price;
      });
      return price;
    }, */

    //Edit

    editItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    //Delete

    deleteClient(item) {
      let me = this;
      let clientId = item._id;
      confirm("Estás a punto de eliminar el cliente ¿Continuar?") &&
        axios
          .delete("clients/delete", {
            params: { id: clientId },
          })
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el cliente ${
                item.name + " " + item.lastname
              }.`,
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

    //Save

    save() {
      let me = this;
      if (this.editedIndex > -1) {
        const servicesUpdated = [];

        this.editedItem.services.map(function (i) {
          console.log(i);
          me.servicesList.map(function (u) {
            if (i.name == u.text) {
              servicesUpdated.push(u.value);
            }
          });
        });

        axios
          .put("clients/update", {
            _id: this.editedItem._id,
            name: this.editedItem.name,
            lastname: this.editedItem.lastname,
            email: this.editedItem.email,
            address: this.editedItem.address,
            phone: this.editedItem.phone,
            services: servicesUpdated,
          })
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se actualizó correctamente el cliente ${
                response.data.name + " " + response.data.lastname
              }.`,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        let me = this;
        const servicesSelected = [];
        this.servicesArray.map(function (i) {
          me.servicesList.map(function (u) {
            if (i.text == u.text) {
              servicesSelected.push(u.value);
            }
          });
        });
        axios
          .post("clients/add", {
            name: this.editedItem.name,
            lastname: this.editedItem.lastname,
            email: this.editedItem.email,
            address: this.editedItem.address,
            phone: this.editedItem.phone,
            services: servicesSelected,
          })
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se agregó correctamente el cliente ${
                response.data.name + " " + response.data.lastname
              }.`,
            });
          })
          .catch(function (error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `Ocurrió un error, por favor actualice la página y vuelta a intentarlo.`,
              color: "red",
            });
          });
      }
      this.close();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo cliente" : "Editar cliente";
    },
  },
  created() {
    this.initialize();
    this.servicesSelect();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>



