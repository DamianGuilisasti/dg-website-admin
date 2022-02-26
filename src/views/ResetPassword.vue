<template>
  <v-app>
    <v-main class="main">
      <v-container class="container" fluid>
        <v-row align="center" class="no-gutters">
          <v-col cols="12" class="d-flex justify-center align-center col-right">
            <div class="login-wrapper pt-sm-0">
              <div class="my-16">
                <p class="display-2 text-center font-weight-medium my-10">
                  Nueva contraseña
                </p>
                <v-form>
                  <v-text-field
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    :type="show ? 'text' : 'password'"
                    v-model="newpassword"
                    maxlength="20"
                    @click:append="show = !show"
                  ></v-text-field>

                  <v-text-field
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Volvé a introducir la contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    :type="show2 ? 'text' : 'password'"
                    :rules="[
                      newpassword === confirmnewpassword ||
                        'Las nuevas contraseñas no coinciden.',
                    ]"
                    maxlength="20"
                    v-model="confirmnewpassword"
                    @click:append="show2 = !show2"
                  ></v-text-field>

                  <v-flex class="red--text" v-if="errorMessage">
                    {{ errorMessage }}
                  </v-flex>
                </v-form>
                <v-row>
                  <v-col cols="12" lg="6" md="6">
                    <v-btn
                      @click="resetPassword"
                      class="btn-login"
                      elevation="2"
                      small
                      >Actualizar contraseña</v-btn
                    >
                  </v-col>
                  <v-col cols="12" lg="6" md="6" class="text-right"
                    ><v-btn class="btn-forget" small text href="/login"
                      >Ir al Login</v-btn
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
export default {
  data: () => ({
    email: "",
    newpassword: "",
    confirmnewpassword: "",
    errorMessage: null,
    show: false,
    show2: false,
  }),
  methods: {
    async resetPassword() {
      try {
        this.$store.dispatch("setLoadingOverlay");
        const result = await this.$store.dispatch(
          "users/resetPassword",
          {
            token: this.$route.params.token,
            password: this.newpassword,
            confirmpassword: this.confirmnewpassword,
          },
          {
            root: true,
          }
        );

        if (result.status === 200) {
          this.$store.dispatch("removeLoadingOverlay");
          this.$store.dispatch("setSnackbar", {
            text: `Se actualizó correctamente la contraseña`,
          });
          this.$router.push("/login");
        }
      } catch (error) {
        if (error.response.status === 404 || 401) {
          this.$store.dispatch("setSnackbar", {
            text: `No se pudo actualizar la contraseña.`,
            color: "red",
          });
          this.$router.push("/login");
        }
      }
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
