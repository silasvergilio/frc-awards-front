<template>
  <v-form ref="form">
    <v-container fluid>
      <CardTitlePage titulo="Nomear time a um prêmio" icon="mdi-file-tree" body="Indicar um time a um prêmio. Lembre-se de seguir as instruções do Juiz-Chefe quanto 
      a quantidade, critérios e metodologia">
      </CardTitlePage>

      <Loader v-bind:overlay="loader"> </Loader>

      <v-row>
        <v-col cols="12" md="4">
          <v-combobox v-model="team" :items="times" label="Selecione o time"></v-combobox>
        </v-col>

        <v-col cols="12" md="4">
          <v-combobox v-model="award" :items="premios" label="Selecione o prêmio"></v-combobox>
        </v-col>

        <v-col cols="12" md="4">
          <v-combobox v-model="room" :items="salas" label="Selecione a Dupla"></v-combobox>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12">
          <v-container fluid>
            <v-textarea v-model="message" label="Justificativa"></v-textarea>
          </v-container>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12">
          <v-container fluid>
            <v-file-input @change="onFileChange" prepend-icon="mdi-camera" accept="image/*"
              label="Anexar imagem"></v-file-input>
          </v-container>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-btn @click="indicaTime()" color="#1E5AA8" depressed elevation="5" outlined :disabled="!invalid">
            Enviar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

</template>

<script>
import CardTitlePage from "./CardTitlePage";
import Loader from "./Loader.vue";
import axios from "axios";

export default {
  methods: {
    AwardException(message, serverError) {
      this.message = message;
      this.name = "AwardException";
      this.sqlError = serverError;
    },
    onFileChange(e) {
      /* eslint-disable*/
      this.myFileObject = e;
    },
    indicaTime: function () {
      /* eslint-disable*/
      const formData = new FormData();
      formData.append("file", this.myFileObject);
      console.log(this.myFileObject);
      this.loader = true;
      var requisicao = {
        value: this.team.value,
        text: this.team.text,
        motive: this.message,
        judge: this.room.text,
      };
      formData.append("bodyReq", JSON.stringify(requisicao));

      // window.alert(JSON.stringify(requisicao));
      var url;

      switch (this.award.value) {
        case 1:
          url = `${this.serverDomain}/awards/Autonomous`;
          break;
        case 2:
          url = `${this.serverDomain}/awards/Creativity`;
          break;
        case 3:
          url = `${this.serverDomain}/awards/ExcellenceEngineering`;
          break;
        case 4:
          url = `${this.serverDomain}/awards/IndustrialDesign`;
          break;
        case 5:
          url = `${this.serverDomain}/awards/InnovationControl`;
          break;
        case 6:
          url = `${this.serverDomain}/awards/Quality`;
          break;
        case 7:
          url = `${this.serverDomain}/awards/EngineeringInspiration`;
          break;
        case 8:
          url = `${this.serverDomain}/awards/Gracious`;
          break;
        case 9:
          url = `${this.serverDomain}/awards/Imagery`;
          break;
        case 10:
          url = `${this.serverDomain}/awards/Judges`;
          break;
        case 11:
          url = `${this.serverDomain}/awards/Ras`;
          break;
        case 12:
          url = `${this.serverDomain}/awards/RookieInspiration`;
          break;
        case 13:
          url = `${this.serverDomain}/awards/TeamSpirit`;
          break;
        case 14:
          url = `${this.serverDomain}/awards/TeamSustainability`;
          break;
      }

      axios
        .post(url, formData)
        .then((res) => {
          /* eslint-disable*/
          this.loader = false;
          return response.json();
        })
        .then((response) => {
          /* eslint-disable*/
          if (response.SqlError) {
            if (response.SqlError.errno == 1010) {
              throw new this.AwardException(
                "Equipe Já indicada",
                response.SqlError
              );
            }
          }
        })
        .catch(() => {
          /* eslint-disable*/
          //this.dialog = true;
          // this.dialogMessage.title = "Erro";
          // this.dialogMessage.message = err.message;
        });

      this.$refs.form.reset();
    },
  },
  data() {
    return {
      times: [],
      timesNome: [],
      loader: false,
      serverDomain: window.location.host.includes("localhost")
        ? "http://localhost:3000"
        :process.env.VUE_APP_SERVER_DOMAIN,
      premios: [
        { text: "Autonomous", value: 1 },
        { text: "Creativity", value: 2 },
        { text: "Excellence in Engineering", value: 3 },
        { text: "Industrial Design", value: 4 },
        { text: "Innovation in Control", value: 5 },
        { text: "Quality", value: 6 },
        { text: "Engineering Inspiration", value: 7 },
        { text: "Gracious Professionalism", value: 8 },
        { text: "Imagery", value: 9 },
        { text: "Judges", value: 10 },
        { text: "Rookie All-Star", value: 11 },
        { text: "Rising All Star", value: 12 },
        { text: "Team Spirit", value: 13 },
        { text: "Team Sustainability", value: 14 },
      ],
      salas: [
        { text: "Daniel / Andrea" },
        { text: "Igor / Vitor" },
        { text: "Roger / Flaudilenio" },
        { text: "Gabriel / Carlos" },
        { text: "Jean / Felipe" },
        { text: "Lubia / Anderson" },
        { text: "Luis / Karine" },
        { text: "Pedro / Marcelo" },
        { text: "Eduardo"}
      ],

      message: "",
      team: "",
      award: "",
      room: "",
      selectedImage: "",
      myFileObject: "",
    };
  },

  check() {
    if (!this.team || !this.award) alert("Complete a indicação");
  },

  components: {
    CardTitlePage,
    Loader,
  },
  computed: {
    invalid() {
      if (this.message) return this.message.length > 60;
      return false;
    },
  },
  created() {
    this.loader = true;
    fetch(`${this.serverDomain}/teams`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        this.loader = false;
        this.times = json;
      });
  },
};
</script>
