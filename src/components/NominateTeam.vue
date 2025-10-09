<template>
  <v-form ref="form">
    <v-container fluid>
      <!-- Título com descrição -->
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          Indicar Time </v-card-title>

        <!-- Loader -->
        <Loader :overlay="loader" />

        <!-- Seleções -->
        <v-row>
          <v-col cols="12" md="4">
            <v-combobox v-model="team" :items="times" item-title="text" item-value="value"
              label="Selecione o time"></v-combobox>
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox v-model="award" :items="premios" item-title="text" item-value="value" label="Selecione o prêmio"
              outlined dense required></v-combobox>
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox v-model="room" :items="salas" item-title="text" label="Selecione a Dupla" outlined dense
              required></v-combobox>
          </v-col>
        </v-row>

        <!-- Justificativa -->
        <v-row>
          <v-col cols="12">
            <v-textarea v-model="message" label="Justificativa" outlined dense></v-textarea>
          </v-col>
        </v-row>

        <!-- Botão de envio -->
        <v-row>
          <v-col cols="12" md="4">
            <v-btn @click="indicaTime" color="#1E5AA8" depressed elevation="5" outlined
              :disabled="!team || !award || !room || !message">
              Enviar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import CardTitlePage from "./CardTitlePage.vue";
import Loader from "./Loader.vue";
import axios from "axios";

export default {
  components: { CardTitlePage, Loader },
  data() {
    return {
      times: [],
      premios: [
        { text: "Destaque em Autônomo", value: 1 },
        { text: "Criatividade", value: 2 },
        { text: "Destaque em Engenharia", value: 3 },
        { text: "Destaque em Design", value: 4 },
        { text: "Destaque em Controle", value: 5 },
        { text: "Destaque em Qualidade", value: 6 },
        { text: "SESI de Inspiração para Engenharia", value: 7 },
        { text: "Gracious Professionalism", value: 8 },
        { text: "Jurados", value: 10 },
        { text: "Equipe Iniciante Destaque", value: 11 },
        { text: "Equipe Sustentável", value: 14 },
      ],
      salas: [
        { text: "Kayan / Gilvan / Sabrina" },
        { text: "Giovanni / Valter / Carlos" },
        { text: "Karine / Carol / Nathalia" },
        { text: "Silvio / Kelen" },
        { text: "Match Observer" },
        { text: "Outros" },
      ],
      team: null,
      award: null,
      room: null,
      message: "",
      myFileObject: null,
      loader: false,
      serverDomain: process.env.VUE_APP_SERVER_DOMAIN,
    };
  },
  methods: {
    onFileChange(e) {
      this.myFileObject = e;
    },
    indicaTime() {
      if (!this.team || !this.award || !this.room || !this.message) {
        alert("Preencha todos os campos antes de enviar.");
        return;
      }

      const formData = new FormData();
      if (this.myFileObject) formData.append("file", this.myFileObject);

      const requisicao = {
        value: this.team.value,
        text: this.team.text,
        motive: this.message,
        judge: this.room.text,
      };
      formData.append("bodyReq", JSON.stringify(requisicao));

      let url = "";
      switch (this.award.value) {
        case 1: url = `${this.serverDomain}/awards/Autonomous`; break;
        case 2: url = `${this.serverDomain}/awards/Creativity`; break;
        case 3: url = `${this.serverDomain}/awards/ExcellenceEngineering`; break;
        case 4: url = `${this.serverDomain}/awards/IndustrialDesign`; break;
        case 5: url = `${this.serverDomain}/awards/InnovationControl`; break;
        case 6: url = `${this.serverDomain}/awards/Quality`; break;
        case 7: url = `${this.serverDomain}/awards/EngineeringInspiration`; break;
        case 8: url = `${this.serverDomain}/awards/Gracious`; break;
        case 10: url = `${this.serverDomain}/awards/Judges`; break;
        case 11: url = `${this.serverDomain}/awards/Ras`; break;
        case 14: url = `${this.serverDomain}/awards/TeamSustainability`; break;
      }

      this.loader = true;

      axios
        .post(url, formData)
        .then(() => {
          this.loader = false;
          this.$refs.form.reset();
          this.team = null;
          this.award = null;
          this.room = null;
          this.message = "";
          this.myFileObject = null;
        })
        .catch((err) => {
          console.error(err);
          this.loader = false;
          alert("Erro ao enviar indicação!");
        });
    },
  },
  created() {
    this.loader = true;
    fetch(
      process.env.VUE_APP_SERVER_DOMAIN + "/teams",
      { credentials: "include" }
    )
      .then((response) => response.json())
      .then((json) => {
        this.loader = false;

        // Transformando cada item para ter 'text' como string legível e 'value' como id
        this.times = json.map((t) => ({
          value: t.value, // id ou número do time
          text: typeof t.text === "string" ? `${t.value} - ${t.text}` : `${t.value} - ${t.text.name}`, // ajusta caso t.text seja objeto
        }));

        console.log("Times processados:", this.times); // para conferir no console
      })
      .catch((err) => {
        this.loader = false;
        console.error("Erro ao carregar times:", err);
      });
  }
};
</script>