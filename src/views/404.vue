<template>
  <div>
    <!-- Start Header Area -->
    <!-- End Header Area -->
    <!-- Start 404 Page  -->
    <div class="error-page-inner bg_color--4">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="inner">
              <h1 class="heading-title theme-gradient">404!</h1>
              <h3 class="sub-title">Página no encontrada</h3>
              <span>La página que estabas buscando no existe.</span>
              <div class="error-button">
                <router-link class="rn-button-style--2 btn_solid" to="/"
                  >Volver al Inicio</router-link
                >
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  data() {
    return { imageURL: "" };
  },
  created() {
    let me = this;
    axios
      .get("settings/list")
      .then(function (response) {
        me.imageURL = response.data[0].logoURL.imageURL;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
</script>
