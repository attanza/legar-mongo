<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn :bottom="true" :tooltip-text="'Tambahkan ' + title " icon-mode icon="add" color="primary" @onClick="showForm = true"/>
        <!-- <Tbtn :bottom="true" :tooltip-text="'Download data ' + title" icon-mode icon="cloud_download" color="primary" @onClick="downloadData"/> -->

        <v-spacer/>
        <v-text-field
          v-model="pagination.search"
          append-icon="search"
          label="Cari"
          single-line
          hide-details
        />
      </v-toolbar>
      <v-data-table
        v-if="items"
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :rows-per-page-items="rowsPerPage"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.description }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="primary">remove_red_eye</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
    <!-- <DownloadDialog :show-dialog="showDownloadDialog" :data-to-export="dataToExport" :fillable="fillable" :type-dates="typeDates" model="Role" @onClose="showDownloadDialog = false"/> -->

  </div>
</template>
<script>
import debounce from "lodash/debounce";
import { ROLES_URL } from "../utils/apis.js";
import { global } from "../mixins";
import { dform } from "../components/roles";
import catchError from "../utils/catchError.js";
// import axios from "axios";
// import DownloadDialog from "~/components/DownloadDialog";

export default {
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "Role",
    headers: [
      { text: "Role", align: "left", value: "name" },
      { text: "Deskripsi", align: "left", value: "description" },
      { text: "Aksi", value: "", align: "center", sortable: false }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    dataToExport: [],
    fillable: ["id", "name", "slug", "description"],
    typeDates: ["created_at"]
  }),

  watch: {
    pagination: {
      handler: debounce(function() {
        this.pupulateTable();
      }, 500),
      deep: true
    }
  },

  mounted() {
    this.pupulateTable();
  },

  methods: {
    async pupulateTable() {
      try {
        this.activateLoader();
        this.loading = true;

        const { descending, sortBy } = this.pagination;
        const endPoint = `${ROLES_URL}?${this.getQueryParams()}`;

        const res = await axios.get(endPoint).then(res => res.data);
        this.items = res.data;
        this.totalItems = res.meta.total;
        if (this.pagination.sortBy) {
          this.items = this.items.sort((a, b) => {
            const sortA = a[sortBy];
            const sortB = b[sortBy];

            if (descending) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }
        this.loading = false;
        this.deactivateLoader();
      } catch (e) {
        this.loading = false;
        this.deactivateLoader();
        console.log(e);
        catchError(e);
      }
    },
    toDetail(data) {
      window.location.href = `/manage/roles/${data._id}`;
    },
    addData(data) {
      this.items.unshift(data);
      this.showForm = false;
    },
    downloadData() {
      this.dataToExport = [];
      this.dataToExport = this.items;
      if (this.dataToExport.length) {
        this.showDownloadDialog = true;
      }
    }
  }
};
</script>
