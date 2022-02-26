<template>
  <div>
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
                  >Volver al inicio</router-link
                >
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- End 404 Page  -->
  </div>
</template>