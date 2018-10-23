<template>
  <v-toolbar-items v-if="user">
    <v-menu
      origin="center center"
      transition="scale-transition"
      bottom
    >
      <v-btn flat slot="activator">
        {{ user.nama }}
      </v-btn>
      <v-list>
        <v-list-tile avatar color="primary">
          <v-list-tile-content>
            <v-list-tile-title v-html="user.nama"/>
            <v-list-tile-sub-title v-html="user.email"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-list-tile v-for="(item, index) in righItems" :key="index" @click="itemActions(item.title)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar-items>
</template>

<script>
export default {
  data() {
    return {
      righItems: [
        { title: "Profile", icon: "account_box" },
        { title: "Logout", icon: "exit_to_app" }
      ]
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    logout() {
      window.location.href = "/logout";
    },
    toProfile() {
      this.$router.push("/profile");
    },
    itemActions(title) {
      switch (title) {
        case "Logout":
          this.logout();
          break;
        case "Profile":
          this.toProfile();
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
</style>
