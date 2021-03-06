<template>
  <div>
    <h1 class="pb-6">Gastos</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="expenses"
        :search="search"
        no-data-text="No hay información de gastos, por favor cargue nuevos gastos."
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
                    >Agregar Gasto</v-btn
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
                            v-model.number="editedItem.price"
                            type="number"
                            label="Precio"
                            :rules="priceRules"
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
      price: "",
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
        text: "Precio",
        filterable: true,
        value: "price",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    nameRules: [(v) => !!v || "El nombre es requerido"],
    priceRules: [(v) => !!v || "El precio es requerido"],
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

    async activateItem(item) {
      try {
        const result = await this.$store.dispatch(
          "expenses/activateItem",
          { _id: item._id },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          await this.$store.dispatch("expenses/getExpenses", null, {
            root: true,
          });

          this.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el gasto.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo activar el gasto.`,
          color: "red",
        });
      }
    },

    async desactivateItem(item) {
      try {
        const result = await this.$store.dispatch(
          "expenses/desactivateItem",
          { _id: item._id },
          {
            root: true,
          }
        );
        if (result.status === 204) {
          await this.$store.dispatch("expenses/getExpenses", null, {
            root: true,
          });

          this.$store.dispatch("setSnackbar", {
            text: `Se desactivó correctamente el gasto.`,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo desactivar el gasto.`,
          color: "red",
        });
      }
    },

    editItem(item) {
      this.editedIndex = this.expenses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      try {
        let expenseId = item._id;
        const params = { id: expenseId };
        if (confirm("Estás a punto de eliminar el gasto ¿Continuar?")) {
          const result = await this.$store.dispatch(
            "expenses/deleteExpense",
            params,
            {
              root: true,
            }
          );

          if (result.status === 204) {
            await this.$store.dispatch("expenses/getExpenses", null, {
              root: true,
            });

            this.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el gasto.`,
            });
          }
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          text: `No se pudo eliminar el gasto.`,
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
              price: this.editedItem.price,
            };
            const result = await this.$store.dispatch(
              "expenses/updateExpense",
              params,
              {
                root: true,
              }
            );
            if (result.status === 204) {
              this.$store.dispatch("setSnackbar", {
                text: `Se actualizó correctamente el gasto.`,
              });
            }
          } catch (error) {
            console.log(error);
            this.$store.dispatch("setSnackbar", {
              text: `No se pudo actualizar el gasto.`,
              color: "red",
            });
          }
        } else {
          try {
            const params = {
              name: this.editedItem.name,
              price: this.editedItem.price,
            };

            const result = await this.$store.dispatch(
              "expenses/createExpense",
              params,
              {
                root: true,
              }
            );
            if (result.status === 201) {
              this.$store.dispatch("setSnackbar", {
                text: `Se agregó correctamente el gasto.`,
              });
            }
          } catch (error) {
            console.log(error);
            this.$store.dispatch("setSnackbar", {
              text: `No se pudo crear el gasto.`,
              color: "red",
            });
          }
        }
        await this.$store.dispatch("expenses/getExpenses", null, {
          root: true,
        });
        this.close();
      }
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo gasto" : "Editar gasto";
    },

    ...mapGetters("expenses", ["expenses"]),
  },
  async created() {
    await this.$store.dispatch("expenses/getExpenses", null, {
      root: true,
    });
  },
};
</script>

<style scoped lang="scss"></style>
