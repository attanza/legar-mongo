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
                <v-flex v-if="f.key != 'is_active'" v-for="(f, index) in fillable" :key="index" xs12>
                  <label>{{ f.caption }}</label>
                  <v-text-field
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
                    :type="f.key == 'password' ? 'password' : 'text'"
                  />
                </v-flex>
                <v-flex xs12>
                  <v-switch
                    v-model="formData['is_active']"
                    label="Status aktif"
                    color="primary"
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
import { USERS_URL } from "../../utils/apis.js";
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
        {
          key: "jenis_id",
          caption: "Jenis Id",
          value: "",
          rules: "required|max:20"
        },
        {
          key: "no_id",
          caption: "No Id",
          value: "",
          rules: "required|max:30"
        },
        {
          key: "nama",
          caption: "Nama",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "email",
          caption: "Email",
          value: "",
          rules: "required|email"
        },
        {
          key: "telepon",
          caption: "Telepon",
          value: "",
          rules: "required|max:30"
        },
        {
          key: "password",
          caption: "Password",
          value: "",
          rules: "required|min:6"
        },
        {
          key: "alamat",
          caption: "Alamat",
          value: "",
          rules: "max:250"
        }
      ],

      formData: {},
      formTitle: "Tambah User"
    };
  },
  watch: {
    show() {
      this.dialog = this.show;
    }
  },
  created() {
    this.setFields();
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
        const resp = await axios
          .post(USERS_URL, this.formData)
          .then(res => res.data);
        if (resp.meta.status === 201) {
          showNoty("Data disimpen", "success");
          this.$emit("onAdd", resp.data);
          this.setFields();
        }
        this.deactivateLoader();
      } catch (e) {
        this.dialog = false;
        this.deactivateLoader();
        catchError(e);
      }
    }
  }
};
</script>
