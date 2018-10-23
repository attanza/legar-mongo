<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="elevation-12">
              <form id="loginForm" method="POST" action="/post-login" v-on:submit="submit">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer/>
            </v-toolbar>
            <v-card-text>
                <v-alert
                  :value="error != 'null'"
                  dismissible
                  type="error"
                >
                {{ error }}
                </v-alert>
                <v-text-field
                  v-validate="'required|email'"
                  v-model="email"
                  :error-messages="errors.collect('email')"
                  name="email"
                  prepend-icon="email"
                  data-vv-name="email"
                />

                <v-text-field
                  v-validate="'required'"
                  v-model="password"
                  :append-icon="show1 ? 'visibility_off' : 'visibility'"
                  :type="show1 ? 'text' : 'password'"
                  :error-messages="errors.collect('password')"
                  prepend-icon="lock"
                  name="password"
                  hint="At least 6 characters"
                  min="6"
                  @click:append="show1 = !show1"

                />
                <v-text-field type="hidden" name="_csrf" :value="token"/>
            </v-card-text>
            <v-card-actions>
              <!-- <v-btn flat @click="showResetForm = true"><span>Lupa Password ?</span></v-btn> -->
              <v-spacer/>
              <v-btn :loading="loading" :disabled="loading" type="submit" color="primary">Login</v-btn>
            </v-card-actions>
              </form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  $_veeValidate: {
    validator: "new"
  },
  props: {
    token: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: false,
      default: null
    }
  },
  data: () => ({
    email: "super_user@legar.com",
    password: "password",
    e1: false,
    loading: false,
    showResetForm: false,
    show1: false
  }),
  methods: {
    submit(e) {
      e.preventDefault();
      this.$validator.validateAll().then(result => {
        if (result) {
          document.getElementById("loginForm").submit();
          return;
        }
      });
    }
  }
};
</script>
