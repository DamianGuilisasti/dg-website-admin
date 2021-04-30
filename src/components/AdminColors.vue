<template>
  <v-container>
    <h1>Colores de la Página Web</h1>
    <v-row>
      <v-col>
        <v-color-picker
          dot-size="25"
          mode="hexa"
          swatches-max-height="200"
          v-model="webColor"
        ></v-color-picker>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    webColor: "",
  }),
};
</script>
