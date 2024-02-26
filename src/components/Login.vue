<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-form ref="form">
      <Loader v-bind:overlay="loader"> </Loader>

      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">
            {{ dialogMessage.title }}
          </v-card-title>

          <!-- <v-img :src="require('../assets/warning.png')" /> -->

          <v-card-text>
            {{ dialogMessage.message }}
          </v-card-text>
        </v-card>
      </v-dialog>
      <!--Dialog de Confirmação -->

      <v-container>
        <CardTitlePage titulo="Login" icon="mdi-login" body=""> </CardTitlePage>

        <v-row>
          <v-container class="container-inputs">
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Nome de Usuário"
                rules="required"
              >
                <v-text-field
                  prepend-icon="mdi-card-text-outline"
                  label="Nome do Usuário"
                  :error-messages="errors"
                  v-model="userName"
                ></v-text-field>
              </validation-provider>
            </v-col>

            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Senha"
                rules="required"
              >
                <v-text-field
                  :error-messages="errors"
                  label="Senha"
                  prepend-icon="mdi-lock-question"
                  v-model="password"
                  type="password"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-container>
        </v-row>
        <v-row>
          <v-container class="container-inputs">
            <v-col cols="12" md="12">
              <v-btn
                :disabled="invalid"
                color="#68C3E2"
                depressed
                elevation="5"
                outlined
                v-on:click="login(userName, password)"
              >
                Login
              </v-btn>
            </v-col>
          </v-container>
        </v-row>
      </v-container>
    </v-form>
  </validation-observer>
</template>

<style scoped>
/* .container-inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
} */
</style>

<script>
import CardTitlePage from "./CardTitlePage";
import Loader from "./Loader.vue";
import { required } from "vee-validate/dist/rules";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";

extend("required", {
  ...required,
  message: "{_field_} não pode ser vazio",
});

export default {
  data() {
    return {
      loader: false,
      valid: false,
      dialog: false,
      dialogMessage: {
        title: "",
        message: "",
      },
      password: "",
      userName: "",
      serverDomain: window.location.host.includes('localhost') ? "http://localhost:3000" : "https://frc-awards-server-9337a2478636.herokuapp.com",
    };
  },
  components: {
    CardTitlePage,
    ValidationObserver,
    ValidationProvider,
    Loader,
  },

  created() {
      /* eslint-disable*/
      console.log(this.serverDomain);
    },

  methods: {
    

    UserException(message, serverError) {
      this.message = message;
      this.name = "UserException";
      this.sqlError = serverError;
    },

    login: function(userName, password) {
      var requisicao = {
        userName: userName,
        password: password,
      };
      this.loader = true;
      /* eslint-disable*/
      fetch(`${this.serverDomain}/users/login`, {
        credentials: "include",
        method: "post",
        body: JSON.stringify(requisicao),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin":
            "https://ftc-awards-server-mysql.herokuapp.com",
        },
      })
        .then((response) => {
          this.loader = false;
          return response.json();
        })
        .then((res) => {
          this.loader = false;
          if (res.status == "success") {
            /* eslint-disable*/
            this.$store.commit("updateUser", res.user);
            this.$router.push("/listTeams");
          }
        })
        .catch((err) => {
          /* eslint-disable*/
        });
      this.userName = "";
      this.password = "";
      this.$refs.observer.reset();
    },
  },
};
</script>
