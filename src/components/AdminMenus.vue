<template>
  <div>
    <h1 class="pb-6">Menu</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="menus"
        :search="search"
        no-data-text="No hay información de menu, por favor cargue nuevos menus."
      >
        <template v-slot:item.state="{ item }">
          <v-chip :color="getStateColor(item.state)" dark>
            {{ getState(item.state) }}
          </v-chip>
        </template>

        <template v-slot:top>
          <v-toolbar flat color="dark">
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar..."
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-form ref="form">
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    >Agregar Menu</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row align="center" justify="space-around">
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Nombre"
                            :rules="nameRules"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.link"
                            label="Link"
                            :rules="linkRules"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ma-2" @click="close">Cancelar</v-btn>
                    <v-btn class="ma-2" color="success" @click="save">
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-form>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)" class="mr-2"
            >mdi-delete</v-icon
          >
          <v-icon
            small
            @click="desactivateItem(item)"
            class="mr-2"
            v-if="item.state === 1"
            >mdi-eye-off</v-icon
          >
          <v-icon small @click="activateItem(item)" v-if="item.state === 0"
            >mdi-eye</v-icon
          >
        </template></v-data-table
      >
    </v-card>

    <h1 class="pt-6">Orden del menu</h1>
    <v-row align="center">
      <v-col cols="12">
        <v-select
          v-model="items"
          :items="menus"
          item-text="name"
          attach
          chips
          label="Orden"
          multiple
          return-object
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" class="mr-3" @click="saveNewOrder"
          >Guardar orden</v-btn
        ></v-col
      ></v-row
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    dialog: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      link: "",
    },
    search: "",
    headers: [
      {
        text: "Nombre",
        align: "start",
        filterable: true,
        value: "name",
      },
      {
        text: "Link",
        filterable: true,
        value: "link",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    nameRules: [(v) => !!v || "El nombre es requerido"],
    linkRules: [(v) => !!v || "El precio es requerido"],
    items: [],
  }),
  methods: {
    getStateColor(state) {
      if (state === 1) return "green";
      else return "red";
    },
    getState(state) {
      if (state === 1) return "Activo";
      else return "Desactivado";
    },

    async saveNewOrder() {
      try {
        if (this.items.length < this.menus.length) {
          this.$store.dispatch("setSnackbar", {
            text: `Todos los items deben estar seleccionados.`,
            color: "red",
          });
          return;
        }
        const result = await this.$store.dispatch(
          "menus/saveNewOrder",
          { menus: this.items },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          await this.$store.dispatch("menus/getMenus", null, {
            root: true,
          });

          this.$store.dispatch("setSnackbar", {
            text: `Se guardó correctamente el nuevo orden del menu.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo guardar el nuevo orden.`,
          color: "red",
        });
      }
    },

    async activateItem(item) {
      try {
        const result = await this.$store.dispatch(
          "menus/activateItem",
          { _id: item._id },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          await this.$store.dispatch("menus/getMenus", null, {
            root: true,
          });

          this.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el menu.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo activar el menu.`,
          color: "red",
        });
      }
    },

    async desactivateItem(item) {
      try {
        const result = await this.$store.dispatch(
          "menus/desactivateItem",
          { _id: item._id },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          await this.$store.dispatch("menus/getMenus", null, {
            root: true,
          });

          this.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente el menu.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo desactivar el menu.`,
          color: "red",
        });
      }
    },

    editItem(item) {
      console.log(item);
      this.editedIndex = this.menus.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      try {
        let menuId = item._id;

        const params = { id: menuId };
        if (confirm("Estás a punto de eliminar el menu ¿Continuar?")) {
          const result = await this.$store.dispatch(
            "menus/deleteMenu",
            params,
            {
              root: true,
            }
          );

          if (result.status === 204) {
            await this.$store.dispatch("menus/getMenus", null, {
              root: true,
            });

            this.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el menu.`,
            });
          }
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo eliminar el menu.`,
          color: "red",
        });
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          try {
            const params = {
              _id: this.editedItem._id,
              name: this.editedItem.name,
              link: this.editedItem.link,
            };
            const result = await this.$store.dispatch(
              "menus/updateMenu",
              params,
              {
                root: true,
              }
            );
            if (result.status === 204) {
              this.$store.dispatch("setSnackbar", {
                text: `Se actualizó correctamente el menu.`,
              });
            }
          } catch (error) {
            console.log(error);
            this.$store.dispatch("setSnackbar", {
              text: `No se pudo actualizar el menu.`,
              color: "red",
            });
          }
        } else {
          try {
            const params = {
              name: this.editedItem.name,
              link: this.editedItem.link,
            };

            const result = await this.$store.dispatch(
              "menus/createMenu",
              params,
              {
                root: true,
              }
            );
            if (result.status === 201) {
              this.$store.dispatch("setSnackbar", {
                text: `Se agregó correctamente el menu.`,
              });
            }
          } catch (error) {
            console.log(error);
            this.$store.dispatch("setSnackbar", {
              text: `No se pudo crear el menu.`,
              color: "red",
            });
          }
        }
        await this.$store.dispatch("menus/getMenus", null, {
          root: true,
        });
        this.close();
      }
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo menu" : "Editar menu";
    },
    ...mapGetters("menus", ["menus"]),
  },
  async created() {
    await this.$store.dispatch("menus/getMenus", null, {
      root: true,
    });
  },
};
</script>

<style scoped lang="scss"></style>
