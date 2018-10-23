<template>
  <div>
    <v-alert
      :value="error != 'null'"
      dismissible
      type="error"
    >
      {{ error }}
    </v-alert>
  </div>
</template>

<script>
import { showNoty } from "../utils/catchError.js";
export default {
  props: {
    error: {
      type: String,
      required: false,
      default: ""
    }
  }
};
</script>

<style scoped>
</style>
