<template>
  <div>
    <h1 class="pb-6">Presupuestos</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="budgets"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando presupuestos... Por favor espere."
        no-data-text="No hay información de presupuestos, por favor cargue nuevos presupuestos."
      >
        <template v-slot:item.client="{ item }">
          {{ clientName(item) }}
        </template>

        <template v-slot:item.services="{ item }">
          {{ clientServices(item) }}
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ budgetFormatDate(item) }}
        </template>

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
                  >Agregar presupuesto</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row
                      align="center"
                      justify="space-around"
                      v-if="editedIndex == -1"
                    >
                      <v-col cols="12">
                        <v-select
                          label="Seleccione cliente"
                          v-model="editedItem.clients"
                          :items="clientsList"
                          @change="clientAdded"
                        ></v-select>
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
                              @click="deleteEditedService(item)"
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
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="ma-2" @click="close">Cancelar</v-btn>
                  <v-btn class="ma-2" color="success" @click="save">
                    {{ saveTitle }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="view(item)" class="mr-2">mdi-eye</v-icon>
          <v-icon small @click="approvedItem(item)" class="mr-2"
            >mdi-check</v-icon
          >
          <v-icon small @click="desactivateItem(item)" class="mr-2"
            >mdi-cancel</v-icon
          >
          <v-icon small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)" class="mr-2"
            >mdi-delete</v-icon
          >
        </template></v-data-table
      >
    </v-card>
    <template>
      <v-row justify="center">
        <v-dialog v-model="Budgetdialog" persistent width="70%">
          <v-card>
            <v-card-title class="headline"> Presupuesto </v-card-title>
            <v-card-text
              ><div id="budgetTemplate">
                <header>
                  <v-row>
                    <v-col cols="4 frame">
                      <div id="logo">
                        <img :src="imageBase64" id="imagen" />
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div id="datos" class="vertical-align">
                        <p id="encabezado">
                          <b>{{ companyName }}</b
                          ><br />
                          {{ companyAddress }} <br />Telefono: {{ companyPhone
                          }}<br />Email: {{ companyEmail }} <br />
                        </p></div
                    ></v-col>
                    <v-col cols="2">
                      <div id="fact" class="vertical-align">
                        <p>
                          Presupuesto<br />
                          Creado: {{ budgetDate(BudgetInfo.createdAt) }} <br />
                          Vencimiento:
                          {{ budgetDate(expirationDate(BudgetInfo.createdAt)) }}
                        </p>
                      </div>
                    </v-col>
                  </v-row>
                </header>
                <section>
                  <v-row>
                    <v-col cols="12">
                      <table id="facliente">
                        <tbody>
                          <tr>
                            <td id="cliente">
                              <strong>{{
                                BudgetInfo.client.name +
                                  " " +
                                  BudgetInfo.client.lastname
                              }}</strong
                              ><br />
                              <strong>Teléfono:</strong>
                              {{ BudgetInfo.client.phone }}<br />
                              <strong>Email:</strong>
                              {{ BudgetInfo.client.email }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </v-col>
                  </v-row>
                </section>
                <section>
                  <div>
                    <table id="facarticulo">
                      <thead>
                        <tr id="fa">
                          <th>Cantidad</th>
                          <th>Servicio</th>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Precio unitario</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          style="text-align: center"
                          v-for="item in BudgetInfo.services"
                          :key="item.text"
                        >
                          <td>1</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.description }}</td>
                          <td>{{ item.serviceType }}</td>
                          <td>${{ item.price }}</td>
                          <td>${{ item.price }}</td>
                        </tr>
                      </tbody>
                      <br />
                      <tfoot>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th colspan="2" style="text-align: right">
                            SUBTOTAL:
                          </th>
                          <th style="text-align: right">
                            ${{ Math.round(budgetSubTotal) }}
                          </th>
                        </tr>
                        <!--                         <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th colspan="2" style="text-align: right">IVA:</th>
                          <th style="text-align: right">
                            ${{ Math.round((budgetSubTotal * 21) / 100) }}
                          </th>
                        </tr> -->
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th colspan="2" style="text-align: right">TOTAL:</th>
                          <th style="text-align: right">
                            ${{ Math.round(budgetSubTotal) }}
                          </th>
                          <!--  ${{ Math.round(budgetSubTotal * 1.21) }} -->
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
                <br />
                <br />
                <!--                 <footer>
                  <div id="gracias">
                    <p><b>Performant and Reliable Apps.</b></p>
                  </div>
                </footer> -->
              </div></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="darken-1" text @click="Budgetdialog = false">
                Cancelar
              </v-btn>
<!--               <v-btn color="green darken-1" text @click="sendEmail">
                Enviar por email
              </v-btn> -->
              <v-btn color="green darken-1" text @click="createPDF">
                Generar PDF
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
export default {
  data: () => ({
    blob: "",
    budgetSubTotal: 0,
    BudgetInfo: {
      client: "",
    },
    Budgetdialog: false,
    editedItem: {
      name: "",
    },
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    search: "",
    headers: [
      {
        text: "Cliente",
        align: "start",
        filterable: true,
        value: "client",
      },
      {
        text: "Servicios",
        filterable: true,
        value: "services",
      },
      {
        text: "Fecha",
        filterable: true,
        value: "createdAt",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    servicesHeader: [
      {
        text: "Servicio",
        align: "start",
        value: "text",
      },
      { text: "Eliminar servicio", value: "actions" },
    ],
    servicesHeaderEdited: [
      {
        text: "Servicio",
        align: "start",
        value: "name",
      },
      { text: "Eliminar servicio", value: "actions" },
    ],
    budgets: [],
    clientsList: [],
    serviceList: [],
    servicesArray: [],
    servicesList: [],
    updatedServices: [],
    companyImg: "",
    imageBase64: "",
  }),
  methods: {
    getSettings() {
      let me = this;
      axios
        .get("settings")
        .then(function(response) {
          me.aboutInfo = response.data[0].aboutInfo;
          me.companyName = response.data[0].companyName;
          me.companyPhone = response.data[0].companyPhone;
          me.companyEmail = response.data[0].companyEmail;
          me.companyAddress = response.data[0].companyAddress;
          me.phone = response.data[0].whatsapp.phone;
          me.text = response.data[0].whatsapp.text;
          me.facebook = response.data[0].socialMedia.facebook;
          me.instagram = response.data[0].socialMedia.instagram;
          me.google = response.data[0].socialMedia.google;
          me.linkedin = response.data[0].socialMedia.linkedin;
          me.youtube = response.data[0].socialMedia.youtube;
          me.twitter = response.data[0].socialMedia.twitter;
          me.imageURL = response.data[0].logoURL.imageURL;
          me.dataId = response.data[0]._id;
          me.companyImg = response.data[0].logoURL.imageURL;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getStateColor(state) {
      if (state === 1) return "orange";
      if (state === 2) return "green";
      else return "red";
    },
    getState(state) {
      if (state === 1) return "Pendiente de aprobación";
      if (state === 2) return "Aprobado";
      else return "No aprobado";
    },
    clientServices(item) {
      const elements = [];
      item.services.map(function(i) {
        elements.push(i.name);
      });
      return elements.join(", ");
    },
    budgetFormatDate(item) {
      return moment(item.createdAt).format("DD/MM/YYYY");
    },
    budgetDate(item) {
      return moment(item).format("DD/MM/YYYY"); //h:mm:ss
    },
    clientName(item) {
      return item.client.name + " " + item.client.lastname;
    },

    approvedItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "budgets/approved",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function(response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se aprobó correctamente el presupuesto.`,
          });
        })
        .catch(function(error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo aprobar el presupuesto, por favor actualice la página e intente nuevamente.`,
            color: "red",
          });
        });
    },

    desactivateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "budgets/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function(response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `No se aprobó el presupuesto.`,
          });
        })
        .catch(function(error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo desaprobar el presupuesto, por favor actualice la página e intente nuevamente.`,
            color: "red",
          });
        });
    },

    activateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "budgets/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function(response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el presupuesto.`,
          });
        })
        .catch(function(error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo activar el presupuesto, por favor actualice la página e intente nuevamente.`,
            color: "red",
          });
        });
    },

    editItem(item) {
      this.editedIndex = this.budgets.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteEditedService(item) {
      const index = this.editedItem.services.indexOf(item);
      this.editedItem.services.splice(index, 1);
    },
    deleteItem(item) {
      let me = this;
      let budgetId = item._id;
      confirm("Estás a punto de eliminar el presupuesto ¿Continuar?") &&
        axios
          .delete("budgets", {
            params: { id: budgetId },
            headers: { token: me.$store.state.token },
          })
          .then(function(response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el presupuesto.`,
            });
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo eliminar el presupuesto, por favor actualice la página e intente nuevamente.`,
              color: "red",
            });
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
        const servicesEditedSelected = [];
        this.editedItem.services.map(function(i) {
          me.servicesList.map(function(u) {
            if (i.name == u.text) {
              servicesEditedSelected.push(u.value);
            }
          });
        });
        axios
          .put(
            "budgets",
            {
              _id: this.editedItem._id,
              services: servicesEditedSelected,
            },
            configuration
          )
          .then(function(response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se actualizó correctamente el presupuesto.`,
            });
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo actualizar el presupuesto, por favor actualice la página e intente nuevamente.`,
              color: "red",
            });
          });
      } else {
        let me = this;
        let header = { token: this.$store.state.token };
        let configuration = { headers: header };
        const servicesSelected = [];
        this.servicesArray.map(function(i) {
          me.servicesList.map(function(u) {
            if (i.text == u.text) {
              servicesSelected.push(u.value);
            }
          });
        });
        axios
          .post(
            "budgets",
            {
              client: this.editedItem.clients,
              services: servicesSelected,
            },
            configuration
          )
          .then(function(response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se agregó correctamente el presupuesto.`,
            });
            me.servicesArray = [];
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo crear el presupuesto, por favor actualice la página e intente nuevamente.`,
              color: "red",
            });
          });
      }
      this.close();
    },
    initialize() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("budgets", configuration)
        .then(function(response) {
          me.budgets = response.data;
          me.loadingData = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    clientsSelect() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      let clientsList = [];
      axios
        .get("clients", configuration)
        .then(function(response) {
          clientsList = response.data;
          clientsList.map(function(i) {
            me.clientsList.push({ text: i.lastname, value: i._id });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    servicesSelect() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      let serviceList = [];
      axios
        .get("clientservices", configuration)
        .then(function(response) {
          serviceList = response.data;
          serviceList.map(function(i) {
            me.servicesList.push({ text: i.name, value: i._id });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    clientAdded(event) {
      let me = this;
      let id = event;
    },
    servicesAdded(event) {
      let me = this;
      let id = event;
      this.servicesList.map(function(i) {
        if (id == i.value) {
          const repeated = me.servicesArray.findIndex((x) => x.text == i.text);
          if (repeated == -1) {
            me.servicesArray.push({
              text: i.text,
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
      this.servicesList.map(function(i) {
        if (id == i.value) {
          const repeated = me.editedItem.services.findIndex(
            (x) => x.text == i.text
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
    sendEmail() {
      let me = this;
      const template = document.getElementById("budgetTemplate");

      html2canvas(template, {
        scale: 3,
      }).then(function(canvas) {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const pageHeight = 295;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF("p", "mm", "a4", true);
        const position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const blob = doc.output("blob");

        let formData = new FormData();

        formData.append("file", blob);
        formData.append("email", me.BudgetInfo.client.email);
        formData.append("name", me.BudgetInfo.client.name);

        me.$store.dispatch("setLoadingOverlay");

        axios
          .post("budgets/uploadPDF", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: me.$store.state.token,
            },
          })
          .then(function() {
            me.$store.dispatch("removeLoadingOverlay");
            me.$store.dispatch("setSnackbar", {
              text: "Se envío correctamente el presupuesto.",
            });
          })
          .catch(function(error) {
            console.log(error);
            me.$store.dispatch("removeLoadingOverlay");
            me.$store.dispatch("setSnackbar", {
              text:
                "Hubo un error al enviar el presupuesto, por favor actualice la página e intente nuevamente.",
              color: "error",
            });
          });
      });

      this.Budgetdialog = false;
    },
    convertImage() {
      const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            const base64data = reader.result;
            resolve(base64data);
          };
        });
      };
      getBase64FromUrl(this.companyImg).then((data) => {
        this.imageBase64 = data;
      });
    },
    createPDF() {
      let me = this;
      me.$store.dispatch("setLoadingOverlay");
      const template = document.getElementById("budgetTemplate");

      html2canvas(template, {
        scale: 3,
      }).then(function(canvas) {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const pageHeight = 295;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF("p", "mm", "a4", true);
        const position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        me.$store.dispatch("removeLoadingOverlay");
        doc.save("Presupuesto.pdf");
      });
      this.Budgetdialog = false;
    },
    view(item) {
      this.convertImage();
      this.Budgetdialog = true;
      this.BudgetInfo = item;
      let totalprice = 0;
      item.services.map(function(x) {
        totalprice += x.price;
      });
      this.budgetSubTotal = totalprice;
    },
    expirationDate(BudgetInfo) {
      if (BudgetInfo) {
        let date = new Date(BudgetInfo);
        date.setDate(date.getDate() + 15);
        return date;
      } else {
        let date = new Date();
        date.setDate(date.getDate() + 15);
        return date;
      }
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo presupuesto"
        : "Editar presupuesto";
    },
    saveTitle() {
      return this.editedIndex === -1 ? "Generar" : "Actualizar";
    },
  },
  created() {
    this.initialize();
    this.clientsSelect();
    this.servicesSelect();
    this.getSettings();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#budgetTemplate {
  padding: 20px 60px;
  font-size: 16px;
}
#logo img {
  max-height: 100%;
  max-width: 100%;
  width: 200px;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.frame {
  display: inline-block;
  vertical-align: top;
  position: relative;
}
#imagen {
  width: 200px;
}
.vertical-align {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
}
#fact {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}
#datos {
  float: center;
}

#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 15px;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
}

#facliente {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #f5344f;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#gracias {
  text-align: center;
}
</style>
