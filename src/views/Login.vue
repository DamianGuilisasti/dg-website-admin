<template>
  <v-app id="inspire">
    <v-main class="main">
      <v-container class="fill-height container" fluid>
        <v-row align="center" class="no-gutters">
          <v-col lg="7" class="d-flex justify-center align-center col-left">
            <div>
              <v-row>
                <v-col cols="12">
                  <v-img
                    class="panel-img"
                    lazy-src="../assets/Logo Guilisasti Blanco.png"
                    max-height="100%"
                    max-width="30%"
                    src="../assets/Logo Guilisasti Blanco.png"
                  >
                  </v-img>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-center">
                  <p class="panel-text white--text">Panel de Administración</p>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col
            cols="12"
            lg="5"
            class="d-flex justify-center align-center col-right"
          >
            <div class="login-wrapper pt-sm-0">
              <div class="my-16">
                <p class="display-2 text-center font-weight-medium my-10">
                  ¡Hola!
                </p>
                <v-form>
                  <v-text-field
                    label="Email"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="email"
                  ></v-text-field>

                  <v-text-field
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    :type="show ? 'text' : 'password'"
                    v-model="password"
                    @click:append="show = !show"
                  ></v-text-field>

                  <v-flex class="red--text" v-if="errorMessage">
                    {{ errorMessage }}
                  </v-flex>
                </v-form>
                <v-row>
                  <v-col cols="12" lg="6" md="6">
                    <v-btn @click="login" class="btn-login" elevation="2" small
                      >Ingresar</v-btn
                    >
                  </v-col>
                  <v-col cols="12" lg="6" md="6"
                    ><v-btn class="btn-forget" small text
                      >Olvidé la contraseña</v-btn
                    ></v-col
                  >
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  props: {
    source: String,
  },
  data: () => ({
    email: "",
    password: "",
    errorMessage: null,
    show: false,
  }),
  methods: {
    login() {
      let me = this;
      axios
        .post("/user/login", { email: this.email, password: this.password })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          this.$store.dispatch("saveToken", data.token);
          this.$router.push({ name: "Dashboard" });
        })
        .catch(function (error) {
          if (error.response.status === 404 || 401) {
            me.$store.dispatch("setSnackbar", {
              text: `Usuario o contraseña incorrecta.`,
              color: "red",
            });
          }
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.main {
  padding: 0px !important;
}
.container .col-left,
.container .col-right {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.container .col-left {
  background-color: $primarycolor;
}
.container .col-right {
  background-color: #f6f7ff;
}
.d-flex {
  flex-direction: column;
  justify-content: center !important;
  align-items: center;
}
.panel-text {
  font-size: 50px;
  color: #fff;
  font-weight: 500;
}
.btn-login {
  color: #fff !important;
  background: $primarycolor !important;
}
.btn-forget {
  color: $primarycolor !important;
}
.container {
  padding: 0;
}
.panel-img {
  margin: 0 auto;
}
.container .login-wrapper {
  width: auto;
  height: auto;
}
.panel-forget-password {
  color: $primarycolor;
}
html,
body {
  margin: 0;
  height: 100%;
  //overflow: hidden;
}
</style>

