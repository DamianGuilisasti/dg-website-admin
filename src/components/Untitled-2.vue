                          <!--                           <v-row>
                            <draggable
                              :list="filesArray"
                              ghost-class="ghost"
                              :move="checkMove"
                              @start="dragging = true"
                              @end="dragging = false"
                            >
                              <div
                                v-for="(image, index) in filesArray"
                                :key="index"
                                class="image-preview"
                                id="imagePreview"
                                draggable="true"
                              >
                                <v-img
                                  :src="image"
                                  height="120px"
                                  width="auto"
                                  alt="Image Preview"
                                >
                                  <span
                                    class="removeButton"
                                    @click="deleteImage(index)"
                                    >X</span
                                  ></v-img
                                >
                              </div>
                            </draggable>
                          </v-row> -->