<template>
  <div>
    <v-card>
      <v-container grid-list-md fluid style="padding: 0px;">
        <v-toolbar color="transparent" card>
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Kembali" @onClick="toHome"/>
          <Tbtn color="primary" icon="save" icon-mode tooltip-text="Simpan" @onClick="submit"/>
          <Tbtn color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setFields"/>
          <Tbtn color="primary" icon="delete" icon-mode tooltip-text="Hapus" @onClick="confirmDelete"/>
        </v-toolbar>
        <v-card-text>
          <form v-if="formData">
            <v-layout row wrap>
              <v-flex v-if="f.key != 'is_active'" v-for="(f, index) in fillable" :key="index" sm6 xs12>
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
              <v-flex sm6 xs12>
                <v-switch
                  v-model="formData['is_active']"
                  label="Status aktif"
                  color="primary"
                />
              </v-flex>
            </v-layout>
          </form>
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog :showDialog="showDialog" text="Yakin akan menghapus ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
  </div>
</template>
<script>
import { USERS_URL } from "../utils/apis.js";
import { global } from "../mixins";
import catchError, { showNoty } from "../utils/catchError.js";
import { Dialog } from "../components";

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog },
  mixins: [global],
  data() {
    return {
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
          key: "alamat",
          caption: "Alamat",
          value: "",
          rules: "max:250"
        },
        {
          key: "is_active",
          caption: "Statusaktif",
          value: "",
          rules: "boolean"
        }
      ],
      showDialog: false
    };
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.initStore();
  },
  methods: {
    async initStore() {
      try {
        this.activateLoader();
        const role = await axios
          .get(USERS_URL + "/" + this.id)
          .then(res => res.data.data);
        this.$store.commit("currentEdit", role);
        this.setFields();
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    toHome() {
      window.location.href = "/manage/users";
    },
    setFields() {
      this.errors.clear();
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.editData();
          return;
        }
      });
    },
    async editData() {
      try {
        this.activateLoader();
        if (this.currentEdit) {
          const resp = await axios
            .put(USERS_URL + "/" + this.currentEdit._id, this.formData)
            .then(res => res.data);
          this.$store.commit("currentEdit", resp.data);
          this.setFields();
          showNoty("Data diperbaharui", "success");
          this.deactivateLoader();
        }
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    confirmDelete() {
      this.showDialog = true;
    },
    async removeData() {
      try {
        this.activateLoader();
        if (this.currentEdit) {
          const resp = await axios
            .delete(USERS_URL + "/" + this.currentEdit._id)
            .then(res => res.data);
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success");
            this.toHome();
          }
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        this.showDialog = false;
        catchError(e);
      }
    }
  },
  computed: {
    formData() {
      let formData = {};
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (formData[data.key] = this.currentEdit[data.key])
        );
        return formData;
      }
      return null;
    }
  }
};
</script>

<style scoped>
</style>
