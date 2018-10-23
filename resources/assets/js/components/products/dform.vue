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
                <v-flex v-if="!inArray(notInclude, f.key)" v-for="(f, index) in fillable" :key="index" xs12>
                  <label>{{ f.caption }}</label>
                  <v-text-field
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
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
          key: "jenis_produk",
          caption: "Jenis Produk",
          value: "",
          rules: "required|max:20"
        },
        {
          key: "nama_produk",
          caption: "Nama Produk",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "ukuran",
          caption: "Ukuran",
          value: "",
          rules: "required|max:20"
        },
        {
          key: "harga_dasar",
          caption: "Harga Dasar",
          value: "",
          rules: "required|integer"
        },
        {
          key: "harga_distributor",
          caption: "Harga Distributor",
          value: "",
          rules: "required|integer"
        },
        {
          key: "harga_reseller",
          caption: "Harga Reseller",
          value: "",
          rules: "required|integer"
        },
        {
          key: "rewards",
          caption: "Rewards",
          value: "",
          rules: "boolean"
        },
        {
          key: "jenis_rewards",
          caption: "Jenis Rewards",
          value: "",
          rules: "required|max:30"
        },
        {
          key: "bonus_rewards",
          caption: "Bonus Rewards",
          value: "",
          rules: "integer"
        },
        {
          key: "or",
          caption: "OR",
          value: "",
          rules: "integer"
        },
        {
          key: "persentase_or",
          caption: "Presentasi OR",
          value: "",
          rules: "integer"
        },
        {
          key: "bonus_or",
          caption: "Bonus OR",
          value: "",
          rules: "integer"
        }
      ],
      notInclude: [
        "rewards",
        "jenis_rewards",
        "bonus_rewards",
        "or",
        "persentase_or",
        "bonus_or"
      ],

      formData: {},
      formTitle: "Tambah Produk"
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
