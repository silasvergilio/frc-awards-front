<template>
  <v-container class="center-button">
    <CardTitlePage
      titulo=""
      icon="mdi-folder-check"
      body="Adiciona todos os times que estão no FTC EVENTS ao sistema"
    >
    </CardTitlePage>
    <div>
    <v-btn class="add-button" variant="outlined" @click="bulkAddTeam()">
      Adicionar Times
    </v-btn>
    </div>
  </v-container>
</template>

<style>
.add-button{
    margin-top: 2rem;
}
.center-button {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
}
</style>

<script>
import CardTitlePage from "./CardTitlePage";

export default {
  data() {
    return {
      serverDomain: window.location.host.includes("localhost")
        ? "http://localhost:3000"
        : "https://frc-awards-server-9337a2478636.herokuapp.com",
    };
  },
  components: {
    CardTitlePage,
  },

  methods: {
    bulkAddTeam() {
      fetch(`${this.serverDomain}/teams?bulk=true`, {
        method: "post",
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
