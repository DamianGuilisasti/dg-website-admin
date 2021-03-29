<template>
  <form>
    <h1 class="pb-6">Envío de Factura por Email</h1>
    <v-select
      :items="clients"
      :error-messages="selectErrors"
      label="Seleccionar cliente"
      required
      @change="selectClient"
      @blur="$v.select.$touch()"
      ref="selectedClientName"
    ></v-select>
    <v-text-field
      v-model="selectedClient.name"
      :error-messages="nameErrors"
      :counter="15"
      label="Nombre"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      v-model="subject"
      :error-messages="nameErrors"
      :counter="50"
      label="Asunto"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      v-model="selectedClient.email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    ></v-text-field>
    <v-file-input
      v-model="billUploaded"
      truncate-length="15"
      label="Seleccione factura"
    ></v-file-input>

    <v-btn class="mr-4" color="success" @click="submit"> Enviar </v-btn>
    <v-btn @click="clear"> Resetear </v-btn>
  </form>
</template>


<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
import axios from "axios";
import moment from "moment";

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    select: { required },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },

  data: () => ({
    subject: `Factura Mes ${moment(new Date()).format(
      "MM/YYYY"
    )} - Damián Guilisasti`,
    name: "",
    email: "",
    checkbox: false,
    clients: [],
    clientsList: [],
    selectedClient: {
      name: "",
      email: "",
    },
    BillFile: "",
    billUploaded: null,
  }),
  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    /*     selectErrors() {
      const errors = [];
      if (!this.$v.select.$dirty) return errors;
      !this.$v.select.required && errors.push("Cliente es requerido.");
      return errors;
    }, */
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
  },

  mounted() {
    this.getClients();
  },

  watch: {
    billUploaded: function () {
      this.BillFile = event.target.files[0];
    },
  },

  methods: {
    selectClient(_id) {
      let me = this;
      this.clientsList.map(function (i) {
        if (i._id === _id) {
          me.selectedClient = i;
        }
      });
    },
    getClients() {
      console.log("asd");
      let me = this;
      axios
        .get("/clients/list")
        .then(function (response) {
          me.clientsList = response.data;
          me.clientsList.map(function (i) {
            me.clients.push({ text: i.lastname, value: i._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    submit() {
      let formData = new FormData();
      let me = this;

      formData.append("bill", this.BillFile);
      formData.append("email", this.selectedClient.email);
      formData.append("name", this.selectedClient.name);
      formData.append("subject", this.subject);

      axios
        .post("budgets/uploadBillPDF", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: me.$store.state.token,
          },
        })
        .then(function (response) {
          me.clear();
          me.$store.dispatch("setSnackbar", {
            text: "Se envío correctamente la factura.",
          });
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text:
              "Hubo un error al enviar el presupuesto, por favor actualice la página e intente nuevamente.",
            color: "error",
          });
        });
    },
    clear() {
      this.selectedClient.name = "";
      this.selectedClient.email = "";
      this.$refs["selectedClientName"].reset();
      this.billUploaded = null;
      this.BillFile = "";
    },
  },
};
</script>

<style>
.v-application p {
  margin-bottom: 0px;
}

.imageURL:hover {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>