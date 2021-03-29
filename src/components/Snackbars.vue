<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="snackbarAdd" color="success">
      <p>Cliente agregado correctamente.</p>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarAdd = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarUpdate" color="success">
      <p>Cliente actualizado correctamente.</p>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarUpdate = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarDelete" color="warning">
      <p>Cliente eliminado correctamente.</p>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbarDelete = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    snackbarAdd: false,
    snackbarUpdate: false,
    snackbarError: false,
    snackbarDelete: false
  }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>



