<template>
  <div>
    <h1 class="pb-6">Presupuestos</h1>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="budgets"
        :search="search"
        :loading="loadingData"
        loading-text="Cargando presupuestos... Por favor espere."
        no-data-text="No hay información de presupuestos, por favor cargue nuevos presupuestos."
      >
        <template v-slot:item.client="{ item }">
          {{ clientName(item) }}
        </template>

        <template v-slot:item.services="{ item }">
          {{ clientServices(item) }}
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ budgetDate(item) }}
        </template>

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
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >Agregar presupuesto</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row
                      align="center"
                      justify="space-around"
                      v-if="editedIndex == -1"
                    >
                      <v-col cols="12">
                        <v-select
                          label="Seleccione cliente"
                          v-model="editedItem.clients"
                          :items="clientsList"
                          @change="clientAdded"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row
                      align="center"
                      justify="space-around"
                      v-if="editedIndex == -1"
                    >
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          label="Seleccione servicio/s"
                          v-model="editedItem.services"
                          :items="servicesList"
                          @change="servicesAdded"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-row
                      align="center"
                      justify="space-around"
                      v-if="editedIndex > -1"
                    >
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          label="Agregar servicio/s"
                          v-model="updatedServices"
                          :items="servicesList"
                          @change="editedServicesAdd"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-row v-if="editedIndex > -1">
                      <v-col cols="12">
                        <v-data-table
                          :headers="servicesHeaderEdited"
                          :items="editedItem.services"
                          :items-per-page="5"
                          class="elevation-1"
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-icon
                              small
                              @click="deleteEditedService(item)"
                              class="mr-2"
                              >mdi-close</v-icon
                            >
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>

                    <v-row v-if="servicesArray.length > 0">
                      <v-col cols="12">
                        <v-data-table
                          :headers="servicesHeader"
                          :items="servicesArray"
                          :items-per-page="5"
                          class="elevation-1"
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-icon
                              small
                              @click="servicesArray.splice(item, 1)"
                              class="mr-2"
                              >mdi-close</v-icon
                            >
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="ma-2" @click="close">Cancelar</v-btn>
                  <v-btn class="ma-2" color="success" @click="save">
                    {{ saveTitle }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="view(item)" class="mr-2">mdi-eye</v-icon>
          <v-icon small @click="approvedItem(item)" class="mr-2"
            >mdi-check</v-icon
          >
          <v-icon small @click="desactivateItem(item)" class="mr-2"
            >mdi-cancel</v-icon
          >
          <v-icon small @click="editItem(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)" class="mr-2"
            >mdi-delete</v-icon
          >
        </template></v-data-table
      >
    </v-card>
    <template>
      <v-row justify="center">
        <v-dialog v-model="Budgetdialog" persistent width="70%">
          <v-card>
            <v-card-title class="headline"> Presupuesto </v-card-title>
            <v-card-text
              ><div id="budgetTemplate">
                <header>
                  <v-row>
                    <v-col cols="4 frame">
                      <div id="logo">
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGYAAACwCAYAAABNYWjSAAAKN2lDQ1BzUkdCIElFQzYxOTY2LTIuMQAAeJydlndUU9kWh8+9N71QkhCKlNBraFICSA29SJEuKjEJEErAkAAiNkRUcERRkaYIMijggKNDkbEiioUBUbHrBBlE1HFwFBuWSWStGd+8ee/Nm98f935rn73P3Wfvfda6AJD8gwXCTFgJgAyhWBTh58WIjYtnYAcBDPAAA2wA4HCzs0IW+EYCmQJ82IxsmRP4F726DiD5+yrTP4zBAP+flLlZIjEAUJiM5/L42VwZF8k4PVecJbdPyZi2NE3OMErOIlmCMlaTc/IsW3z2mWUPOfMyhDwZy3PO4mXw5Nwn4405Er6MkWAZF+cI+LkyviZjg3RJhkDGb+SxGXxONgAoktwu5nNTZGwtY5IoMoIt43kA4EjJX/DSL1jMzxPLD8XOzFouEiSniBkmXFOGjZMTi+HPz03ni8XMMA43jSPiMdiZGVkc4XIAZs/8WRR5bRmyIjvYODk4MG0tbb4o1H9d/JuS93aWXoR/7hlEH/jD9ld+mQ0AsKZltdn6h21pFQBd6wFQu/2HzWAvAIqyvnUOfXEeunxeUsTiLGcrq9zcXEsBn2spL+jv+p8Of0NffM9Svt3v5WF485M4knQxQ143bmZ6pkTEyM7icPkM5p+H+B8H/nUeFhH8JL6IL5RFRMumTCBMlrVbyBOIBZlChkD4n5r4D8P+pNm5lona+BHQllgCpSEaQH4eACgqESAJe2Qr0O99C8ZHA/nNi9GZmJ37z4L+fVe4TP7IFiR/jmNHRDK4ElHO7Jr8WgI0IABFQAPqQBvoAxPABLbAEbgAD+ADAkEoiARxYDHgghSQAUQgFxSAtaAYlIKtYCeoBnWgETSDNnAYdIFj4DQ4By6By2AE3AFSMA6egCnwCsxAEISFyBAVUod0IEPIHLKFWJAb5AMFQxFQHJQIJUNCSAIVQOugUqgcqobqoWboW+godBq6AA1Dt6BRaBL6FXoHIzAJpsFasBFsBbNgTzgIjoQXwcnwMjgfLoK3wJVwA3wQ7oRPw5fgEVgKP4GnEYAQETqiizARFsJGQpF4JAkRIauQEqQCaUDakB6kH7mKSJGnyFsUBkVFMVBMlAvKHxWF4qKWoVahNqOqUQdQnag+1FXUKGoK9RFNRmuizdHO6AB0LDoZnYsuRlegm9Ad6LPoEfQ4+hUGg6FjjDGOGH9MHCYVswKzGbMb0445hRnGjGGmsVisOtYc64oNxXKwYmwxtgp7EHsSewU7jn2DI+J0cLY4X1w8TogrxFXgWnAncFdwE7gZvBLeEO+MD8Xz8MvxZfhGfA9+CD+OnyEoE4wJroRIQiphLaGS0EY4S7hLeEEkEvWITsRwooC4hlhJPEQ8TxwlviVRSGYkNimBJCFtIe0nnSLdIr0gk8lGZA9yPFlM3kJuJp8h3ye/UaAqWCoEKPAUVivUKHQqXFF4pohXNFT0VFysmK9YoXhEcUjxqRJeyUiJrcRRWqVUo3RU6YbStDJV2UY5VDlDebNyi/IF5UcULMWI4kPhUYoo+yhnKGNUhKpPZVO51HXURupZ6jgNQzOmBdBSaaW0b2iDtCkVioqdSrRKnkqNynEVKR2hG9ED6On0Mvph+nX6O1UtVU9Vvuom1TbVK6qv1eaoeajx1UrU2tVG1N6pM9R91NPUt6l3qd/TQGmYaYRr5Grs0Tir8XQObY7LHO6ckjmH59zWhDXNNCM0V2ju0xzQnNbS1vLTytKq0jqj9VSbru2hnaq9Q/uE9qQOVcdNR6CzQ+ekzmOGCsOTkc6oZPQxpnQ1df11Jbr1uoO6M3rGelF6hXrtevf0Cfos/ST9Hfq9+lMGOgYhBgUGrQa3DfGGLMMUw12G/YavjYyNYow2GHUZPTJWMw4wzjduNb5rQjZxN1lm0mByzRRjyjJNM91tetkMNrM3SzGrMRsyh80dzAXmu82HLdAWThZCiwaLG0wS05OZw2xljlrSLYMtCy27LJ9ZGVjFW22z6rf6aG1vnW7daH3HhmITaFNo02Pzq62ZLde2xvbaXPJc37mr53bPfW5nbse322N3055qH2K/wb7X/oODo4PIoc1h0tHAMdGx1vEGi8YKY21mnXdCO3k5rXY65vTW2cFZ7HzY+RcXpkuaS4vLo3nG8/jzGueNueq5clzrXaVuDLdEt71uUnddd457g/sDD30PnkeTx4SnqWeq50HPZ17WXiKvDq/XbGf2SvYpb8Tbz7vEe9CH4hPlU+1z31fPN9m31XfKz95vhd8pf7R/kP82/xsBWgHcgOaAqUDHwJWBfUGkoAVB1UEPgs2CRcE9IXBIYMj2kLvzDecL53eFgtCA0O2h98KMw5aFfR+OCQ8Lrwl/GGETURDRv4C6YMmClgWvIr0iyyLvRJlESaJ6oxWjE6Kbo1/HeMeUx0hjrWJXxl6K04gTxHXHY+Oj45vipxf6LNy5cDzBPqE44foi40V5iy4s1licvvj4EsUlnCVHEtGJMYktie85oZwGzvTSgKW1S6e4bO4u7hOeB28Hb5Lvyi/nTyS5JpUnPUp2Td6ePJninlKR8lTAFlQLnqf6p9alvk4LTduf9ik9Jr09A5eRmHFUSBGmCfsytTPzMoezzLOKs6TLnJftXDYlChI1ZUPZi7K7xTTZz9SAxESyXjKa45ZTk/MmNzr3SJ5ynjBvYLnZ8k3LJ/J9879egVrBXdFboFuwtmB0pefK+lXQqqWrelfrry5aPb7Gb82BtYS1aWt/KLQuLC98uS5mXU+RVtGaorH1futbixWKRcU3NrhsqNuI2ijYOLhp7qaqTR9LeCUXS61LK0rfb+ZuvviVzVeVX33akrRlsMyhbM9WzFbh1uvb3LcdKFcuzy8f2x6yvXMHY0fJjpc7l+y8UGFXUbeLsEuyS1oZXNldZVC1tep9dUr1SI1XTXutZu2m2te7ebuv7PHY01anVVda926vYO/Ner/6zgajhop9mH05+x42Rjf2f836urlJo6m06cN+4X7pgYgDfc2Ozc0tmi1lrXCrpHXyYMLBy994f9Pdxmyrb6e3lx4ChySHHn+b+O31w0GHe4+wjrR9Z/hdbQe1o6QT6lzeOdWV0iXtjusePhp4tLfHpafje8vv9x/TPVZzXOV42QnCiaITn07mn5w+lXXq6enk02O9S3rvnIk9c60vvG/wbNDZ8+d8z53p9+w/ed71/LELzheOXmRd7LrkcKlzwH6g4wf7HzoGHQY7hxyHui87Xe4Znjd84or7ldNXva+euxZw7dLI/JHh61HXb95IuCG9ybv56Fb6ree3c27P3FlzF3235J7SvYr7mvcbfjT9sV3qID0+6j068GDBgztj3LEnP2X/9H686CH5YcWEzkTzI9tHxyZ9Jy8/Xvh4/EnWk5mnxT8r/1z7zOTZd794/DIwFTs1/lz0/NOvm1+ov9j/0u5l73TY9P1XGa9mXpe8UX9z4C3rbf+7mHcTM7nvse8rP5h+6PkY9PHup4xPn34D94Tz+49wZioAAAAJcEhZcwAALiMAAC4jAXilP3YAACAASURBVHic7N0HYBvV/Qfw3+/dSZYtWwnOgCRAQgIkBEJiS6KMMppCSOJYEhvSAWWU3bICpWWWvUdZpRQ6oC2FgkcW8CdAKYUiWyYNBcIqUHbIsiUlsaV7/3e2AwkksWVLejr5+wHlTrJ899Xw6d5Pd++ZUkoCAIBNSwYixxPJXXTn6C3JbHmjdRdke7nJqkgVGXJ2tpebS5LTf/BG5y7RnWNzEsHIFSylR3eO3rKkfKe8ueEe3TkAAAAgM69NmuQeUzL2Kt05MiElx7zNdX/WnSNfTN0BAAAKmSR5CDPP0p2jt5ioQ02yXpiRptyFic/L9nJzSVrGS2pSsIUZlnQGMQ/WnaO3BPEiNUFhBgAAwGG28oxV7X5n7cepfdoH1QSFGQAAAAAAAAAAyC0UZgAAAAAAAAAANEFhZgvsc/G2LRm3vSHTY5iN7SXR9sQ0iiVVqmklrZ8S2X0EuKnr+bSnQl0s9XNL/XytlBRnlgkiXqmW8YX6/RVE8lNJ/In6+f/SVuq/1J5+17dkwQqdjxcAAAAAAAAA8guFmW4rptRs6zaMPZl5EhPvRkwTx3jGjVM/chEbnffh9Xfmr003TXT/3M1MvvV35g3+Wf/rplAvg8ekZDDyBZF8Q0p+Xd38b0umY0mrY/HWLQsT2XqcAAAAAAAAAFA4BmRhRgjBbdWhSWr2QGbaS0338rhco3TnUoYS8bdVpm/bVww2qEIYHclgZLG6+k9L0nPWunXP4sgaAAAAAAAAgOIwYAozq6unDjaN8hoiMa3NHzqIiUboztRLLnUJ2BfB9BPhKbESgUgLMS2QaVq48JWGlw63rLTukAAAAAAAAACQuaIuzLTtetAQo9QblkyHuYTvQOrq/8XpBDP51dTPBl0001/7aTIQfkyy9eiNzfOeu9SyLN0BAQAAAAAAAKB3iq4w86gQxsyqWQcTixOMMm+tusn1Vb8uxYi3UY/tNCbjtDn+0IeJYPghK5W+v6Jl7pu6kwEAAAAAAGyK3W6bXjXrEN05MmFJ+sAXa3hZdw4oPkVTmEkGZ46Q0nXKTH/oR+rqdrrzaLItE19gmOb5yUDkGUtady9smfs4TnUCAAAAAIBCsu/kaR4hxCO6c2RCSHpQTX6gOwcUH8cXZpLVtVOkED9ldh/DTCW68xQIe8inqYLF1Jn+2ncTwcjt8dTa+zC6EwAAAAAAAEBhcWxhJlEdOoCFuIgM47tFe5ZSVvBY9fzcWmF4fpEMRG5dk1z+qyGvPd+mOxUAAAAAAAAAOLAwkwiGpzLxxWyIA3RncRSmYerfq0rLhpyVCESu/qSt4+4dl85bpzsWAAAAAAAAwEDmmMKMfcoSGcYNTHyg7iyOxjSMiW4Z6TPPjPtDF5Q3NzyqOxIAAAAAAADAQFXwhZkV1aFRJYKvZMP4oboqdOcpHjxWCH4kGYgsslieXh6tf0N3IgAAAAAAAICBpmALM7Fg0DVBjjrbI8QlxOTVnado2Z0ES16cCEau/6S140qc3gQAAAAAAACQPwVZmIlXR/aZYIy6m5gm6c4yIDC5meiikT7XIa3V4R/5YvVR3ZEAAAAAAAAABoKCKsx8VjXdW2F6bhAGnUJ2uQDybVfT4BeSgcgv58carjncstK6AwEAAAAAAAAUs4IpzLQFIntWmCV/ULM76c4ywLmI6YqZ/toDl/sPnj2k+YmPdQcCAAAAAAAAKFbaCzOPCmHM8NdeajBfSMTa88B6vH+pKG1JBMPHeKP1i3SnAQAAAAAAAChGWgshyUm128z0h/6kZr+jMwds1nAmfiIRiFzgbaq7WXcYAAAAAAAAgGKjrTCTCNZ+hz3CLspsoysD9IrJTDclApHdlvJHJ1dHox26AwEAAAAAAAAUCy2FmXgwcqog43Zd64fMMdOPJshR268KTjtscPTJ1brzAAAAAAAAABSDvBZG7P5kZlbX3iiYz8rneiFLmL7rorJnE5Mj072L6z7THQcAAAAAAADA6fJWmFk2aWr5DH/tX1Xrfka+1gnZx0RTyE1/XzGl5ruVr8z7UHceAAAAAAAAACfLS2GmddKMSm+Jb56a3TMf64Oc29ljup5ZufuMqVv9e8H/dIcBAAAAAAAAcKqcF2ZWVIdGeTwlT6jZXXO9Lsgjph1L3CWLkpNq9y1b0vip7jgAAAAAAAAATpTTwsyqwKzRHsN8Vs2OyeV6QBOmHaXHWLAqOO0AdAgMAAAAAAAAkLmcFWY6j5QxzKcJRZmiZvc546ayR2PB4EwMpQ0AAAAAAACQmZwUZpLBmSM8hnuRmh2Xi+VDwTlwPI26S01P0h0EAAAAAAAAwEmyXphZXT11sMvwPalmd872sqFwMdGJcX+ouby54R7dWQAAAAAAAACcIquFmbfH15SM9PkeV7O7ZXO54AyCxW2t1aGYL9bwsu4sAAAAAAAAAE6QtcKMEILj/toH1OwB2VomOAyT2zT4zyvG11RVLp3XqjsOAAAAAAAAQKHLWmGmzV97uWqZH5Ot5YFT8VhPhcvub+b7upMAAAAAAAAAFLqsFGbiwdAhgsRF2VgWFAGm78WD4UfLo/V1uqMAAAAAAAAAFLJ+F2bi/pqJQrh+T539vwJ0EUR3t06ufc63uHGl7iwAAAAAAAAAhapfhZllk6aWez2+x9RsRZbyQNHgbUyXcYWaOUN3EgAAAAAAAIBC1a/CTJnHd5uajM9SFig2TKckq2vvK4s1vqI7CkBfMdOlJOlO3Tl6jaWlOwL0jiTrcJbCpTtHb6UsuVx3BgAAAMjcC82N62ZWh2bozpEJSfSx7gz51OfCTCIYPpKJj89mGCg6BhnGDWp6kO4gAH1VFq2P6c4Axcnb1PC07gwAAABQ/A63rLSaLNSdAzavT4WZFVNqtvWYrl+jVxnohe8mqkK7eVsaXtUdBAAAAAAAAKDQ9KkwU+Jy3aMmg7OcBYqNpFWWpOPKUZQBAAAAAAAA2KSMCzOJYHg2E9fkIgwUE7k4RXy4r7nubd1JAAAAAAAAAApVRoWZeDA8VEi+FacwwZZISQ+sXPbF6du+/8Ia3VkAAAAAAAAACllGhRmWfDUxDctVGAdbR5LWqOemXU3daupRt5UQDbgS1hr1+M/wNtXd79WdBAAAAAAAAMABel2YSQbD1cx8Qi7DFDRJ7cTUpOZi9mk6luQ3UyzfW0P0xYhoffLrd397fE3JMK8cIdgYaQixMxFPUsuYrJbxLfXj8vw/gFyT71KKDy9rqWvRnQQAAAAAAADAKXpVmBFCcNwfut2ezXGeQvOFujxKZNWtZn5+UwWYzfWAvOPSeevU5L3uyz/X3x4LBl07yVF+g+U0knwYMe2eg9z51tCRbjt2UMuiVbqDAAAA9NWjQhgHV80aa7AYZzHtwFJuq24eqT6rt2biQWreR5IqJJGLuWsfSkpKqfmUmkupz/U4sWyVxK3qR19w536EXEaW/Fjd74N0Wn7wofXehxOXLGnX+kBhI58Ew2XllhylXqthLMRw9ToOF2QNUq9jOTOXq9euQr0HSpikqV5/9bqzi+yv7OzXnLhdMrWr1zqubkiqaVKSXE326y95RUqmvuigjo/vaHnq00sty9L9WKF3Phy9T2nl0CE7W2pbwF3bgm3Ua72Neh+oqdoOENnbg1L13jDVa+5St8sNtgXr1Huhjbu2A2p7QJ+rn36ufn+Z2j58bEn+oF2u+QDvCQDYUK8KM23+2iPUZJ8cZykkz6rt5J0ftP+3Yf3OU1mWFlwdjXaoyUvdl1+2BiI7GkzHqu35iZ0bfGdRO6H0i/JYww3q+ZK6wwAAAGSibcrM8YbLtZea3VN9BlfN9Id2o+6P/M5vongTZyTzxucpf3WX9T/gr53HrK6JrttMg2gMjUsnA5H/qsb7G+q2N1Tjf7GUHbGFLQuWHm5Z6Sw/ROjWtutBQ7isbBf1uk5Qz/lOLGknyXK0emW2H0Q81H6NvtQ5K758Hb/5Gm90x6/u9+WUv7zBZJPs/+b4Qx3qdf9Y3fqOeu3fVst8iyS/SuvSr5Qtafw06w8Yeu05MdWs9pf5hTT34q4j26dUDh+2k5oaX34jvaltwddu3vB9stE2YqMfMqn9firlUvs9kUwEI2/a2wH1g9eIZMvajtQrla/M+zBbjw0AnKPHwoz97ZHaUbk8H2F0k5IWpi15iS9WH7WvT8zDOn1NnaMWXRwLBn85Xo46TG2cL3TGUTTyU5mWx3hjDc8WQqk/6Q/PsERnvz7OIK3l5U2Nz+uOYVtdPXWwYVQcoDtHRqS1VD1/r+djVW2ByJ7M0jFFU2lZVkVzY4PuHNCzZDBSY5F06c7Ra2leVh6re0F3jP5YPnHfCo93yHT1gT+TmQ8yXO5RGmIY6nN+R9V021HNz7Kba8wuUvtaSfWeaJJS/kNl++fa1o7nK5fOa9WQz/FaJ9duZZq8l2Sxh2oPV6mbqo0y77brf95dP/tGCS3H7KMqRqupXQya+mUQj0HJQGSZZIqypBelTL+UbE+8NGzJong+ww00K3efsZ3b7Qoxi2lBv+8Aso+CyX/PkGVqlVOo60L2G8LjctmfDZ+pT/MXSfKLaZn+R6wl8fL+1qJU3tP10orq0Ci3wcG+/G654XbOvvt6LLeLB8ORnC0+zQlvrO6pbC/XbtNP99fWZnu5uWRJ63++psZm3TnypcfCjNpR+L6aTMhDFp1elSR/6m2qX6QrQPeRNH8RQjy8uqqm1hDG1er6rrrybJGk54k7jvLG5n+iO8qXmH8vyEkdUxt2UWY/3SlsTBU7CeLHdefIhGTjSjW5OB/rEiR/oXaiZ+VjXVkhDHtb4tYdA3pB0oOCeXNnxBYeQfZn5Hd1x8iU3efbNuVGrWqA/bDUO+QgdZNnc99+a2YfqbMfM3d+Nnh8rpRqoL0sJT3FLBvKovUxzfkKVqJq+nAySw5Us1PV9nof022Mp80e41CAmIaprDPVdCazQd4SX7t67V9S24inyErPLYs1vqI7YjHofJ8YntnqjTG7pKQkQIU7SMfWKlpEpYsY6v0Q9Pta1fvhWSmtJ9el0vWFdkRNiSH2Vk/kX/v0y875K90A76/aHPvnbPGC7C/td8r2Yvfx15Y4bX9fkPGgmvxAd4582WJhxu4PZQKNvKRwt1v9Zo+mdOUb/NF13YUR7bpPCWp4TkydH/BX/FjtYNhHKw3VnaubJClvisbaLizkyj0AAMDqqvAOLoNOG+lzHa+uVurO0wf2Ptreqt2yt9oPu1Q1zN5T1x+jFD040Dvav1wIcU51aA9BslY17Gaw6ZlMxdQPIncW1/dT0/3IMK7ofO2lrEtZ8s++WMPLuuM5TTwQ2U+9V05X75NDyD5yyXnsPm3so3tCHpf4lXo/RElajxKnHiyLFtCXpADQL1sszEygkd9Tnw5j8xUmz94gyzq6rLlhcbXuJJvQXfi4q23Xgx4WZd6bmeiHmiOttiQdX95U/1juSsQAAAD9k/SHJqvG+s9dJh9G9mlDxWOMupyj9tzOsU95Up/Jv1mzrvVPA+WUF/sw/BlVNd8hNo6c4w+FqOuoAt2x8mWMek+fZRp8lnrt31TXfydTa3/rbVn4ue5ghcou3p1bHYoIpgvVJVBE7xX7gexBLPYgcl+VDEQa1fXf3BBreBIdCQM422YLM90jMZ2bzzD5I/+WWNt2nBN2Zir+89RyNTk26Q//hQTdr6eDYLk4bckjKpob3sr/ugEAAHrW1ZGv+0q1A2MXZIqmFbYZAbux6fX4rk4EIndYaxK/6t5fKDrJqkgVGXTsDH/oSPWijtCdpwDsrC5Xs+G5LBkMP5qS1s0DqQ+G3kj6QzPnVIeucUafjf1i91t0qJoeOscfek29H254gz5+qFDOAgCAzGy2MBOvqp2uJrvlMUteSKJrK5obf+60UYTKmusXJCfVVlGJ8ZDaCE/N13qllL9bueyL07Z9/4U1+VonAABAb60KThvkprJfGi73adTL0SaLyBBmutQo9Z6XCEbuTLenr/UtblypO1R/2Z00l5QNOUYwnaBe0T3s24q90paxztOdeLbJxjGJQOQJyfKq8mj9P3TH0ikeDE8Qku8gIRzXF1YWTFTvhwcm0KjLk8HwFfObGx/AKG8AzrL5HRjm8/KYIx+klHSet6nuZqce52cPp/ioENNm+kPXk304c26ttST9tLyp/l5vjlcEAADQF/FA5FA3l96pZh0zclpOMHmZ6HzTbZyUDESuXbai9fbR7y5aqztWplqDNeNMaZ5R6h1i9wvk053HIZiZpjPx9GQw0mBZHReWN897TXeofHpt0iT36JKxvxDEP+vun2cg2169JX6j2gpnt/lrL8QojQDOscnCTDxQu4tg4zv5DpNb8nxvU/3NulP0V3f1+9xEIPJf9UF8K+Xk/Hn5rvrniPImjAABAACFp+somdK7BPNsHEuxka3U03HdsCEVJycDkdPLmuoW6g7UG23BWd8yyLzQJFetyl88nfjmX0gI18xkIHzHmuSKS4a89nyb7kC5lqgK7TbGM/ZBtR2YrDtLgZloCKNetRcWprnjDF903ju6AwHAlm2yMCNI/JiKaE9HSrrG21R/o+4c2eRtqrsjEQyvYOI/UBaLM1LKuekO64fFcCg0AAAUn2QwXO2mMnto1nG6sxQuHqv24hYkg5G/ELWfU6gjt6j9mKks+RcGm3k7RXsAMO2Ogku9Q45o89eeVsxHTCQDkePZFL+irqHmYRPso6lMci1Rz9XV76175/qJS5a0684EAJv2jcLMh6P3Ka0cPuxYHWFyQtLDFbGGXzj19KUt8Ubr/6R2aihLxZm0eq4uqYg1XuO0/ncAAGBgSPgjx7Dg+9WsR3cWhziayD0tEYic7m2q+4vuMOu1BUJ7GSyuUvsv3ymerwELzqjOIyaCkfvWJpafU0xHzzwnpppBv+8W9d45Q3cWhyhVz9UVYzxjD1fbgh+qbcG/dQcCgG/6RmGmctjQw8k+FLY4LGlLrz2hmAsN3cWZwWrn5s5+LOYzSeljvE2NzxRjAQsAAJwvGQxfwoIvoyI6ojdPKpnpz8lgJJxau+5035IFK3QF6R456zqDhT3cNV7HPFBP8oml3iH7JapCh3lbGl7Vnae/lk2aWh70V/xNzU7TncV5eLLaFrystqWXzW9uvAGdAwMUlm8UZiTx7KL4pJSUsFgeuXXLwoTuKLnmjdbflQyEd+hjh80vrE1bR1XGGj/KejAAAIB+ulwIMae69lfqM+403Vkc7mjTU/LtNn/tURXNjf/M54pbJ9duZbrEJYbLfTrZQ/xCvu3MhngpEQid4G1qeFh3mL6KB8NDvR7fPDW7h+4sDlZCxNfM9IemJSZHjvEurvtMdyAA6LJRYcbe4AnmohhiziJ5bnm0/g3dOfLlhljjBXP8oSlq9sBe/op9FNEtb9BHP6uORTtyGA0AAKBPhBDc5g/9Ws2eqDtLkdjWYOOZRDA8xxutvz3XK7Nfv7i/9gTTbVyjrg7N9fpgCzpH7hJ/SgbD25VFndfvYtuuBw0xSr1Pq8exu+4sReI75KJYPFB7dHlT4/O6wwDA14+YkXyo2uAVwzcZz/hijfcOpNNyLrUsKzE58n1yUwsTjejh7m2S6ARvtO6R6rykAwAAyFzcH7KLByjKZBOTm4lvSwbC+7Sl1x2fqyOL4/6aifHq0D1qdt9cLB/6RKg3wA2JYGSY2ge8QHeY3lo+cd8Kj7fySTWLokwWMdNIJuPpRCByvrep7lbdeQAGuo0KM2prfaSuIFkjqT2dTp1SzP3KbI59OKLdQ709EsMW7vZquqP98IpX5i/NWzAAAIAMJQPhC1TLAZ175grzkeWGZ9yK6lC4MtaQ9dOZhTD/pCYYwrgAMdH56u9LlDXVz9GdpSexYNA1wTvK7lMG3yXmhouZbkkEIhOX8kenV0dxFD2ALl8WZuxqdGnZkCL4VkPeXtEy903dKXQpa6pbmAxEHlSfut//5k/lH1cTnTLilfnJ/CcDAADonXgwdIhgcY3uHMVONcj8JUK83Fodjvhi9dGsLlzK29QK7s/qMiF7mM9LBMJJb1P9pbqjbMkEGmkPh32Q7hzFTm0LTppAo3ZsnTTjcJ0dhAMMZF8WZkpKh0y1D2/VGSYLVqY6rKt1h9DNYnm2IK6hr0bXWmdZ1lnlzQ33lOkMBgAA0IN4oHYXwcbvCaP25IV9OoMpeKaazWph5r11/31ojGfcFWp2VDaXC9nDzJck/eEPyprrf6s7y6aobCeQ4JN15xhA9ucS13g1fVF3EICB6MvCjBA0XWeQrJB0o29x40rdMXQrj9Z/kQyGr7bPI1ZX30tZqSN8zXObdOcCAADYkrfH15SM9Jl/VrMVurMMIG983NZx7Y5ZXujEJUva1b7Ird37IlCoBN8dD4aXqn3Hf+iOsqHOAq0wct5BNWzk1xVNDSjKAGiyYR8zB2tLkQ2SVq1t67gDR4R0Wba87Y6hlb6d0+vW/QyHJAIAgBOMrDCvVA159EuSP9Ky5Ck7Lp23LhcLX9uautdT4foFMQ3OxfIhK1ws+eHE5Eh1oQydbPcrM55HPaRmsVufJ5Lokw5KXognHECfzsLMiurQKI8hdtAdpj8k0z2VS+e16s5RKEa/u2itmvxYdw4AAIDeaK0OB02Dz9adYyCRJO8vb65/LlfLt/fLEoHI3Ux0Ya7WAf1nn84m3WT3B1SjO4ttAo06T02qdOcYSKRl/WRw85OrdecAGMg6CzMlhthbd5B+SneQvFt3CAAAAMjco0IYM/yhX6tZQ3eWAeTz9Nr283O9El6Xvp08hl1w8+R6XdB3TDTTHtmzrKlOa4fNrZNrx5pu42KdGQYaKeXc8uaGR3XnABjoOgszLOXedrncweYNjtZ/oDsEAAAAZG5mVe1xhG/I80qSPDsfpzqXLWn8NBkM/17tbaIT18J3U2JyZJ7OU5pMt3GdmpTqWv8AFO9gOl13CABY38cM816ac/SLJen3ujMAAABA5j4cvU/pVsOHXeHor4ccRkp6wttU/6d8rS8l+UaT6UTCEVGFze4LyEX2MPXH61h9WyCyp8F0mI51D1RSyksGN+HLbYBCYF4uhJhTHdrNwYNSrvxg3TtzJ+pOAQAAABnbavjQk9QuyAjdOQaQZLojfVo+V+hrqns7GYw8rmYPz+d6IXPMdGwyGL6jLFofy/e6BctLyOGH8DuJlNS8INZ4O/4oAQqDebZ/ht3pr1d3kL6SRA32kIy6cwAAAEBm7NFXJtCoObpzDChS/tK3uPHdfK82ZaWuM4WJNmDhE5L4l2o6K58rTQbD1Uw8I5/rHODSaUqffLhlpXUHAYAupiBzku4Q/SFJ1unOAAAAAJkbTyOPUJNtdecYOOTiaKztpv01rNnXPLcpGYgsIqapGlYPGWCimtbq0B6+WMPLeVztWXlcFxDd5mtqbNYdAgC+YgrJTj6NqWNdYsXT5bpTAAAAQMbU7scZujMMIJb9Dfn+1qKUtgRsXU8kUJhxAFOIc9Tk6HysK+6vGSbYdZSD2yPOIun9tvTaS8p05wCAjZiSaKxjt4OSXhry2vNtumMAAABAZtqmzBxvuNyOHnzAYe6qiM79l84A5c1zn2zzh15R+51TdOaAXmA6bOXuM7bb6t8L/pfzVQnzGDVx53o90I3p9K1bFiZ0xwCAjZnqw3G07hB9JYn+oTsDAAAAZE6Yrtm6MwwgH61t7fiF7m/ILcuSCX/kehKUtxGhMtCqLh+qvctlarpSXdok8TqWsrMfQ8lsFw7cLKlcNWyHqp3QYWpq99Po0Zg5l0y3222PpHVprlfExN/L9TrgS4+URevm6Q4BAN9kqq2hYwszzPKfujMAAABA5pgprDtDBuKqad6oUj9jkXw9RfSBWNsel651VopdZR4uVQ319HDJxljBcoK6X5X6Hb+6VOgObrPIOrNy6bxW3TlsTS2tjwT9vqvU7A6aIqwmSc2SqUlNl6Rl6g1LtL81OPrk6kwXZI9s+tPqmduZbFSx5D2Y6Dtqv/pbRMVxUg4z/0A9xMvsglqu1rHcf/DIUlEazNXyc+BD9b75m3pCXmIr/cYabv/cEDJhUqkrJdNeNxtD0lKOEsQ7qidworpvldrWTSa7zaWfeo+3/1R3CADYNFNtMLZz6sfHGmttTPe3PwAAAJCZVcHw9m7iybpz9EhSu2rAX59Kt940KLZo1WbuZd/+8ddvfE5MNaumlFebQkwjljNVM3dP0tJgl3Xl0YbH87/eTbP7uEkEIjerxuqv8rTKDnV5Tko5X63zufnNjYuzNRLNpZZlqcn73ZfOwShWVIdGeYQ4Vr3SJ6ur22djPRrt0Fpd8201fT5XKygVpTXkgEKWJPqEyJqzoHnuXzZ8/3ytHfIFdb0XNhpqfPnEfStKy4bsox7lDLWkWerhjs1H5q9Tb9eflTfP/0THugGgZ/YRM049p/OLIc1PfGNHCAAAAAqb25IHkCj4ttg6yekZ3mjjM3355e5Odl/uvlxp99fhdpccwUzHqev5GhGzbW1H6sxC+xKrleX9gyRfovZBh+VoFSkp6f9YWn9uF2vrNzwaJtfjdVfGGj5Sk6tjweAN42nkSSz5shw+zpwTJA6lHBZmiOR3HFCXeZOp/YCy6PxP+vL+6e4Pc2H35aet/lkB0+5XR9IP8vjeeOGmlrn35vy8NADos0I4rK6vXtMdAAAAADInBe9X8E0xklf3tSizKd2dqN5sX9oCkT0NlmeS5MNz+QWZJHlR5SvzPszV8vtqRLQ+mQyG71AN8suzvOiPpKT71lnWb7oLJF8/oiFvqqNR+0idu5KTah+jEuNB9Tp/V1OU/mEKqX/PzuEK9s3dsrMjlbZ+4Itl70gTe+h4NWmKBYM/G08jD1HbwjPV8/DtbC3/G+wj/yx5cvcRXgBQoBxbmFEfvO/ozgAAAAB9wdW6E/RANWFSd+dq4RVNdS+pyUvL/QfPKeXSc1XD6WTVAPZmeTXRBc2Nd+b6uuIQbQAAIABJREFUCJG+SieTdxql3vOz9Lj/pfYLb13KH/2tuinake0nsj/KljR+qhrgMybIUX9Uj/Uo3Xkyx2PjwfCE8mj9G9lecmJyZGt207bZXm6WRX2xhpdzseDu4t1f7UtrdWgP0+AL1fNt972V1bq1ZHmDN1b/n2wuEwCyz7GFGWb6r+4MAAAAkBnVSHVNoFETdefYMvleefO8ZbleS/cp2eeqhu81THyuao2doa6XZ2HRKbKsk7LVl0ouVPznqeXJYOS3avYnfV+KfFKm5TXeWMOz9rVCrfbZDfDnxNTvB/2+4WR3EOw4bGfOemGG3XKyA05jasrHSrqLP4ckApHdVRvnYjV/GGXjyZH09splX1yVy2KllOlXmYyL+/S7JF3MfEm2M+WWXEySH83Z0lmuyNWyobA5tjCj3raO67wqHogcqrawTu3TJ/ss69P1O1MAADAw7GSNGEOCSnTn6EFbPldWHq23Ow29MO6vuVkI10WqtXJKf05xkpJu8TY3LM5ixJxol6mb3WyeqmZdGf2ipEVpmb64ornRMaNzdnZ6XDX9aDY99qn4Q3TnyYSQ8gA1yfoRZNKi8SyyvdTsknneFnib6v6tJkckq2unSGFcw0zT+7E4qRr5J2/7/gtrspVvU8qbGl9Xkyv78rufVU33VpgeZxVmJC8pa6rr0+MF2BIHF2boU90BMiWY7lOTrXTnKBiGeEr9+6zuGAAAkD+GYF3DJGeAR+hYa/dROj9tnVx7m+kyriamIynzb83/28ryskI6nWdzBjfNfT8ZiDysHuH3e3N/SdIe7WaOt6l+UY6j5YS3ZeHn8UDk52p/8Ne6s2SEea+cLFZoGzI9E9voWGlZrPEVNZmRCIS+q56oG9RGoCrTZUiiP3qjzvxbARiIHFuYsbqGpwQAAAAnsWg7KvBvyZXhSX9ocpmmo058ixvfVZOj49WRXwmDblHzwV7/siVPH9Fcn8xZuCyTnLqeyfwebaEAJSV9zNK68MaWuQ86vQPTD9a987sxnnH2aR+F3rfKhraL+2uGZf/0Pi7450C9Kac+KoSh67RAb1PD02r9wZn+2h+pq1eoRL0tFH0hSZ6by2wAkF2OLcwwpVf3fC8AAAAoKMzOOI1DsN141tp3bnms7oXLhdhzjr/2eJJ8dS+G1v1LWXP9gryEyxJvdO6SRDCyQDWAZ27ix+sk0S3Jda1XDVuyKF4MQ/1OXLKkPRmI3Kdey8t0Z8mEYJefuoZ7zqahWV5eLmzbXRS5T1eA7qLQfSvG1/zV43PZfwZ2v0w9teHO6z5FEgAcwrGFmbQ0c3q+JAAAAGSfZFnJhd/hp8KHJYKRn3qjdbfpTNF9hMh9rZNr/2a6javV/I/VZVPHHK2U7XRWftNlh7Tk9Sz464WZZ9Id7adWvDJ/qRNOy8qEeryPssGX6c6RCUlkd9id1cKMWuZWTtgSqG3Bza3+Wa90D3OtTeXSea1qcm6iKvQAm+JONb/fJu8oaVF5rOEPjj60DGAAcmxhxqJUh+4MAAAAkBmWVOKIugx1nsZwSyIY2eb9te9cah/poDOLb3HjSjU5tS0463cGGb9W6SZ/7S4XeBfXfaYjW3+VN9c/lwxG/qVmv6Uuy8myzilvmftHy7Kk7my5YA9drB6v/VptrTtLbzHLnbO+TCJPtpeZIxWmMJ+OByI/Km+qe0x3GG9Lw6tCiAPi/toT1LN4nbqpcoMfr02nU6cW698OQDFzbGFGtqdRCAYAAHAa5kIfkWlDrBqPPxvjGTcr6Q+fXwinCVVE5/7rOTE1EKz2ndN9OkwpSXq+PNZwn5N3jCyyrhPE35PtfLp3ccNnTn4svSGljDLzLN05ek3yTjlYqNsBw2Wv5xNMf0sGIo9bLH9eHq3P+vDhmeguvNwX99fUC2Heqp7H2Z0/kPLKipa5b+rMBgB949jCjDDcjs0OAAAwYEnVBndMW+xLu5Hg+YlgOKai/2rF5188nOshaLfEHnpZTa5vDUQeM1QeSelznP4Nua95bp16DI/rzpEvzPSW7gwZ2j77i2TnvWeZDhHE4WQgUidZ3lnR3PiMzr+97g6Zv5f0hx6Sgs94f927N0zUFQYA+sWxxQ1BaZfuDAAAAJAhlu0O+pZ8I0xcrSYPVA4fdnMiEH6ESP51KX/y9+poVMvp1b6murfVZIaOdWeb0wtLmZKSP2An/RkwjczBUtflYJn5INTzcajaHhwa94feUduChygtH7FPMdIVqKy5Yb6azEdRBsC5HFuYMcgstr7gAAAAip/k1Q6ty2xoK2b+sWqt/ngCjVquGmaNkqm+jejJEVHnDFUNXWLBoGun5GBfu0eUGMJjinbLlEbaSnG63WNxal3SWDv0rQVt2SweMVmrN92Hc8EqW109dfCg2KJVWVuipNYi2BaMU9uCS8jkS5KByNvqQdWlpfX4zS3zXnL60O4AkF+OLcxYQvp0ZwAAAIDMSLK+YGc1SHsyRDXMjlPty+MGEa1TjbMXiOVT6vYnb2hufAWNM70+q5ruLRXmLoYQ41mKHSTTDkxyW0k8XL0ZhzNT5QQa5aEyu7Oebm6D7K8AOw/NVm9Vj9rjjPtDqWQwskr9zipi+pyk/JCYP5REH6jlvb7GWvvqkOYnPu5tLklijdNqEmyU2kPdZ60wI0l+4YwR2nqJaUf1z3kGG+fN8YeWJwPhp9VtT7WrbcHgaP0HuuMBQGFzbGGGhKzs+U4AAABQSKQUHzrqFI7M2CNOTVWNM3Wha1Tj7AvVmP8/1QJVjbPU04Ob5r6vO2Axe05MNaurfQFBtDez9KubghWmZxytPzSF159E110OyOx9aO8zD1W/M1RNdyRev6Suf0tFKanXeoWU9LK64V9k0Qsrly/7x2b7ImJKZ/wANTPJHJTN5THzh9lcXoEZoh7gkWp6pFv9o94bb6qN3/9ZxE+nrdZFWT3yCACKgnMLMyS20Z0AAAAAMtXxFtGA6SbObsQfrRrhR7vVLlcyGFaPnReQpAUrli17TmcHwsViVTC8vXo3zVLP68yg37efuqmi6ydaqn+VzDRdTaeToa4MH7YmEYw8QyTnUWrdo96WhZ/rCJUtkqysFmakpLeKuEj7dTsT886C6DRh+FJqWxBVty1MWen5t7TMj+HIOgBwbGFGbcdz0QkZAAAA5NAH7R+8PcYzzu7000nDZmdJ55DDO6mdmJ+oRnvSPprGkjSv3bLmVcYaPtKdzinsYoxbsl3wOsxNHKTC7U26VAWbaReNyPTclghE/o9YPtDU3PZYwO+8M/KZjLKsLo/lq4X70uWUan/xXmq6lynMy+f4az9NBCPzpdoWrFnX+uSwJYviugMCQP45uDAjx+rOAAAAAJmZuGRJezIYeUXNfkt3Fs3sRm5IMIU8hpDqOYkSycfTqfRjFS1z39QdrtDYHfSOp1ERtf93opv4QHJeR0Vm19E0PD3o9/1PXY/pDpQpi2RWD3VLrW1vMj0ldofKA7I68xXeRj0Bx6v3x/Fej2+t2hY82bktSCYbK/7z1HLd6QAgP+zCjF2VLdcdJHM8TncCAAAAyJwk+SwTD/TCzIbshukearKHYZrXJIKRV5jkw6l266++xY3v6g6n06rgtEFuKj11Ao06XV3dtkja8Nt1XxxF/c1mtTDjW7JgRTIY/rda8uRsLtfhPOoSUs9JyCjzdiQCkaeZ5cMd6bY69EsDUNzswozd8dYE3UH6YBchBGdz6EIAAADIPSl5PjNdoDtHoWKiKerfKabbuDoZjLyo9nX+aKXkw77FjSt1Z8sXuyDjkqXnuKnsJ+oJGaw7D5B9yEzWj7Tv3hagMLNprvVHWbkM393JQLghTfLBt/iThdXRaIfucACQXSZJ+kh94DmxMONbObl2jJr+V3cQAAAA6L2bYg3/mOMP2X2qjNKdpcDZh4fsLYTYW7jplmQw/Jgk676K5nnPFusXU/bISoGqilPdouyS7hGQoIixtB4mFhfqzuEAHnuUJ4P4yAk00u6T5g9qG6C2BQ1v6Q4GANlhSqYPnXpQqGlygFCYAQAAcBR7BBLVsHhA7X9cpDuLg3hUM3Y2kzE77g+9oZ6/e1Lp1t8X0+kN8erIPsFq313EtLvuLJAfZc0Ni7v6V6Kg7izO0dknzfmGEHPUc/e0JenuhbGG+sMty3FDsAPAV+xDEv+nO0RfsZR7q8kjunMAAABAZpja7yJyn6tmS3VncaAJqmF2q8vwXakaZr9LUcetvui8d3SH6qtPguGyQcTXCYPsfmSc+n0h9JGUdDMz/Vl3Dgey/1YOFEwHzvSH3ksEI3esTSy/d8hrz7fpDgYAmTNZyjeJnfkZKJn2050BAAAAMlcWnf9JMhC+U+2DnKc7i4PZgzecYZLr1GQw8ohq4F7jbar7t+5QmUj6Q5MHCfGwmh2vOwvocWOs4a9zqkMX4kipfhmjWnM3lnqH/CIRjNwpSd5WHq3/QncoAOg9M2XRG6ahO0bfMPGUuL9mWHnzvGW6swAAAEBm1ralrijxub6nGhQjdGdxOHtP7mhmOjIZCD+aTnVcUvHK/KW6Q/UkGQwfR0LcRThqakCzT22MByJnCqJnCUdM9ddW9imiqo3000Qwclsq3XpTMZ3uCFDMzFQitdT0ZXX0u3wSgs3pavpH3UEAAAAgM5VL57Umg5GT1GwjoUGWDaKzg1CX+9BkIHyvTK+73Nuy8HPdob7uciHEnOra63C0FKxX3lT392QwfIfaDJypO0uRqLALNC7Dd0rCH/7lUvHxPRjJCaCwmfZOUSIQ+ZiZRuoO0ydMhxIKMwAAAI5UFq2bpxpkN6sP9HN1ZykiJjGfxqbnmEQwfNGNzY332Ecl6A5le23SJPccf+ghNXu47ixQWJYtbzt/aKVvb9Um8evOUkSGsuDbJ9Cok+OByGl2AUx3IADYNLN7ukRdnFmYIT54VXDaoMHRJ1frTgIAAACZiza3/Szg99kd2tbozlJktmLiO+f4Q9+LB8MnlEfr39AZxu7kd4xn7ONqdprOHFCYRr+7aO2KKTURj8v1orq6re48RWZXwfRsMhj59drWjgvsL+Z1BwKAjXUVZlg22QUOzVn6qtRNZUeq6W90BwEAAIDM7W8tSn1WNf2oCtMzX11Fx/7Zt7cgjsX9oXPKmxvu0RHg7fE1JSMqXH8jRlEGNq/ylXkfxv01BwvhekZdHa47T5GxTxc9xeNzHdwWiMyuaKp7SXcgAPhKZ2FGWhxloTtKv5xAKMwAAAA41tYtCxPLJk2t8Xp89hEVB+rOU4RKhRB3JwORA9rSa0+wn+98rbizTxl/yD7tfHq+1gnOVd4877VEdXgqG/yEujpKd54itIPB9HwiELnA21R3s+4wANClszDTLq0mDzm6MvOt1urQHr5Yw8u6gwAAAEDfDFuyKP7apEk1o0vG/pqZj9OdpygxHVVheHZZMaWmxj46IR+rPK86dK2aHJGPdUFx8Mbq/7Ny9xl7lZS4G9WbdrLuPEXIZKabEsHI5PfXvnPSxCVL2nUHAhjoOgszlbGGj5LByEfk4Kq0aYiz1eQY3TkAAACg77obCD9KBMMtLPkGYnLrzlR0mHb3uFwvxQO1B5U3Nb6ey1Wp13E2M8/J5TqgOG317wX/+6xq+j4VZslv1JsW+/g5wEQ/HOMZN+KTYDgyIlqf1J0HYCAzv5qVz6k/z9n6ovTbEW3+0CUVzQ1v6Q4CAAAA/eON1t/eWh16yRTiIdV62FF3niI0SrDxTDxQ+51cFWcS1eFdWfC9GAgd+qr7lLvZyWDE7nPGPu2mXHOkYnTQIOJ5nwTDNSjOAOjzVWHGokUkyMmFGcNgcamafl93EAAAAOg/+xTlz6qmT6kwS64h4tPVTY4+77oAbS3YeHJVYNa3BzfNfT+bC7aHxR7tGfegmvVmc7kwMJVF637TGqxZZJL5W7Ut2F93niJ0gI/4kVgwGKmORjt0hwEYiL4szHTIjqddTj9amOmYZFXkprKWuhbdUQAAAKD/ur8x/0lbcNZDgoy7mLhad6Yis62LzbpPguF9svlt+WjPuIuZaEq2lgfgi857Rwjxnbi/9li1038dYdSmrFJ/rzMn0Mib1OxPdGcBGIi+LMwMis1/LxkMv6v+LMfqDNRPap+NblMb7f0ty5K6wwAAAEB2VETn/utyIYJzqmcdK0lcyUwjdWcqFnYBxSfpTjX7o2wsLx6o3UXtkJ2PU5gg27r373+3KjjtcbcsvYiYz1DXPbpzFQ8+MxGI/NPbVPcX3UkABhpzo2uSF6gP0dM1ZckOpn3j1bOOU3MP6I7ydZLkS2ofpSJv65NcqnZc/flaHwAAQC5dqlplavLAJ8Hww4MknakaZeep60N15yoG9ihYcX94bnlz/d/6uyzBxu1q4vDDsKGQDY4+uVpN5qzcfcbt7hL3pUz8Q3XdpTtXMVBtlbtXVIeetweH0Z0FYCDZqDAjyXqcSTi7MNNJ3Kw2KE8W2gbFG62fma91dZ/b/Vi+1gcAAJAv3afcXLds0tQ7vSXlp0oWZ6vGxAjduZyOmW9fMb7mqcql81r7uoxkMDxNLenAbObSxD4y43X1b0zNviqJP2KWn1vqIVpp2S4MdguiMmkXBiVvwyTHqSdwJ3XfSerxb6M7/EBhj9ykJieurgpf5TLpAvXcH0s4gqZ/mAZ7DHErYYh7gLzaqDDTFIs/F/T7VqjZSk15ssPeoAjxh0eFmHa4ZaV1x8m3WDDomlAy7s9qtkZ3FgAAgFwZtmRRXE1ueHt8ze0jK4zZROIseyho3bmcyj49rMTnsoe2vrgfS7kqa4Hyz5KSnmSWD8vUuvneloWf92UhcX/NMMEuvyTaUz2ne6ub9lGXsuxGhQ0Naqn/r5qckqiafgkZJacz88nq+ta6cznY4fHqyD7lsboXdAcBGCg2Kszsby1KJYKRRiY6VlegrGGaOsNfa4/SdInuKPmkdk5LJvhG/VU9/pDuLAAAAPmw49J566jrFOYH4oHIfoLpVJJ0qPosxOk0GVL7gGe1Tq692be4cWWmv9t9tEwgF7lyLCWlvD/Nqet9TfPe6e/CypvnLVOThd2XzqOYty8ZZxdpZnDXl2aT+rsO2LTuYtqlan/46pHlxlHE4lT1pt5Tdy4nEoIuV5NiOPoNwBHMr9+gPjAeoWIozJD9WPiiRDCyxBute0R3lnxYNmlq+UhfhX1u+DTdWaAHjCFfAQByobyp7u9q8vfE5MjW7JLHEbPdoe143bkcpNx0GSep6fV9+N1zsx0mD/4p0/LH3lj9f3K1golLlrSryd+7LxfGg+EJLOkCu1+fXK1zoOsu1v7BviT9ockkxIlqfjY5/ayAfGL6rv3clTU3LNYdBWAg+EZhJtrc+kTA7/ukSM7VZvU4fq8+AD8pj9b/Q3eYXFruP3hkmcc3V81W6c4CvVKiOwAAQDHzLq77TE2uE0Jc3+qv3YeJj+WuPhMG6c5W8JiOpwwLM62Ta8eabsNJ365L9d/lN8QarujuVDpv1D7pG4lgZL6aPS6f6x2ougsLZ74/duqcoZW+iHp//4C7vsT8RjsIvkYIe1vwU90xAAaCb2yQOk9nCkQeVButOToC5UCpkNyYrIpMLWupa9EdJheSwXB1qSh9XM1urzsL9JIkr+4IAAADQffwuvaXM//4cPQ+P9lq2JAQMx9NxNMJnYRuzvjWQK3f19TY3NtfMFyGPSqOU44GTUtJx3mb6h68VHcSyJvR7y5aqyb2MNB/SU6q3UaWGEcz0VGqzfMtIgzuvhlHXS7E2fkuXgIMRJusFEtKP8BkFEthprMzYPVIn26tDh/si9VHdcfJpmQg/ANi/rWaLdWdBTLANFx3BGeT2IGCXsD7BDa27fsvrFGTh+3LquC0QW7LEyYhDlPXDyYcybgRg0VYTXpdmGF20AguljzZ21z/oO4YjiOKZ5tatqTxUzWxRx66dXX1zDEu4T5S7ZvZ24IgoUizoa3Pqaqx++j5p+4gBQTvD8iJTRZmypsaX08GI3Yv3PvkOU8ubWUa/HQyEDmyrKluoe4w/fVZ1XRvuem5lZlP1J0F+qTSfg23blmY0B2E2XKpXXDdMTLELt0JoPAxCbxPYLMGR59cTd19UKwYX+MrqXDNZJKHqI3iTHVbueZ42rHkg6iXAyi0Vc3a2TDNiTmOlBVSynu9zfW/1Z3DidiSRXnqz6DY/Peo69S961cFZo12kXkIM9mFyX3JeTtIWWewYW8LUJj5ksS+BeTEZjewUlq/YhbFVJixVag99cZEIDLH21R3q+4wfdUWCO1VYXrs0SfQmaFzcYVZYr9+MZ0hhBDc5q+9SGeGvmCcCga9oBrZGJ4WeqVy6bxW6j7F4f2xUz3DtiqfqjaQteq6fRmlN50mTIFPguGyEdH6ZE93FaZT+paRn3bwmvN1p3AqKbjoC5aDm+a+T91H0sSD4aGCaBZJrlV/D3afNEX/+DdjP90BCokk9unOAMVps4WZplj8b0G/70M1u20e8+SDyUy3JAPhvVId1il9GQ5SF/sbPY/PdZXB4jRyznncsBmW7BxSVGthpq161mlMPENnhj5hiVEVoGeChumOAM7T3Q+F3THrfCHEafEpNZPJENOpa1u5Nw2cDkPNcsuaQr34plx9jhyQ+zhZIPmWwU2dR0pBH6jXeYjuDPlUHq3/Qk1+Z1/eHl9TMqJc7MssDu4+qs4RR4hlBZPf/iKvu7+uAY9ZFsMAOVCANrtzYXcCnAyG71Rvv2vyGShvmI803cbe6jGeWhatn6s7zpY8KoQx01/7I4/PdaW6urXuPJAdousbiHt1rd/u2NFk40Zd6++n7XQHACfg0boTQHa0BmvG3dK84L/57oCyuyHySvfl2tZJMyqNkpKZ3ac52J0HF/U36MzGbtS7UxgCuc6SBWlLdjygO4STSZLat6lt/tBOFc0Nb+V7vd3Db/9f92VOayCyo8kyoubVtoD3ouI+5WnQCn+tvd/1ge4ghYF3sttmh1tWWncSKC5b/NYntbb9XtNT8nOyTwEqTtuqP67GZCDyeIo75vii897RHWhDlwshzq2adehMf8g+x3uS7jyQdTWvTZrknrhkSXu+Vxz31wwzhetRcuyIJDwR395ALwycbzSL2Iej9ymtHD5s0Zzq0PuqUXaCjkbZer4lC1aoid1p7IOdpzwN8X1XbYSOZKJDqAj3lQTLnXu6T+vk2q1MtzEmD3H6R1K0vHneMt0xnIwl76pz/a3V4aBpiBeTwcjdibWtFw5bsiiuK4uvqe5tNbG/3Lqx85QnKWupa7S371IRFmlclmVvC1CY6VI20187mTQf9Q7FZ4uFGXsHJKE2fmqHo7jPx2U6xCTXzGQwfO+6de03bPXvBf/TGcc+p7tC8vfn+EM/UVe1fghCDjENHu0ZZ3/r+kg+V9vVyBlar2bH5HO9WVbZWl0zQU1f1x0ECpgkfywYdFVHox26o0DfVQ4bdq6abK+2mdsbLBarz+pLos1tt9pH9urM1X3K0zz7orarp2w1fGgtE89W1+3THIqjc0jZi6MTDd6JnDBKCVOL7giOx1TV236Hss3+Mibur72ZuooeZ3g9vllqW3ByWbT+yXxn+bruU57so7EeSEyObE1ueZTaFnyfukZ4KgrMjCOVNyCJ7WI8CjMO1nnUG9HRunN8ieXans+TTq29iUzPGWqu2DtRLFHPyJklJSWnqA39IxbR3b7mxhfy+Y18q39WwBTmsYPsHTsm9KExALCkcyiPhRn7CJ3Rw8fZ69srX+vMFUGG/aGIwgxsHpN3vLXN/tR16Dk40HL/wSNLRekFG9xUql7YGwJ+3/daq0Mn+2INL2sLt4HuYbj/al+Sk2q3oRJxgtpxP42ZRurO1j/cY18KhsE75iNJv0n6WHeEDUlJW3Hhl7O+rqTCknbh8dF8r7jNX3uEej9+e4ObxqjrT6h99j/J1LqzvS0LP893pk3xLq77TE1uty/J6topZIhTVM4fkOPbUQL9qmxA/eme9FnV9GtzNbqq3a+ou5xKcJRf7pjcOYjOFbpzfIVX91iYsTd0aqP3a3Xns/MRqQC41GOdLYhmx/2hdxLByJ8tSfNuVjt/2T633f7WwWdZezOLGvUXHjKFOTabyx9IJFPKefs3ZG/Z91TvsSO80bqcF2fsI2XGDB9njzpSk+t15QXTaepD8bZCGHIcCpgw7B1iFGYcysOeq2gT/bio7f0U0xD/TAYi96Q60hcXUkf+ZUsaP1WTq2LB4PU7y1E/EkwXk1MHUmAa3Is7OaLBpvYT1ujOsCH1vqjSnaEvhOBzhBB/y+cXl92nDV676Z/ybDY909U++y8Wtsz9TSH1+1EWa7T7pjol7q+5mIXrPLXdOpM6i8vOo17sXmwLBpStK0yP/Z48M5sLTVSFdmNTnOTxuY5Tz/kv1U03ZXP5UNh6NbKAbOfr2E0nUhGeP92DcWojepHBdNEcf2h5IhB+kYn/lZbpf6sPgtc/i6c/6O4MrEf2+adWWo5VO5K7kJRT7GEoB0neQzUa3Ll+EAOBep0K5oM4Uyr7r5KTap/v3pnPCfv9Vzls2GNqdt9crUODUeVGyR1qB/F49DUDm6P+vo5aFZh1SfcQqOAgyWC4mpl/uIW7GOoFPt10GUeq+/78hubG+/PdOfCWdJ9Cd+9nVdMfqjBLrlDvxrPICaf8bKwXnRvLYU54WCwLp6Nme4SfkT7XIbpz9A3vFa+utbs4uC5faxw2pML+29lhC3epVPsCd8/w157U5q89s6K5sTcdVudN91EPF6yuCt/jMvl+NX+A5kgZYy6cv58CckYiEFl+Y6zhl/357FldPXOMKdyHquf4GDbFlx2pM0nHH90OmelVYcY+LC8ZjNxAXZW7gWqI2kGcpaazDO7q02ukT0i1M/iZ+tP5giStVJ/6ayRxSs0L9cdld6rqVRd7uNbhgrhMGN07LuuPXS38/Rgn6VWBrEBtTR7x2CfB8IG5OG87HqihzF7WAAAgAElEQVTdV7DxkHq/Fd35wepv8ri4P+SN+2tOx+GesBklbjJvUdNDdQeBTLH9uome72Z/zvJvzvPXnpqoDp3rjTU8m/NoGeg+qu+cRDDUzCR+R84abrvHvnKYeFA+gvQby3G6I6w3osI8jZw8yibztclAeJu29LqLcn3Uqt1nC7v5wl7FIq42hPEP1WZ5uCPdfuGg2Pz3cpktU4Na6v/7qBAHzvDX/lplPUF3nkzIYuk3K8tUk+7SOf7aA9oCoQsrmhpe7M3vdHWYznuo5uIBTHKGy3BP3tT9VJty76yGhYLX652DttTam8sNzynOP186q1j9v42abtNVZOH1E8g3SQlnP++8l9qznbsqOO2QwdEnV2djiSuqQ6NKDL5csHE8Ffe78gghXNOTgcgfJMvH4ql1/8LpTbARpkMSgcg53qa6m7OxuK7D6ivOWmOt/cOQ5icKqt+KYhH3hw8TgvfL5HfsRhkZ/IxqlNVbVsfPy5vnvZarfH3hjTY8lAiEBjOLO3RnySYpqcQZfaVs1D+JNvFgeIJgdv4XncxnVZieYxLByAOWtBo+a0vHensUeUZcnX1A+DJJpi5Hq8ZuRGW7Pd2evraQTnW0T7W6XIgfz/GH7C9uQ7rzQDbw/gazfWqt3e/hIvX38Cqx+Fy1TdJq21hKLCvVfbZjSTurd+duptvo7DC9a7O5+Y2n+skI+2iaQiswQu70ujBjN3SS/vAl6m10Xy4DAfQJy0QR1B6+45ZlTfFA7fHlTY3P93UhbcFZ3xJknOQxxPfIscNhZ6zCPqVBNcxOVzuKlmqYvV0WrRuvOxQUDrUHdKPaaSq7IdZwdV8POe4cEpXoxKFDfPaIeSNKybNYTVGYybKu0zzM6/uxiLAQrlmJQPiPKavj8kLaqa2Izb0r7g/Zp2ftoTtL78j2nu7BLE2HfP7uYH8+VkTn/ktXgK5tCNdRr04Rc4St1Sv/M4PFz0b6REcyGH6mLFp/cLYWnghEdlfb7uP7+Osee1RZ1Qg+SW37b2xLry2YPunsz6Dl/oNPLRWl08gh+2kse94WDHhMu6h/dxEs1l+njWb6sJk0DZd91Mx7/c4GjpDR4bQ3tDQ+MKc6dKLdYWmuAgH0hSRe6Yjdwp4w7SjIeC4ZjDSqB3V3NNb6fz0NCdvZibSUexGLaUzyEIPMnfIVt0DZn4jO7GgTcsk+pPGKOf7Q9Lg//Ivy5vrnevNL9iHHhlvMYMmHCWa74+ySL7c1gnZV/y7IVeCBamSF8RP1cvW3M3zDPtXRJdyzE4Hw71JputY+jSArAfvB7g8rHoj8VrBTCjO8tqd7qM/fDqd8/qrPR/uUmIiOdbdOmlFplJQspK6RQIqRPXhGVj971fvKPp3R6OditlILuqrC8JyVDIZvXpNYceeQ155vy0a+/rCPtkwGIgvsIzp1Z+kV7nlbANmndlzsfmb+pDsH5EdGhRm7wpusrj2VDCOa6e8C5BKTXO6Qb+x6w34gIXukrqDftzoRiLzITG+qvd9lkijJ9rcrTENISrUDxBMGMU9UH5jmV78KAFuwjxD8rNpBf0v9vSxQzcoW9Xf1gUXpBFlsGMSDLebtBNHu6u9qD9Nt2COnGJv601IN0t3ynr7IJaqmD2fT84usLZDJrXZsf+wy6fhEMPIQpawbvS0Nr2Zt+X0gObXYObtQckVP92Bn9fEWjvsj4fLmuvp8rrR1cu1Y01PSqGYn5nO9Ttbmrw0ZwpiatQV29UV1Tal3yHnJQORXFss7y6P1X2Rt+X1jH3XpjMKM7HlbANknSaKfmQEk4z0De+i3ZCB8h31uaS4CAfQNF2vHr4OYabqaTu/s0WjDnzjjpH6AAsX2kWU7re8bzLA/DruPPu65t9nuJVDnETOQRWx6LleTXHQma6rX61gyxQ8TwcgCJnlbeXPjUzpGdJNpw+r3MQB5w8t7uoeUciU76PNICLo/UR3ezxur/08+1pfwR44xXcZdhOGGe+21SZPcYzxjb8zR4oeojfdlgvj8ZDDye4vk7eXR+jdytK6eOGZEUUvKHrcFkH1qD2X3z6qmewvlNDzIrT59ZZNY13ax11MRysKhxgBZoXYMP3TSjiGA41gse12xGDgmXi6EKKQhmp0sURXajU1xUo5XY39SzFSTmXF/aGkiGLnbSiYerPjPU3lrdJiCJuRrXf0m6cNe3Ev3UQeZqmSDn271z5rla57blKuV2P3ZGGRey8J5QyPrNrpk7OndxfNcKlOXUwXxKclA5Bm1Eb/zTf6osXuY+/xguYtTjnQWgnuzLciYZZbkvTjuMGa56bJPfX1GdxDIvT4VZoYtWRSPByI/Etz5JsGuOujHufnAAIBugrbY19EAVXa2f8YOavqO7iDFgE2+ifrfn0Qmxqsm0a1Gmfe6zn69SP7+vbXvPjlxyZIcd3LJx+Z2+VnE8r2e7iIlfeDA70W2NoX5fCIYvmBBc+Od9kg52VioXaidUx2aplqaPzXYnJ6NZQ40bbseNET9TV6cx1Xah01OVY2ZqRPkqGXJQPihlEV/GvxKY1Muj6iz+xwyPSWzcrX8bJOpnrcFfbFy7bupQZ6CGcm+ILE07H5mUJgZAPp8knN5U93f1cbrZtUgPi+bgQD6Ii3T75rsmGPDARxHkuxgh3yzl0/Cctn9zKAw00/JYFg1UHiaptWXqMvhav2Hj/GMa1VZ5kriulS69alBsUWrsrmihD98Jgv+bjaXmUtpKZf2dB+LrfeEc87N2pBHbdNum+EPHdfmr71sUMu8xr42xBPBWZPULvWRc/y1s9XVsdhS9p1R5r2M7A57dejqh+Ys06Cz4v7Qe8lg5DGZthqXGp+8kM0jaWLBoGuCZ9T9lNkw4DqlV65Y/o43Bwve7T//6Yj7UZjZEsmEfmYGiH71PrdsRdvFwyp909SGbPdsBQLoi1Sb9Zbpc+SOIYAjsGXFSeBv7OsEd/Yzk9eORItNZyOFRuWqP4lMqYYSz1YN69kuw5dKBiIvSpLPMNMLHem2l/taqElOqt2GPOIyFvzjbAfOpTRZ/+7pPgkWrw/q6ivDkRsI9VpXGcKoj1eH3k8Gwo+oW562WDZtrmNYeyTEQWlrZ7U9rJYs92biaUzmdl8uDfosHqjdRbBxiu4c3caoyzlsiHPU9mm1PRS4lPx82pLPf9jx7uK+HlnXGqj1T+BRt6nZfbKaNrfe2vb9F9bkYsF2MTQZjNjLLs3F8ouB2qrsJYRgHX2iQX71qzAz+t1Fa9uqZh1hmKY9SpNTqr5QhCqXzmtVG/aP1Owo3VkAilFacqtTxpHJK5YYmamfxtPIUzsnhcdUe8T7qob3vvYVl+GzGxDvq9nFau94qdpZflu1Kj5KSfqCpbXKYqs9xel2V8rtMVxGuSXTYwzm8ZLF/lxiHKR+z6334WRI0rLK2PwPeupAaUS0Pqmel7epMF/D3mMarf6xjwI/T6gr6jHZo9B8qi7x7nuUq8uQQcTDyTC461dQiMkmZmGfzliIHzWDVLoIM0VM9dKPEePaE8HIa0zyNSn5LfXzt5nl55TiZSmD2lKpjrUkDGkKUao+PQcZZOyk3iq7qnfLwSYbQd0PJmOSmnO8gtXq+UVhZvMqW/219vZVVyfVkCf93vhVtMx9M+4PHy8EP0L4qgA0UjvKixmFGYCcUDufxTryWf9IxshM/dDdz8KlunP0kr2PM8a+fLmzI0T3jlTXyTwue7a7/GJ0n17LX/7jMCxf6O03tFLKF5nZ2YWZb6rsvkAeJAOR6eo9NEN3jl5hcqs/6SlqZspX/StxZ6vK3h6YLtcGd3bkgWQbsaT1j5yuQPJK9fRtk9N1OJyQbJ/OhMJMkctKVbq8uf5vyWD4VrVROjsbywPoEylfIeaZumMAFKO2FV98Wjl8mO4YhYdp/HNiqrm/tQidI/eBWVJyCaHxW5Ak8bO9vS8TP68mx+UsDBQ1exsa9PsK5XRG+BqZTuW649lP1GWXHK/D0SST3QHw/bpzQG5l7XDB+c2Nc2b4Q+O7hqEEyD+L5EuGI7+WBCh89vnlyWDkMzW7te4sBabEX+21h3V9XXcQp2mbMnO84XKfpjsHbFpa0rze3netZT3hMYR9dA0+hCFjAX+F3fcSjj4sRJLernhlfo+dgPfTxzlevuOpDSs6AB4AslaYsYcaXDG+5hiPz2Uf7jYpW8sF6C1mfpE6z2jCjiFAjtijD6Ew8zXMht3PDAozGRKmy/6G3NXjHUGHJb6murd7e+fKWMNHiUAkxkz+XIaC4rO6eupgl+G7XHcO2BxZl/M1qH0L7Lj3aELr5NqtfIsbV+oOArmT1Q627A5YVwVm1brYfFH9gY3I5rIBemKPoJAIRhZ3nfcLANmmdp5ew7c2myA7v+l9RHcMJ0n4aw9kYczSnQM2Q9KDGf8O05/VvyjMQEZcRsVFajJUdw7YDCkz3xZkiuWb+E61R8I0xZ5qukB3EMidrPd8Prhp7vuJqtA0MsVzhPPGId8kPfX/7Z0JeFvFtYDPmSvLjmQ5TkKaJtCXsJQAbZrYkthaNvPIYkeyQguvAV6h5RUKZXuBQAuUNNCWNSzhsbdQyhaggCXHcRIgBPgCIZLlmEDISgk7OKu1xLakO++Mck1NSEgcS5oraf588829snPnWHeWM2fOnKG+XRlmFIpswKFN6U7fBNXJTH3in4xptdXeWbLlUOyWxHa+/XFbH/8TQveTANYbQXlBKfaSDpfvEAvgxWpcMScceNjeEmjLekEp0i3yP0Zy1uEsHWdGGWYKmKwcSWdvDbzTUe2dZNHYS3TryEYZCsWu4MgDCDhdthwKRSGS0vlbFk1p0N9EnczUFyZWe/6HJmI/ki2HYrc8N6RlQZ9jPtiC8z6Lu31i28NpWZBJUYDQJOQWccKRbDkUu4b06dm5KKd5eeOqWqc3Tpd9tQcXFbjjZCZFAZMVw4ygIhxYFnXWexjDuXRbnq1yFIrezGppfGO60/M5dV/q2D2FIsOs0z5dfhjsHwXVp+/MIetG15UesrqpS7YgZmere/xAK9quly2HYvckU/z2ff2/egruYpoyzCj2TKzaeyJqbIpsORS75ZNPOxJzDslBQSJOadzlexMQTs5BcfkLwpHC41R8X7JFUWSHrBlmBOUt/lcjTs8EDbUmqkyV2SxLoRDM0HWdOvenqb5dKlsWhaLQqA4GEzFX/WJEVLFBvo5lRLl2GOXZd/nOc0rAdjVl35Eth2LXcODNFWF/cF//f3m4YUnc7XuNLo/PoFiKAmMmY+wKp/cO2XIodg8HuDXHiw2LKSnDzLfjqB1XJw7YWS5bEEV2yKphRuBoaXwj7q6nhoYLQAX3UuSCFDxKNVsZZjLDJkpDZAuhMA+krM1FAGWY2QnO0tuZlGHmW+gY6znIYtVU32xedGrb1/b3ITylz0CNvZIJgYqYjVDAOvP0au85oA5qMC8cNmzc3PGAPZdl6qm5oGk35LLIfETXNBFnRhlmCpSsG2YEtqA/HHV5jmfCcwbgwFyUqShebK0NrXG37y26PEq2LHlOZzLFJ1m0tFF1kGxhFOYAE9gAVriHLlWovt5wVAGA94BWws6lrFS2HIpdwzk8ag/5w/19jj0cWBxz+5oQoC4TchUhn0ASPKSh9/tdmBWO/LeoIv6aFno/V458f1FnLsu0hRuXk+6+ni4PzmW5+Qbj6ZMx75MthyI75MQwIygPNb4Xq5p4NGplfuqLj85VuYrihAOfTYP+E7LlyHN+I1zaaaBsoev/lC2MwhzY2xq+oEnXAlKpa2XLYiYQQQUA3gOfRZLXj6iwHEjf1lTZsih2gkM754mrMvU4PZmcplksYtxQhri+IRZEplS0+sUC04d0/x+yBcoGCYApVoB5dKn6TZMhtjPag/5nJJX+DxofZsopO09ArgIAFzA5M8wI7K3zv/x45I9rBg/d7++kxZ6ey7IVxUWoJfKM21khAkwqy/s+we+wBf2Ppq/o60RlmFH0guvwIDJlmPk66sjsPSHiFTDGzow4vR9Rn3KlbHkU/4Yjv6g81NSeqec5Wueuibl9t2Zia1QRoXOun1MRDvTE+FkGBWqYqQz6P+wY6znOYtXEKV4qHpF52Nbd1X1+Trcw9aKrq/uR0tJS0WeUSBIhD8CDYmN9w8QimWxJFJknp4YZwQEblmwnxeznkWrvW4hwE6jGp8gCJ+iLknF3/Z+oA3tEtix5B4enbw03XjGj55ZDEJXHsaIXs1oDjdOdnrXUvr4vWxbzgKO+qJpoH9Y6PyZbEjOj6zqn7Kq4y7caML0lrky2TMUOvZCHs7FCvqFz/Q2jSg/2qqPR9w56D9PsocDTvT55i/qVn8mTKLtUtDVuWTe6bvxwh2U2Ip4nWx5Fug7+etDbzR/JKl+UbRzgcZYsGfIBbtWF18wLsuVQZJ6cG2YEhmJ2e9TlCSJoc2jSN0KGHIrCZl5L42O1Ts9lpNiMlS1L3sDh5Q+61v9CnG7V81EX3750AA6QKZXCZOw4/cx7IyA+LFsWE8EGYOkRlO/ziTbFhC3U8HCHy9NmAe05UsJHypanWCFlbHk02XlJNlbIj1ixojvmnnwWgmUp3dqyUETBwIHfbA/67+r9WYrzJVqBr4oYp/6cH3f7QpTfDWrrm0T43VQHn5Uthc4TNzIsEdtdVRy73YCciQDAyjBTgEgxzPRQHmp8PVY1sQospQ9QNfPJlKVg4SBWb/9Ciu+fZYuSa36m66lYtfcy1HAR3Ra2dpMZXtse3zTliJUrunt/OKRlwadxd73yjlB8jWA4+pi7umI6tazDZctiFixaOl6CMszsJRWhxpaos86NWPKIChQrA/55AqA+m15e9uDcFXGX72LqJ/6WrTLyHz6LJsS/2/nTcDgadDsrInTpkCBUTrEFGx7qqK5fTn3oE0rXkAFfGGyJTDtBthhEeUvTypjb9ziNCWfLlsWsIIKKM1OgSDXMCETcGcqm0MTvHKpqd9L1QMkiFRIfANd9KYC4hqzoDDMC43QIofT/SrYspobDy9uQe4evfD2+619In8yklCXFV4jtgrFq36WowULZspgIFWemj5AS3s4Y80ScngsQ8FZQnhW5YhsksbayteHDbBckvKPirvoxNJu4LNtl5R/peG5X7OonxpZs6l/xp7mWSgbisIH2MTXVtlLHLLW1KaeEOjuSp4n6JluQHjr17VcPYANOhSIwSu4jzpVjxliFV6JsQRSZRbphpgcamP6+1V2/qITj/yGCR7Y8BUAg2dn1y4oVzZsjTm9RT6gTEJ9mBVsNXY6SLYtJ8W9ub58q4j/t7hd04E8zwItyKZTC/NjDDS/G3L5H1crWDjhHdcLIPmBsb743Mq72Za3EKrbHqdXA7BKhPn1yeau/NVcFzgs3XlFb7f0PQDg1V2WaHz6DdN/rv+03qGnMYaw4DDOCoSsWRSk7P+r0zaO5wL0q1EGW4fC2jnzS4NVNHbJF6Y3w1I45669BhrNly2JSyr5XenA15UtlC6LILKYxzAhElHbKvFF3vY8mgaIxfk+2THlIJ+fwe0c4cJeh7BY9lcGF2yIu7xkasMWkFFply2MyZs9rCUwT276+7ZdmtTS+Md3pXUOXh+ZILkWekID4pVawiVM1DpQti2xoEqE8ZvqBY/m81TMZO+7yqsnnMWQ3Un9dKVumAmRzMqVPqggHluWyUDHGrBtdd8ZwR0kDtZOJuSzbhIjx9gJb0P/Qnn5x05bo3KFDKoRn+XeyL5Z5KG9p8G91j19MY8uf6PZCSky2TAXIsmRX1ySxgCtbkF1xW2vjPaR3CkPuibJlMSMMuIgzowwzBYapDDM9lAf9De1jal6ylTmuRI7TSDmTdXJbXsGBh2m4/4U97H9X3/OvFxWOUODNqMt3MY3sD8iWxRRw6OagixMg7tmbIx9EsNeo23cnfX/3Zl02RV4hDJ8dLs9pFtRep9tijxK9/7bqmsqB4UVbZQuSrxiBx++Pj/E0QKl2K43/Z4KKEZYp1gtPmYpwYJWMwkWg13Wj63zDHSXPFrFn9BYAfaotGFiwN7888v1FnXF3/T3UBGZmWzCzIcYWyi6OuHxPaAhisdYtW6ZCgXNojHd1nGF4KJkSMRZsck44cwAbEKbbYbLlMRuIKDxL75AthyKzmNIwIzA6i+vi7tr7OC/5I1VAESPEtPJKJk7d7A2r4dNZ1eFgQrYwZqU81PBgzOUbRQrh72XLIhUOG1IAP3eEAn2ytG/a1PHI0CEV00F5Rih2Ih3E1eU7iyGIEx2KeWUTNagQ25mWyBYk37GtaPycsv/ucHnutKAmYs+cJFumvIbDyzpPTBUxfWSKIYwzr7KaU11Ox/0IeK5MWSTwThISvopg0/q+/KdEKjK7RKu4mC73y5JcpsYRaljKGDsq4vRMpToj4iWOki1THsM58Fuaw43X7MlT2gyILU0Rl3eKhuxlUAs/O3OMbAEUmcf0hg5bcN5nlJ0fGVd7OyuxXo0AZ0AeyJ1DAolU96UDw/M+qJYtSR7gCAeuiTq9IphYkcZL4c8lu7rP2xfXVbFyF3V7L2fAns+GZIr8pjzU8HzcXX8+AD4IxezhwEAZZjKIMPpRVkN1azJVq+tArZr3lSQHuKk5HPijWSZiIsgoTbR/Ha32rAVMT7SL4Vjc+7cBv3x4sGk3AfZ3j/DAi7rqr2WI92dDsHzA2Jr/5LrRdc8Nd5RcQNfTVfyZPrMxpafOdbQ0BvbGU9ospD3enb6pjKUXfkpky2Mi9t/qmjyyMjR3g2xBFJkjbwwcYu85ZWdvq6r/Y4kFr6TrcyiVyZVKJryNc365PRR4WbYk+YQY3EkhvCTi9MZp5nilbHlyyBf0t19U3hL4Z38eUh4MvKCCvSp2hy3o/2vc5U0BMmGcyZvxJZMw5CrOTBagujWXsrlxd/144HgtIBwnWybTw+G9pK6fI+LJmG0iZky0b465vCFqNf8o4En2lzQZ/rWYDPfnuLGKcOODUafnVAAcnzHJ8hDhcUXZnRsOqrl/vyGOXyGn+QDCSNlymR4OL/AEXOBoa/xCtij7gog5FHXXn84An4KinvsZcBDGmAf1CN8iWxRFZsk7xXlgq/9flF0Q+cEp12oD7OdShyws56Mki5U7SNEibeb628KNzxh78RV9xFAIr4q66t9niHdDYVvgE8D5Q8mu7j9kKsBbvLPjIluZYwwCKictxTewhQKP0OT5E5pAzKHbQbLlyS38fc658pbJIragXxzPvjDi8h6jIbuErsWJNYXch+8LcdIV/vxB1/rbzH6cqlhcognXWBpP7qNbs9mP+gMnReORVGfX9EyMvUJviY/xnA2l2lJliNjhwUvZvWG3+6HRMOI0qj+/BXWa2674IKWnLhWGQdmC9BcRfzTq8k1gCMJre4hseSRA+jw0Atf/Nq917gLhAdkfY6/CnOSdYaYHx7svbqLsln8yNmtC9eRaDdg5NFjV0WelsmXLBjTCt1CDnNXcGnhGNMYZsgUqAMpD/gciTs8KjWlP0+0BsuXJMJz+NaRSyd85WueuyeSDRfynWNXESWApe41uR2fy2YrCQEyeO9x1bguUPEm3R8qWJ8uItvaKzvm981sbG8yyXaTQEe7tlL25yTlhRBmWnY+IvwR1kmOKAzzalUjMGLy86eMjZEuzl9CEayNlp0Xd3ikMmAjymtfjMb2D5ZDS/9ceDizO5HNF3KVYdX0daiieW5TxZnamOpiOqyjGmSfj7vpqzvEiRDiN7ssliyabLVQRb2rf3DHbMGIVBOWhhte2VdW7Syz4DN26ZMuTI0KkZDwGya459tb54oS2grJgK75O3hpmejCU4EaRIj84ZQiz2f4LAaYCpKNV53sQSuGy+YLO4T7RGYkPVGPMLI6Wxjc6xnp+pFm1Owpke45oD89CKnWzLdy4PFuFiMEh6q7/CQMU2wuOylY5ivxFBLgMu90/OQz2/x3dXgMFZjTnHD4FhH+QwvRoecifPuVG9c+5RwSHpGzGTMZmXlFVV4OonU3vRRyxWkyLiQkO8Jie6L5FbPvO12MsxVbZL6omLnRoZVfQO7ycPnLIlqlPiO0FXL/utta5j2fLo1mcuhmr8p4EFraQdJbh2SgjX7EF/eL0nl+1j6m5xF7moO4YhU53AhRTzDMOIrj37GQidU9FW+OWQnStEjsnSLc4djSM+ANyvIrerlW2TJmHryUd4yk9mXjSCOWhKBLy3jDTG8OLRhzne29srG8YWrmHKnY9Ip4M+RPNW6y+vsWRP0WK1pPGSpIii4jBi7Jzos76R5DhnTSCj5Mt0z7whVgpTSb5/cZ2v6wj6uaGg2pOHDrYMQsQL8xFmYr8wljNvCHi9M7RkN1ECtQUyG8l+UtqZwHQU083tza9orxjzIMxEX5JpE1HHHdhmW1IHQKfQn1TLRTo6jnVxc/EVtUunT84OBz4RLY8mWBY6/wYZTOj7vp7EHA6dRZiu7rZDTSr6G3cvAo/faI6FExk26PZ3hp4Z5NzgmsADpijYi19E+NU17+LtOVHk75nLbVOoboktjz+GAo00DRNHMLI8Z7N7e1PHbBhyXbZ8mQbQ7e4LlblfQY1dhe1gxrZMvUTsfWxjV6kn66ft4f8b8sWSCGHgjLM9Mbe1iACXP1VJJo8lu03xHEsVfiTDSONiI1hpj3pXdQmX+Ucm5N6d4M4YUm2QMVIeYv/1ZmMOa+o9p6OmF7hN3cQTw4xGoyadQ5PrcFPGo2BKqcYLrK/jbnrnyPF5y4w+3emkIKjJbCWsp8KV3MjcKsX8kdBfodUpvlc503Ny+e+3mOMUd4x5mXIytcjlIkYR3PE+D94cPkpGuDEdOBUhENky9cvRL8PvIn+jsdCLZH54oSjfPWQ+TaMRamrtrrH/8XKbefT3/sbuj9Qtly9SHHOm0lXeODWlsZ5wjCYy6BrwlPsVVZT46quuIRkmAkFanzsL4Pebv6IMrE9bnasauJ3kJV6qC5RP5CeC3VFZqcAAAdmSURBVOR1nBLhtUnvfg6kUo/ZDQ/pYnITFAgjJWUnx6p9pyCDP+SVoZL6cg78FaHHk/I+tzLo/1C2SAr5FKxhpjfG5HGRka75eOSPBwzcb3AVQ+1IRH4kKWtjqIEcmkN3OOHZE6ZO9Q1A/lo02fWWsUqkkIyx6jqHMfZ0xOk5CTmeR/WiHkwSBd7YPvEi5YEI8vnDg/700Zuyo/Dag/5FpCRWkZL4c1IUrgJloFHsAsPV/NRtVfUHWix4HgKcCeaKCyICg68mZWkJcFzcpeuv9PZEUMaY/MMY/xuNBB0u3yEMuFikORaB/4TG/4PkSrhn0v0+8IUcwR9BWNjT758gW7AcUBlcuA2MeIK1VZMnAEPqM9AHkuagIn4Mcni2G5JP9BxTKyvmnzDKUXZ7bKzvCdJep+WJd5E0jPgcfxOJ6pM2ftxkp0VjJ3POj6X+4Bgwv6FGeNSvoDq4QOephttbm5aqQ0B2YA83vEjZix3V3iM1hhfQ+xTDtdmMlWJRp4Xq20ukx7/8WSS5xDhlTKH4iqIwzOyM4eb3hpHShN3ukkNhxMHU7x2OnB1Ik8v9SRs6ABBFEDoRZG0w7DhhZG9WeUVHKQJvfUIdqNj//hEiFwFYVyVSiXd29ojJ9mqXsVqdz9sHco5xclPamLfVPX5gCbd5cIeBRrhLDs6VGJTWkCDLqC4FOU8sKm9pWtnzQ7ONOIaS+Dhj7IltVXXHaEw7i+49kP1AjmKwW0vt9W1qr8vpu2rlCWjN1MPtIb8nU89S7MDYbvf7mYxdM62q7miG2mRqX6fQZ1WQO08aalr8X8Cxja5DgHpLspsvM7Y2psl232wLNRTZqVXyqQg1rKNMpAfEvQgeXIoDjqb6V0V9yDhS6MVWVpnBZ6nf5+spD1IFXQJJ/pqjbe67xphkun4/VxieavNE+sxdb3MAjCelZjJC2vNhVNYKFqvaCK9S/qKeSs7rCaZvJs8Ew0P8qvYxNTfYSytOJ21vKt0Lz4Fsx/XS6Xt5n3Iae3kb9aXLkl1dy7JcZkYw6tMyIwHpLdhRNelwxixH0t80FkQ/wGEcfZeVEsUURmXhEbKUA3+zU+9cbMTUSqMOAfkmFeFA+p1+UTXxonJLWS1y8FLHWUP9+wgJ4mzipLtTJ7KMyl+yPbb5TcObM40M103DqK/mgwa2YEMTmOz7KErDzK4wtoGsMtIuoUkEu2zciRUlCXtZdxmzMo6UElZgFl3v1ruTGnZBLBW5e21zVFmxCwdjxe5xkUQdmF41eYyO7CiGvJra8+HU6R5K+Xf38fFC2W6nQfdjUjA/oonBWnrWe6QxrExEEisHr27qyNxfkhuMCUSP4fPCWJX3h2DB4+nvcgqFB3dsJRjYx8cKo49QSD6mh69DmrhwjmtQT63avGnz6mLYU12IGP1kT125Om0E1UvdyDQ3NY0fcsAjSLEa1Q/lWKxGfUbP+pgmDR9w5P9Cna9LIVuTr+1LkVmMic7zRkrTMWbSYCwtPVTj+qEc8eAdfRYKxV4kYbTp77y8V78PH9LdOqrjq/UUvtfVuent3sq7QCkTX8eYXDQYCba6Jo8sQe0oauPilJYx9L4Ogx2eeH008vLP6T2vocnUas71MM3Vl63CT1fI2Ca8LxixVR4WiSamdodWdhwgP5LGShd9J6NhR1/aV89wYcCgPjRdT9+nOvs+fUdrUzy5qqs7vsooM+8x9JaVRkojjDWbfjjhAGup9ftc54fS/ffT36HoB3ZM9EXw5f6GRRB1S4xRYhvLh/SuxELqKsDku6GW+HvGgleaQtyymC2MXQjPGintKUkT3uOp/h5FbeEIqsPi0LpMLbKKXRDr6R2uoz7ovRRPva1TGrR8/oYeg7rATMZchXlRhpk+YEwitorrb2tgyopduBh1oM1IXyHiGAxy2EeglQ/VuGWQzvVyZGilSaCFI9NJOeqmATfJELp04Nswybd28dTWSMf2jYV0lOGuMPYAv9P7MzHxYVb2XcCS/UjRGYSMl9KAZkWuM/q+umlQi9NFB2lGm7Er9eW8d5vadxdoVQ12hYNhBH3JSF8hDDZa0joM0TKUoT6QM0Y6Ki8R7Uv8nDNqURw7GfJoStSbVHIzT6Y2Vr67YEtvxUih2BsqVjRvpmypkb6BqI+YsgwqAa2SA1aihuW66L+Q6mNPP0Z1kn41SROBBAOMpXQ9iqBvRT21MdTWvbn3hKs3xeoR0x+MLUUiPdPzmdiqclLVKcNK0DpcozEm/Z7+PSZ3c+SdNMZ0JnV9M4fkl3Gt5MueLWK9kb1NeF8xJqbzjZQmvbDknDiMc+tQ0kn2o7o5EDkrpfpq7dFTECBOdbmD8q1i7A2+G9u4u7pa6Bhjx0dGWrTzz0Udm+j0kL6HlcCTlRrVMVIQbYiahb4/0Q+kjWA9fQE9r5NeQTSVggjy1LY9jVHFsFUxV/TylHy457O4u3Z4iltHUr/9XXpfI5DjUI5QhpyXAWIZ56AhQop0VFIrIIYcIhz0LfSzdqod7XqSfxK1aB/vqt8QKIO6Yl/4f8g0eoXLOm6nAAAAAElFTkSuQmCC"
                          id="imagen"
                        />
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div id="datos" class="vertical-align">
                        <p id="encabezado">
                          <b>Guilisasti Damián</b><br />Paraguay 306, Rosario,
                          Argentina<br />Telefono: (+54) 9 341 335 4475<br />Email:
                          hola@damianguilisasti.com.ar
                        </p>
                      </div></v-col
                    >
                    <v-col cols="2">
                      <div id="fact" class="vertical-align">
                        <p>
                          Presupuesto<br />
                          Creado: {{ budgetDate(BudgetInfo.createdAt) }} <br />
                          Vencimiento: {{ budgetDate(expirationDate()) }}
                        </p>
                      </div>
                    </v-col>
                  </v-row>
                </header>
                <section>
                  <v-row>
                    <v-col cols="12">
                      <table id="facliente">
                        <tbody>
                          <tr>
                            <td id="cliente">
                              <strong>{{
                                BudgetInfo.client.name +
                                " " +
                                BudgetInfo.client.lastname
                              }}</strong
                              ><br />
                              <strong>Dirección:</strong>
                              {{ BudgetInfo.client.address }}<br />
                              <strong>Teléfono:</strong>
                              {{ BudgetInfo.client.phone }}<br />
                              <strong>Email:</strong>
                              {{ BudgetInfo.client.email }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </v-col>
                  </v-row>
                </section>
                <section>
                  <div>
                    <table id="facarticulo">
                      <thead>
                        <tr id="fa">
                          <th>Cantidad</th>
                          <th>Servicio</th>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Precio unitario</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          style="text-align: center"
                          v-for="item in BudgetInfo.services"
                          :key="item.text"
                        >
                          <td>1</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.description }}</td>
                          <td>{{ item.serviceType }}</td>
                          <td>${{ item.price }}</td>
                          <td>${{ item.price }}</td>
                        </tr>
                      </tbody>
                      <br />
                      <tfoot>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th colspan="2" style="text-align: right">
                            SUBTOTAL:
                          </th>
                          <th style="text-align: right">
                            ${{ Math.round(budgetSubTotal) }}
                          </th>
                        </tr>
                        <!--                         <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th colspan="2" style="text-align: right">IVA:</th>
                          <th style="text-align: right">
                            ${{ Math.round((budgetSubTotal * 21) / 100) }}
                          </th>
                        </tr> -->
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th colspan="2" style="text-align: right">TOTAL:</th>
                          <th style="text-align: right">
                            ${{ Math.round(budgetSubTotal) }}
                          </th>
                          <!--  ${{ Math.round(budgetSubTotal * 1.21) }} -->
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
                <br />
                <br />
                <footer>
                  <div id="gracias">
                    <p><b>Performant and Reliable Apps.</b></p>
                  </div>
                </footer>
              </div></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="darken-1" text @click="Budgetdialog = false">
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="sendEmail">
                Enviar por email
              </v-btn>
              <v-btn color="green darken-1" text @click="createPDF">
                Generar PDF
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>


<script>
import axios from "axios";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
export default {
  data: () => ({
    blob: "",
    budgetSubTotal: 0,
    BudgetInfo: {
      client: "",
    },
    Budgetdialog: false,
    editedItem: {
      name: "",
    },
    loadingData: true,
    dialog: false,
    editedIndex: -1,
    search: "",
    headers: [
      {
        text: "Cliente",
        align: "start",
        filterable: true,
        value: "client",
      },
      {
        text: "Servicios",
        filterable: true,
        value: "services",
      },
      {
        text: "Fecha",
        filterable: true,
        value: "createdAt",
      },
      { text: "Estado", filterable: true, value: "state" },
      { text: "Acciones", value: "actions" },
    ],
    servicesHeader: [
      {
        text: "Servicio",
        align: "start",
        value: "text",
      },
      { text: "Eliminar servicio", value: "actions" },
    ],
    servicesHeaderEdited: [
      {
        text: "Servicio",
        align: "start",
        value: "name",
      },
      { text: "Eliminar servicio", value: "actions" },
    ],
    budgets: [],
    clientsList: [],
    serviceList: [],
    servicesArray: [],
    servicesList: [],
    updatedServices: [],
  }),
  methods: {
    //DataTable

    getStateColor(state) {
      if (state === 1) return "orange";
      if (state === 2) return "green";
      else return "red";
    },
    getState(state) {
      if (state === 1) return "Pendiente de aprobación";
      if (state === 2) return "Aprobado";
      else return "No aprobado";
    },
    clientServices(item) {
      const elements = [];
      item.services.map(function (i) {
        elements.push(i.name);
      });
      return elements.join(", ");
    },
    budgetDate(item) {
      return moment(item).format("DD/MM/YYYY"); //h:mm:ss
    },
    clientName(item) {
      return item.client.name + " " + item.client.lastname;
    },

    approvedItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "budgets/approved",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se aprobó correctamente el presupuesto.`,
          });
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo aprobar el presupuesto, por favor actualice la página e intente nuevamente.`,
            color: "red",
          });
        });
    },

    desactivateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "budgets/desactivate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `No se aprobó el presupuesto.`,
          });
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo desaprobar el presupuesto, por favor actualice la página e intente nuevamente.`,
            color: "red",
          });
        });
    },

    activateItem(item) {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .put(
          "budgets/activate",
          {
            _id: item._id,
          },
          configuration
        )
        .then(function (response) {
          me.initialize();
          me.$store.dispatch("setSnackbar", {
            text: `Se activó correctamente el presupuesto.`,
          });
        })
        .catch(function (error) {
          console.log(error);
          me.$store.dispatch("setSnackbar", {
            text: `No se pudo activar el presupuesto, por favor actualice la página e intente nuevamente.`,
            color: "red",
          });
        });
    },

    editItem(item) {
      this.editedIndex = this.budgets.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteEditedService(item) {
      const index = this.editedItem.services.indexOf(item);
      this.editedItem.services.splice(index, 1);
    },
    deleteItem(item) {
      let me = this;
      let budgetId = item._id;
      confirm("Estás a punto de eliminar el presupuesto ¿Continuar?") &&
        axios
          .delete("budgets/delete", {
            params: { id: budgetId },
            headers: { token: me.$store.state.token },
          })
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se eliminó correctamente el presupuesto.`,
            });
          })
          .catch(function (error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo eliminar el presupuesto, por favor actualice la página e intente nuevamente.`,
              color: "red",
            });
          });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      if (this.editedIndex > -1) {
        const servicesEditedSelected = [];
        this.editedItem.services.map(function (i) {
          me.servicesList.map(function (u) {
            if (i.name == u.text) {
              servicesEditedSelected.push(u.value);
            }
          });
        });
        axios
          .put(
            "budgets/update",
            {
              _id: this.editedItem._id,
              services: servicesEditedSelected,
            },
            configuration
          )
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se actualizó correctamente el presupuesto.`,
            });
          })
          .catch(function (error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo actualizar el presupuesto, por favor actualice la página e intente nuevamente.`,
              color: "red",
            });
          });
      } else {
        let me = this;
        let header = { token: this.$store.state.token };
        let configuration = { headers: header };
        const servicesSelected = [];
        this.servicesArray.map(function (i) {
          me.servicesList.map(function (u) {
            if (i.text == u.text) {
              servicesSelected.push(u.value);
            }
          });
        });
        axios
          .post(
            "budgets/add",
            {
              client: this.editedItem.clients,
              services: servicesSelected,
            },
            configuration
          )
          .then(function (response) {
            me.initialize();
            me.$store.dispatch("setSnackbar", {
              text: `Se agregó correctamente el presupuesto.`,
            });
            me.servicesArray = [];
          })
          .catch(function (error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text: `No se pudo crear el presupuesto, por favor actualice la página e intente nuevamente.`,
              color: "red",
            });
          });
      }
      this.close();
    },
    initialize() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      axios
        .get("budgets/list", configuration)
        .then(function (response) {
          me.budgets = response.data;
          me.loadingData = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clientsSelect() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      let clientsList = [];
      axios
        .get("clients/list", configuration)
        .then(function (response) {
          clientsList = response.data;
          clientsList.map(function (i) {
            me.clientsList.push({ text: i.lastname, value: i._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    servicesSelect() {
      let me = this;
      let header = { token: this.$store.state.token };
      let configuration = { headers: header };
      let serviceList = [];
      axios
        .get("services/list", configuration)
        .then(function (response) {
          serviceList = response.data;
          serviceList.map(function (i) {
            me.servicesList.push({ text: i.name, value: i._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clientAdded(event) {
      let me = this;
      let id = event;
      //cuando se haga el post, se pone el id del cliente seleccionado.
    },
    servicesAdded(event) {
      let me = this;
      let id = event;
      this.servicesList.map(function (i) {
        if (id == i.value) {
          const repeated = me.servicesArray.findIndex((x) => x.text == i.text);
          if (repeated == -1) {
            me.servicesArray.push({
              text: i.text,
            });
          } else {
            me.$store.dispatch("setSnackbar", {
              text: `Este servicio ya fue agregado.`,
              color: "red",
            });
          }
        }
      });
    },
    editedServicesAdd(event) {
      let me = this;
      let id = event;
      this.servicesList.map(function (i) {
        console.log(i);
        if (id == i.value) {
          const repeated = me.editedItem.services.findIndex(
            (x) => x.text == i.text
          );
          if (repeated == -1) {
            me.editedItem.services.push({
              name: i.text,
            });
          } else {
            me.$store.dispatch("setSnackbar", {
              text: `Este servicio ya fue agregado.`,
              color: "red",
            });
          }
        }
      });
    },
    sendEmail() {
      let me = this;
      const template = document.getElementById("budgetTemplate");

      html2canvas(template, {
        scale: 3,
      }).then(function (canvas) {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const pageHeight = 295;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF("p", "mm", "a4", true); //true es para que comprima el PDF y tenga menos peso.
        const position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const blob = doc.output("blob");

        let formData = new FormData();

        formData.append("file", blob);
        formData.append("email", me.BudgetInfo.client.email);
        formData.append("name", me.BudgetInfo.client.name);

        axios
          .post("budgets/uploadPDF", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: me.$store.state.token,
            },
          })
          .then(function (response) {
            me.$store.dispatch("setSnackbar", {
              text: "Se envío correctamente el presupuesto.",
            });
          })
          .catch(function (error) {
            console.log(error);
            me.$store.dispatch("setSnackbar", {
              text:
                "Hubo un error al enviar el presupuesto, por favor actualice la página e intente nuevamente.",
              color: "error",
            });
          });
      });

      this.Budgetdialog = false;
    },
    createPDF() {
      const template = document.getElementById("budgetTemplate");

      html2canvas(template, {
        scale: 3,
      }).then(function (canvas) {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const pageHeight = 295;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF("p", "mm", "a4");
        const position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        doc.save("Presupuesto.pdf");
      });
      this.Budgetdialog = false;
    },
    view(item) {
      this.Budgetdialog = true;
      this.BudgetInfo = item;
      let totalprice = 0;
      item.services.map(function (x) {
        totalprice += x.price;
      });
      this.budgetSubTotal = totalprice;
    },
    expirationDate() {
      let date = new Date();
      date.setDate(date.getDate() + 15);
      return date;
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo presupuesto"
        : "Editar presupuesto";
    },
    saveTitle() {
      return this.editedIndex === -1 ? "Generar" : "Actualizar";
    },
  },
  created() {
    this.initialize();
    this.clientsSelect();
    this.servicesSelect();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#budgetTemplate {
  padding: 20px 60px;
  font-size: 16px;
}
#logo img {
  max-height: 100%;
  max-width: 100%;
  width: 200px;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.frame {
  display: inline-block;
  vertical-align: top;
  position: relative;
}
#imagen {
  width: 200px;
}
.vertical-align {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
}
#fact {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}
#datos {
  float: center;
}

#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 15px;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
}

#facliente {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #f5344f;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#gracias {
  text-align: center;
}
</style>