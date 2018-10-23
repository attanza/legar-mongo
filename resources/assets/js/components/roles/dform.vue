<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="primary--text headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap>
                <v-flex xs12>
                  <label>Role</label>
                  <v-text-field
                    v-validate="'required|max:50'"
                    v-model="name"
                    :error-messages="errors.collect('name')"
                    name="name"
                    data-vv-name="name"
                    data-vv-as="Role"

                  />
                </v-flex>
                <v-flex xs12>
                  <label>Slug</label>
                  <v-text-field
                    v-validate="'required|max:80'"
                    v-model="slug"
                    :error-messages="errors.collect('slug')"
                    name="slug"
                    data-vv-name="slug"
                  />
                </v-flex>
                <v-flex sm12>
                  <label>Deskripsi</label>
                  <v-textarea
                    v-validate="'max:250'"
                    v-model="description"
                    :error-messages="errors.collect('description')"
                    name="description"
                    data-vv-name="description"
                    data-vv-as="Deskripsi"

                  />
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn dark color="primary" @click.native="onClose">Tutup</v-btn>
          <v-btn dark color="primary" @click.native="submit">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "../../mixins";
import { ROLES_URL } from "../../utils/apis.js";
import axios from "axios";
import catchError, { showNoty } from "../../utils/catchError.js";
import debounce from "lodash/debounce";
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      fillable: [
        { key: "name", value: "", rules: "required|max:50" },
        { key: "slug", value: "", rules: "required|max:100" },
        { key: "description", value: "", rules: "max:250" }
      ],
      formData: {},
      formTitle: "Tambah Role",
      name: "",
      slug: "",
      description: "",
      slugProcess: false
    };
  },
  watch: {
    show() {
      this.dialog = this.show;
    },
    name() {
      this.slugProcess = true;
      this.createSlug(this.name);
    }
  },
  created() {
    // this.setFields()
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    },
    setFields() {
      this.errors.clear();
      if (this.currentEdit) {
        this.fillable.forEach(data => (this.formData[data.key] = data.value));
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saveData();
          return;
        }
      });
    },
    async saveData() {
      try {
        this.activateLoader();
        let data = {
          name: this.name,
          slug: this.slug,
          description: this.description
        };
        const resp = await axios.post(ROLES_URL, data).then(res => res.data);
        if (resp.meta.status === 201) {
          showNoty("Data Saved", "success");
          this.$emit("onAdd", resp.data);
          this.setFields();
        }
        this.deactivateLoader();
      } catch (e) {
        this.dialog = false;
        this.deactivateLoader();
        catchError(e);
      }
    },
    createSlug: debounce(function(name) {
      this.slug = this.setSnakeCase(name);
      this.slugProcess = false;
    }, 300)
  }
};
</script>
