<template>
  <div>

  </div>
</template>

<script>
export default {
  props: ["user"],
  mounted() {
    this.getMe();
  },
  methods: {
    async getMe() {
      try {
        let user = await axios.get("/api/v1/me").then(res => res.data);
        this.$store.commit("user", user);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style scoped>
</style>
