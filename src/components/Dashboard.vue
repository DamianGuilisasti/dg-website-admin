<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="3" sm="3">
        <v-sheet
          v-if="loading == true"
          :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
          class="pa-3"
        >
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="card-heading"
          ></v-skeleton-loader>
        </v-sheet>
        <v-card v-show="loaded" class="statistics" dark elevation="2">
          <v-card-title class="headline"> {{ monthlyPayment }} </v-card-title>

          <v-card-subtitle>Ingreso mensual.</v-card-subtitle>

<!--           <v-card-actions>
            <v-btn text> Ver estadísticas </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="3">
        <v-sheet
          v-if="loading == true"
          :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
          class="pa-3"
        >
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="card-heading"
          ></v-skeleton-loader>
        </v-sheet>
        <v-card v-show="loaded" class="statistics" dark elevation="2">
          <v-card-title class="headline"> {{ clientsQuantity }} </v-card-title>

          <v-card-subtitle>Clientes.</v-card-subtitle>

<!--           <v-card-actions>
            <v-btn text> Ver estadísticas </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="3">
        <v-sheet
          v-if="loading == true"
          :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
          class="pa-3"
        >
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="card-heading"
          ></v-skeleton-loader>
        </v-sheet>
        <v-card v-show="loaded" class="statistics" dark elevation="2">
          <v-card-title class="headline"> {{ monthlyExpenses }} </v-card-title>

          <v-card-subtitle>Gasto mensual.</v-card-subtitle>

<!--           <v-card-actions>
            <v-btn text> Ver estadísticas </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="3">
        <v-sheet
          v-if="loading == true"
          :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
          class="pa-3"
        >
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="card-heading"
          ></v-skeleton-loader>
        </v-sheet>
        <v-card v-show="loaded" class="statistics" dark elevation="2">
          <v-card-title class="headline">
            {{ monthlyPayment - monthlyExpenses }}
          </v-card-title>

          <v-card-subtitle>Ganancia Neta.</v-card-subtitle>

<!--           <v-card-actions>
            <v-btn text> Ver estadísticas </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    loading: true,
    loaded: false,
    monthlyPayment: 0,
    clientsQuantity: 0,
    monthlyExpenses: 0,
    theme: {
      default: { isDark: false },
    },
  }),
  methods: {
    initializeClients() {
      let me = this;
      let total = 0;
      axios
        .get("clients/list")
        .then(function (response) {
          me.clientsQuantity = response.data.length;
          response.data.map(function (i) {
            i.services.map(function (u) {
              total += u.price;
            });
          });
          me.monthlyPayment = total;
          me.loaded = true;
          me.loading = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    initializeExpenses() {
      let me = this;
      let total = 0;
      axios
        .get("expenses/list")
        .then(function (response) {
          response.data.map(function (i) {
            total += i.price;
          });
          me.monthlyExpenses = total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {
    this.initializeClients();
    this.initializeExpenses();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/styles/variables.scss";

.statistics {
  background: $primarycolor !important;
}
</style>



