<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ companyName }}
            </v-list-item-title>
            <v-list-item-subtitle
              color="0027ff
"
            >
              Admin Panel
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin/services" v-if="isAdmin()">
          <v-list-item-action>
            <v-icon>mdi-chart-pie</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Servicios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group prepend-icon="" no-action>
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-account-group-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Clientes</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link to="/admin/clients">
            <v-list-item-content>
              <v-list-item-title>Ver Clientes</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-list-item link to="/admin/clients-services" v-if="isAdmin()">
            <v-list-item-content>
              <v-list-item-title>Servicios</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-laptop</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-list-item link to="/admin/budgets">
            <v-list-item-content>
              <v-list-item-title>Presupuestos</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-file-outline</v-icon>
            </v-list-item-action>
          </v-list-item>

          <!--           <v-list-item link to="/admin/emails">
            <v-list-item-content>
              <v-list-item-title>Enviar Factura</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-email</v-icon>
            </v-list-item-action>
          </v-list-item> -->

          <v-list-item link to="/admin/expenses">
            <v-list-item-content>
              <v-list-item-title>Gastos</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-trending-down</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>

        <v-list-item link to="/admin/users" v-if="isAdmin()">
          <v-list-item-action>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Usuarios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group prepend-icon="" no-action>
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-briefcase-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Portafolio</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link to="/admin/portfolios/list">
            <v-list-item-content>
              <v-list-item-title>Ver Portafolios</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-briefcase-outline</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-list-item link to="/admin/portfolios/categories">
            <v-list-item-content>
              <v-list-item-title>Categorías</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-item link to="/admin/portfolios/slider">
            <v-list-item-content>
              <v-list-item-title>Slider Portfolio</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-image-multiple</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <!--         <v-list-item link to="/admin/configuracion/informacion-nosotros">
          <v-list-item-action>
            <v-icon>mdi-cash-usd-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Facturación</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
 -->

        <!--         <v-list-group prepend-icon="" no-action>
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-post-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Publicaciones</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link to="/admin/blog">
            <v-list-item-content>
              <v-list-item-title>Ver Publicaciones</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-list-item link to="/admin/blog/categories">
            <v-list-item-content>
              <v-list-item-title>Categorías</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted-type</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item link to="/admin/blog/authors">
            <v-list-item-content>
              <v-list-item-title>Autores</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-face</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item link to="/admin/blog/tags">
            <v-list-item-content>
              <v-list-item-title>Etiquetas</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-tag</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group> -->

        <!--         <v-list-item link to="/admin/configuracion/redes-sociales">
          <v-list-item-action>
            <v-icon>mdi-finance</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Reportes</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->

        <v-list-group prepend-icon="" no-action>
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Configuración</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link to="/admin/settings/company">
            <v-list-item-content>
              <v-list-item-title>Empresa</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-office-building</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-item link to="/admin/settings/menu">
            <v-list-item-content>
              <v-list-item-title>Menu</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-menu</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-item link to="/admin/settings/sliderHome">
            <v-list-item-content>
              <v-list-item-title>Slider Home</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-image-multiple</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-item link to="/admin/settings/calltoaction">
            <v-list-item-content>
              <v-list-item-title>Call to Action</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-gesture-tap-button</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-item link to="/admin/settings/clientslogo">
            <v-list-item-content>
              <v-list-item-title>Clientes</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-item link to="/admin/settings/reviews">
            <v-list-item-content>
              <v-list-item-title>Reseñas</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-card-text-outline</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <!--           <v-list-item link to="/admin/settings/colors">
            <v-list-item-content>
              <v-list-item-title>Colores</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-palette</v-icon>
            </v-list-item-icon>
          </v-list-item> -->
        </v-list-group>

        <v-divider></v-divider>

        <v-list-item :href="website">
          <v-list-item-action>
            <v-icon>mdi-play</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Ver Sitio Web</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="adminToolbar">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>
      <!--       <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Buscar"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <v-spacer></v-spacer>

      <!--       <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn> -->

      <v-menu bottom min-width="200px" rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on">
            <v-avatar class="avatar-background" size="40">
              <span class="white--text headline">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar class="avatar-background">
                <span class="white--text headline">{{ initials }}</span>
              </v-avatar>
              <h3 class="pt-4">
                {{ userInfo.name + " " + userInfo.lastname }}
              </h3>
              <p class="caption mt-1">{{ userInfo.email }}</p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text link to="/admin/editaccount">
                Editar cuenta
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> SALIR </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main class="v-main">
      <router-view />
    </v-main>
    <v-footer app>
      <span
        >Powered by
        <a target="_blank" href="https://damianguilisasti.com.ar"
          >Damián Guilisasti</a
        >
        &copy; {{ new Date().getFullYear() }}</span
      >
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "AdminView",
  data: () => ({
    drawer: null,
    userInfo: { rol: [{ name: "" }] },
    initials: "",
    companyName: "",
    dataId: "",
  }),
  computed: {
    website() {
      return (
        "https://" +
        window.location.hostname.split(".")[1] +
        "." +
        window.location.hostname.split(".")[2] +
        "." +
        window.location.hostname.split(".")[3]
      );
    },
  },
  methods: {
    setCompanyURL() {
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      const website =
        "https://" +
        window.location.hostname.split(".")[1] +
        "." +
        window.location.hostname.split(".")[2] +
        "." +
        window.location.hostname.split(".")[3];

      axios
        .put(
          "settings/updateCompanyURL",
          {
            _id: this.dataId,
            companyURL: website,
          },
          configuration
        )
        .then(function() {})
        .catch(function(error) {
          console.log(error);
        });
    },
    getSettings() {
      let me = this;
      axios
        .get("settings")
        .then(function(response) {
          me.companyName = response.data[0].companyName;
          me.dataId = response.data[0]._id;
          me.setCompanyURL();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getUserInfo() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      const userId = this.$store.state.userDB;
      const url = `users/user?_id=${userId}`;
      axios
        .get(url, configuration)
        .then(function(response) {
          me.userInfo = response.data;
          me.initials =
            me.userInfo.name.slice(0, 1) + me.userInfo.lastname.slice(0, 1);
        })
        .catch(function(error) {
          console.log(error);
          me.logout();
        });
    },
    isAdmin() {
      if (this.userInfo.rol[0].name === "Admin") return true;
      else return false;
    },
    logout() {
      this.$store.dispatch("exit");
    },
  },
  async created() {
    this.$store.dispatch("autoLogin");
    this.getUserInfo();
    this.getSettings();

    //this.getTheme();
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.v-main {
  padding: 20px !important;
}
.avatar-background {
  background: $primarycolor;
}
.v-list-item--link:before {
  background-color: #0027ff;
}
.v-navigation-drawer--fixed {
  z-index: 5;
}
</style>
