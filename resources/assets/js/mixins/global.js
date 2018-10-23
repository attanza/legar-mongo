import changeCase from "change-case";
import { mapState } from "vuex";
import axios from "axios";
import { Noty } from "../components/";
import { Tbtn } from "../components";
import { ExportToCsv } from "export-to-csv";

export default {
  components: { Noty, Tbtn },
  data() {
    return {
      loading: false,
      showForm: false,
      totalItems: 0,
      search: "",
      rowsPerPage: [10, 25, 50, 100],
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        limit: 10,
        rowsPerPage: 10,
        search: null,
        search_by: null,
        search_query: null,
        between_date: null,
        start_date: null,
        end_date: null,
        sort_by: null,
        sort_mode: null
      },
      showDownloadDialog: false
    };
  },
  methods: {
    inArray(keys, searchedKey) {
      let result = false;
      for (let i in keys) {
        if (keys[i] === searchedKey) {
          result = true;
        }
      }
      return result;
    },
    setCase(txt) {
      return changeCase.titleCase(txt);
    },
    setSnakeCase(txt) {
      return changeCase.snakeCase(txt);
    },
    activateLoader() {
      this.$bus.$emit("activate_loader");
    },
    deactivateLoader() {
      this.$bus.$emit("deactivate_loader");
    },

    csvExport(title, data) {
      const options = {
        filename: title,
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalseparator: ".",
        showLabels: true,
        showTitle: true,
        title: title,
        useBom: true,
        useKeysAsHeaders: true
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      };

      if (data.length) {
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(data);
      }
    },
    getQueryParams() {
      let query = "";
      for (let key in this.pagination) {
        if (
          this.pagination.hasOwnProperty(key) &&
          this.pagination[key] != null
        ) {
          query += `${key}=${this.pagination[key]}&`;
        }
      }
      return query;
    },
    resetPagination() {
      this.pagination = {
        sortBy: "",
        descending: false,
        search: null,
        search_by: null,
        search_query: null,
        between_date: null,
        start_date: null,
        end_date: null,
        sort_by: null,
        sort_mode: null
      };
    }
  },
  computed: {
    ...mapState([
      "token",
      "currentEdit",
      "comboData",
      "comboData2",
      "comboData3",
      "permissions",
      "user",
      "dashboardData"
    ])
  }
};
