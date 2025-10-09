<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>

          <v-card-text>
            <Form :validation-schema="schema" @submit="login">
              <v-row>
                <!-- Usuário -->
                <v-col cols="12">
                  <Field
                    name="userName"
                    as="v-text-field"
                    label="Nome do Usuário"
                    prepend-icon="mdi-card-text-outline"
                    v-model="userName"
                  />
                  <ErrorMessage name="userName">
                    <template #default="{ message }">
                      <v-alert type="error" dense text>{{ message }}</v-alert>
                    </template>
                  </ErrorMessage>
                </v-col>

                <!-- Senha -->
                <v-col cols="12">
                  <Field
                    name="password"
                    as="v-text-field"
                    label="Senha"
                    prepend-icon="mdi-lock-question"
                    type="password"
                    v-model="password"
                  />
                  <ErrorMessage name="password">
                    <template #default="{ message }">
                      <v-alert type="error" dense text>{{ message }}</v-alert>
                    </template>
                  </ErrorMessage>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn color="#68C3E2" type="submit" class="ma-2" block>
                    Login
                  </v-btn>
                </v-col>
              </v-row>
            </Form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      userName: "",
      password: "",
      // Ajuste seu domínio conforme antes
      serverDomain: window.location.host.includes("localhost")
        ? process.env.VUE_APP_SERVER_DOMAIN
        : process.env.VUE_APP_SERVER_DOMAIN,
      schema: yup.object({
        userName: yup.string().required("Nome do Usuário não pode ser vazio"),
        password: yup.string().required("Senha não pode ser vazia"),
      }),
    };
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    return { store, router };
  },
  methods: {
    async login() {
      try {
        const response = await fetch(`${this.serverDomain}/users/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: this.userName,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (data.status === "success") {
          this.store.commit("updateUser", data.user);
          this.router.push("/listTeams");
        } else {
          throw new Error(data.message || "Erro ao logar");
        }
      } catch (err) {
        alert(err.message); // pode trocar por v-dialog se quiser
      } finally {
        this.userName = "";
        this.password = "";
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  padding: 1rem;
}
</style>