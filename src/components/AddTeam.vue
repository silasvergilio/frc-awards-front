<template>
  <v-form ref="form">
    <v-container>
      <CardTitlePage
        titulo="Adicionar Time"
        icon="mdi-shield-plus-outline"
        body="Adicione um time ao sistema, não se esqueça de confirmar os dados antes de enviar. Esta ação deve ser realizada apenas
      pela equipe de organização do evento"
      >
      </CardTitlePage>

      <v-row>
        <v-container>
          <v-col cols="12" md="12">
            <v-text-field
              prepend-icon="mdi-card-text-outline"
              label="Nome da Equipe"
              v-model="teamName"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field
              label="Número da Equipe"
              prepend-icon="mdi-pound-box-outline"
              v-model="teamNumber"
              :rules="[rules.teamNumber]"
              v-mask="'###############'"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field
              label="Escola"
              prepend-icon="mdi-pound-box-outline"
              v-model="school"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-combobox
              v-model="state"
              :items="estados"
              label="Selecione o estado"
            ></v-combobox>
          </v-col>

          <v-col cols="12" md="12">
            <v-btn
              class="
                white--text
                v-btn v-btn--depressed v-btn--flat v-btn--outlined
                theme--light
                v-size--default
                blue--text
                text--accent-4
              "
              :rounded="true"
              :outlined="true"
              v-on:click="adicionaTime(teamName, teamNumber, state, school)"
            >
              Adicionar
            </v-btn>
          </v-col>
        </v-container>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
.container-inputs {
  display: flex;
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
        : process.env.process.env.VUE_APP_SERVER_DOMAIN,
      teamNumber: "",
      teamName: "",
      school: "",
      state: "",
      rules: {
        teamNumber: (value) => {
          const pattern = /^(0|[1-9][0-9]*)$/;
          return pattern.test(value) || "Número não válido.";
        },
      },
      estados: [
        { text: "AC", value: "AC" },
        { text: "AL", value: "AL" },
        { text: "AP", value: "AP" },
        { text: "AM", value: "AM" },
        { text: "CE", value: "CE" },
        { text: "DF", value: "DF" },
        { text: "ES", value: "ES" },
        { text: "GO", value: "GO" },
        { text: "MA", value: "MA" },
        { text: "MT", value: "MT" },
        { text: "MS", value: "MS" },
        { text: "MG", value: "MG" },
        { text: "PA", value: "PA" },
        { text: "PB", value: "PB" },
        { text: "PR", value: "PR" },
        { text: "PE", value: "PE" },
        { text: "PI", value: "PI" },
        { text: "RJ", value: "RJ" },
        { text: "RN", value: "RN" },
        { text: "RS", value: "RS" },
        { text: "RO", value: "RO" },
        { text: "RR", value: "RR" },
        { text: "SC", value: "SC" },
        { text: "SP", value: "SP" },
        { text: "SE", value: "SE" },
        { text: "TO", value: "TO" },
      ],
    };
  },
  components: {
    CardTitlePage,
  },

  methods: {
    adicionaTime: function(nomeTime, numeroTime, estadoTime, escolaTime) {
      var requisicao = {
        text: nomeTime,
        value: numeroTime,
        school: escolaTime,
        state: estadoTime.value,
      };
      //  window.alert(JSON.stringify(requisicao));
      this.$refs.form.reset();

      fetch(`${this.serverDomain}/teams?bulk=true`, {
        method: "post",
        body: JSON.stringify(requisicao),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function() {});
    },
  },
};
</script>
