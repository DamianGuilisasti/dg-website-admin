<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>{{ greet() }}</h1>
      </v-col>
    </v-row>
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
          <v-card-title class="headline">
            {{ Math.round(monthlyPayment + annualPayment) }}
          </v-card-title>

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
            {{ Math.round(monthlyPayment + annualPayment - monthlyExpenses) }}
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
    annualPayment: 0,
    clientsQuantity: 0,
    monthlyExpenses: 0,
    theme: {
      default: { isDark: false },
    },
  }),
  methods: {
    greet() {
      const date = new Date();

      const currentTime = date.getHours();

      let greet;

      if (currentTime < 12) {
        greet = "Buenos días";
      } else if (currentTime < 18) {
        greet = "Buenas tardes";
      } else {
        greet = "Buenas noches";
      }

      return greet + " " + this.$store.state.name;
    },
    getMonthlyPayments() {
      let me = this;
      let total = 0;
      axios
        .get("clients/getmonthlypayments")
        .then(function(response) {
          me.clientsQuantity = response.data.length;
          response.data.map(function(i) {
            i.services.map(function(u) {
              total += u.price;
            });
          });
          me.monthlyPayment = total;
          me.loaded = true;
          me.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getAnnualPayments() {
      let me = this;
      let total = 0;
      axios
        .get("clients/getannualpayments")
        .then(function(response) {
          response.data.map(function(i) {
            i.services.map(function(u) {
              total += u.price;
            });
          });
          me.annualPayment = total / 12;
          me.loaded = true;
          me.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    initializeExpenses() {
      let me = this;
      let total = 0;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("expenses", configuration)
        .then(function(response) {
          response.data.map(function(i) {
            total += i.price;
          });
          me.monthlyExpenses = total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  created() {
    this.getMonthlyPayments();
    this.getAnnualPayments();
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
