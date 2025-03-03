<template>
  <v-form ref="form">
    <v-container fluid>
      <CardTitlePage titulo="Adicionar Foto" icon="mdi-file-tree" body="Indicar um time a um prêmio. Lembre-se de seguir as instruções do Juiz-Chefe quanto 
        a quantidade, critérios e metodologia">
      </CardTitlePage>

      <Loader v-bind:overlay="loader"> </Loader>

      <v-row>
        <v-col cols="12" md="12">
          <v-combobox v-model="team" :items="times" label="Selecione o time"></v-combobox>
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
          <v-btn @click="addPhoto()" color="#1E5AA8" depressed elevation="5" outlined :disabled="!invalid">
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
    addPhoto: function () {
      /* eslint-disable*/
      const formData = new FormData();
      formData.append("file", this.myFileObject);
      console.log(this.myFileObject);
      this.loader = true;
      var requisicao = {
        value: this.team.value,
      };
      formData.append("bodyReq", JSON.stringify(requisicao));

      // window.alert(JSON.stringify(requisicao));
      var url = `${this.serverDomain}/teams/picture`;

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
        { text: "Rookie All-Star", value: 10 },
        { text: "Rookie Inspiration", value: 11 },
        { text: "Team Spirit", value: 12 },
        { text: "Team Sustainability", value: 13 },
      ],
      salas: [
        { text: "Lubia / William" },
        { text: "Danielly / Flaudilenio" },
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
      return this.team;
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

        this.times.forEach((element) => {
          element.text = `${element.text}-${element.value}`
        })
      });
  },
};
</script>
