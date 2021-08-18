<!--                             <v-img
                              :src="image"
                              height="120px"
                              width="auto"
                              alt="Image Preview"
                            >
                            </v-img>
                            <div
                              v-for="(image, index) in editedItem.images"
                              :key="index"
                              class="image-preview"
                              id="imagePreview"
                            >
                              <v-img
                                :src="image.url"
                                height="120px"
                                width="auto"
                                alt="Image Preview"
                              >
                                <span
                                  class="removeButton"
                                  @click="deleteSavedImages(index)"
                                  >X</span
                                ></v-img
                              >
                            </div> -->