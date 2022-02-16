<template>
  <div>
    <h1 class="pb-6">Usuarios</h1>
    <v-data-table
      :headers="headers"
      :items="usersArray"
      :search="search"
      sort-by="code"
      class="elevation-1"
    >
      <template v-slot:item.rol="{ item }">
        {{ userRols(item) }}
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
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >Agregar usuario</v-btn
              >
            </template>
            <v-form ref="form" v-model="valid" lazy-validation>
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
                          v-model="editedItem.username"
                          label="Usuario"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-if="editedIndex === -1"
                          v-model="password"
                          label="Contraseña"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-if="editedIndex !== -1"
                          v-model="newpassword"
                          label="Nueva Contraseña"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-if="editedIndex === -1"
                          v-model="role"
                          :items="userrolList"
                          label="Seleccione Rol"
                          item-value="_id"
                          item-text="name"
                        ></v-select>
                        <v-select
                          v-if="editedIndex !== -1"
                          v-model="role"
                          :items="userrolList"
                          label="Editar Rol"
                          item-text="name"
                          item-value="id"
                        ></v-select>
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
                    @click="save"
                    :disabled="!valid"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
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
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    search: "",
    dialog: false,
    headers: [
      {
        text: "Usuario",
        align: "start",
        sortable: false,
        value: "username",
      },
      { text: "Nombre", value: "name" },
      { text: "Apellido", value: "lastname" },
      { text: "Email", value: "email" },
      { text: "Rol", value: "rol" },
      { text: "Estado", value: "state" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    usersArray: [],
    userrolList: [],
    role: "",
    roleId: "",
    password: "",
    newpassword: "",
    editedIndex: -1,
    editedItem: {
      name: "",
      lastname: "",
      username: "",
      password: "",
      email: "",
      rol: [],
    },
    defaultItem: {
      name: "",
      description: "",
    },
    valid: true,
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
    userRules: [
      (v) => !!v || "El usuario es requerido",
      (v) => (v && v.length >= 3) || "El usuario debe ser mayor a 3 caracteres",
    ],
    passwordRules: [
      (v) => !!v || "La contraseña es requerida",
      (v) =>
        (v && v.length >= 3) || "La contraseña debe ser mayor a 3 caracteres",
    ],
    userroleRules: [(v) => !!v || "El rol es requerido"],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo usuario" : "Editar usuario";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    this.getRols();
  },

  methods: {
    getRols() {
      let me = this;
      axios
        .get("roles")
        .then(function (response) {
          me.userrolList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getRole() {
      let me = this;
      const role = this.editedItem.rol[0].name;
      this.userrolList.map(function (i) {
        if (i.name === role) {
          me.role = i.name;
          me.roleId = i._id;
        }
      });
    },
    userRols(item) {
      const elements = [];
      item.rol.map(function (i) {
        elements.push(i.name);
      });
      return elements.join(", ");
    },
    activateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "users/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente al usuario.`,
          });
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo activar al usuario, por favor actualice e intente nuevamente.`,
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
          "users/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente al usuario.`,
          });
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo desactivar al usuario, por favor actualice e intente nuevamente.`,
            color: "red",
          });
        });
    },
    getStateColor(state) {
      if (state === 1) return "green";
      else return "red";
    },
    getState(state) {
      if (state === 1) return "Activo";
      else return "Inactivo";
    },
    initialize() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("users/", configuration)
        .then(function (response) {
          me.usersArray = response.data;
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo obtener a los usuarios, por favor actualice e intente nuevamente.`,
            color: "red",
          });
        });
    },

    editItem(item) {
      this.editedIndex = this.usersArray.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.getRole();
      this.dialog = true;
    },

    deleteItem(item) {
      let me = this;
      let userId = item._id;
      confirm("Estás a punto de eliminar el usuario, ¿Continuar?") &&
        axios
          .delete("users", {
            params: { id: userId },
            headers: {
              token: me.$store.state.token,
            },
          })
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente al usuario.`,
            });
          })
          .catch(function (error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo eliminar al usuario, por favor actualice e intente nuevamente.`,
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

    validate() {
      return this.$refs.form.validate();
    },

    save() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };

      if (this.validate()) {
        if (this.editedIndex > -1) {
          const roleName = this.role;
          this.userrolList.map(function (i) {
            if (i.name === roleName) {
              me.roleId = i._id;
            }
          });

          axios
            .put(
              "users",
              {
                _id: this.editedItem._id,
                name: this.editedItem.name,
                lastname: this.editedItem.lastname,
                username: this.editedItem.username,
                email: this.editedItem.email,
                password: this.newpassword,
                rol: this.roleId,
              },
              configuration
            )
            .then(function (response) {
              me.initialize();
              me.$store.dispatch("setSnackbar", {
                text: `Se actualizó correctamente al usuario.`,
              });
            })
            .catch(function (error) {
              console.log(error);
              me.$store.dispatch("setSnackbar", {
                text: `No se pudo actualizar al usuario, por favor actualice e intente nuevamente.`,
                color: "red",
              });
            });
        } else {
          axios
            .post(
              "users",
              {
                name: this.editedItem.name,
                lastname: this.editedItem.lastname,
                username: this.editedItem.username,
                email: this.editedItem.email,
                password: this.password,
                rol: this.role,
                state: 1,
              },
              configuration
            )
            .then(function (response) {
              me.initialize();
              me.$store.dispatch("setSnackbar", {
                text: `Se agregó correctamente al usuario.`,
              });
            })
            .catch(function (error) {
              console.log(error);
              me.$store.dispatch("setSnackbar", {
                text: `No se pudo agregar al nuevo usuario, por favor actualice e intente nuevamente.`,
                color: "red",
              });
            });
        }
        this.close();
      }
    },
  },
};
</script>