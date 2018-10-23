<template>
  <div>
      <v-list>
        <div v-for="(item, i) in items" :key="i" >
          <v-list-tile
            v-if="!item.hasChild"
            :href="item.to"
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon"/>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group
            v-if="item.hasChild"
            :prepend-icon="item.icon"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(item, i) in item.children"
              :key="i"
              :href="item.to"

            >

              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon v-html="item.icon"/>
              </v-list-tile-action>
            </v-list-tile>
        </v-list-group></div>

      </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "dashboard", to: "/" },
        {
          title: "Role",
          icon: "pan_tool",
          to: "/manage/roles"
        },
        {
          title: "User",
          icon: "account_circle",
          to: "/manage/users"
        },
        {
          title: "Produk",
          icon: "vertical_split",
          to: "/manage/products"
        }
        // {
        //   title: "Kampus",
        //   icon: "account_balance",
        //   to: "/universities",
        //   hasChild: true,
        //   children: [
        //     {
        //       title: "Universitas",
        //       icon: "account_balance",
        //       to: "/universities"
        //     },
        //     {
        //       title: "Nama Studi",
        //       icon: "description",
        //       to: "/study-names"
        //     },
        //     {
        //       title: "Program Studi",
        //       icon: "library_books",
        //       to: "/study-programs"
        //     }
        //   ]
        // }
      ]
    };
  }
};
</script>

<style scoped>
</style>
