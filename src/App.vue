<template>
  <v-app id="inspire">
    <v-main>
      <router-view></router-view>
    </v-main>
    <div class="text-center">
      <v-snackbar
        v-model="snackbar.showing"
        :color="snackbar.color"
        timeout="8000"
      >
        <p class="white--text">{{ snackbar.text }}</p>
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbar.showing = false"
            >Cerrar</v-btn
          >
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  data: () => ({
    fab: false,
  }),
  methods: {},
  computed: {
    ...mapState(["snackbar"]),
  },
  mounted() {
    axios
      .get("settings/list")
      .then(function (response) {
        if (response.data.length == 0) {
          axios
            .post("settings/add", {
              aboutInfo: "",
              companyName: "",
              companyPhone: "",
              socialMedia: {
                facebook: "",
                instagram: "",
                twitter: "",
                google: "",
                youtube: "",
                linkedin: "",
              },
              logoURL: {
                public_id: "",
                imageURL: "",
              },
              whatsapp: {
                phone: "",
                text: "",
              },
            })
            .then(function (response) {})
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.v-btn--fab.v-btn--contained {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.v-btn--icon.v-size--default .v-icon,
.v-btn--fab.v-size--default .v-icon {
  height: 30px;
  font-size: 30px;
  width: 30px;
}
.v-btn--fab.v-btn--fixed {
  z-index: 99;
}
.fa-angle-up {
  display: block;
  line-height: 48px;
  font-size: 22px;
  font-weight: 600;
  color: #f9004d;
}
.v-btn--absolute.v-btn--bottom,
.v-btn--fixed.v-btn--bottom {
  bottom: 60px;
}

.v-btn--absolute.v-btn--right,
.v-btn--fixed.v-btn--right {
  right: 50px;
}
</style>


 