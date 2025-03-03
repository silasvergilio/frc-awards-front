<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-form ref="form">
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">
            {{ dialogMessage.title }}
          </v-card-title>

          <v-img :src="require('../assets/warning.png')" />

          <v-card-text>
            {{ dialogMessage.message }}
          </v-card-text>
        </v-card>
      </v-dialog>
      <!--Dialog de Confirmação -->

      <v-container>
        <CardTitlePage
          titulo="Adicionar Usuario"
          icon="mdi-account-multiple-plus"
          body="Adicionar um usuário ao sistema."
        >
        </CardTitlePage>

        <v-row>
          <v-container class="container-inputs">
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Nome Completo"
                rules="required"
              >
                <v-text-field
                  prepend-icon="mdi-account-edit"
                  label="Nome completo"
                  :error-messages="errors"
                  v-model="name"
                ></v-text-field>
              </validation-provider>
            </v-col>
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

            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Confirmação Senha"
                rules="required"
              >
                <v-text-field
                  :error-messages="errors"
                  label="Repita a senha"
                  prepend-icon="mdi-lock-question"
                  v-model="repeatPassword"
                  type="password"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-container>
        </v-row>
        <v-row>
          <v-container class="container-inputs">
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Permissão"
                rules="required"
              >
                <v-combobox
                  v-model="permission"
                  :error-messages="errors"
                  :items="possiblePermissions"
                  label="Selecione a permissão"
                ></v-combobox>
              </validation-provider>
            </v-col>

            <v-col cols="12" md="12">
              <v-btn
                :disabled="invalid"
                color="#1E5AA8"
                depressed
                elevation="5"
                outlined
                v-on:click="
                  adicionaUsuario(
                    name,
                    userName,
                    password,
                    repeatPassword,
                    permission
                  )
                "
              >
                Adicionar
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
import { required } from "vee-validate/dist/rules";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";

extend("required", {
  ...required,
  message: "{_field_} não pode ser vazio",
});

export default {
  data() {
    return {
      valid: false,
      dialog: false,
      dialogMessage: {
        title: "",
        message: "",
      },
      password: "",
      repeatPassword: "",
      userName: "",
      permission: "",
      possiblePermissions: ["Administrador", "Juiz de Sala"],
      name: "",
      serverDomain: window.location.host.includes('localhost') ? "http://localhost:3000" : process.env.SERVER_DOMAIN,      
    };
  },
  components: {
    CardTitlePage,
    ValidationObserver,
    ValidationProvider,
  },

  methods: {
    UserException(message, serverError) {
      this.message = message;
      this.name = "UserException";
      this.sqlError = serverError;
    },
    adicionaUsuario: function (
      name,
      userName,
      password,
      repeatPassword,
      permission
    ) {
      var requisicao = {
        name: name,
        userName: userName,
        password: password,
        repeatPassword: repeatPassword,
        permission: permission,
      };

      // this.$refs.observer.validate();

      fetch(`${this.serverDomain}/users`, {
        method: "post",
        body: JSON.stringify(requisicao),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          /* eslint-disable*/
          return response.json();
        })
        .then((response) => {
          /* eslint-disable*/
          if (response.SqlError) {
            if (response.SqlError.errno == 1062) {
              throw new this.UserException(
                "Usuario já existe !",
                response.SqlError
              );
            } else if (response.SqlError && response.SqlError.errno == 1162) {
              throw new this.UserException(
                "Senhas não conferem !",
                response.SqlError
              );
            }
          }
        })
        .catch((err) => {
          /* eslint-disable*/
          this.dialog = true;
          this.dialogMessage.title = "Erro";
          this.dialogMessage.message = err.message;
        });
      this.name = "";
      this.userName = "";
      this.password = "";
      this.repeatPassword = "";
      this.permission = "";
      this.$refs.observer.reset();
    },
  },
};
</script>


