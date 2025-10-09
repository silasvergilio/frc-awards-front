<template>
  <v-form ref="form">
    <v-container fluid>
      <CardTitlePage
        titulo="Adicionar Foto"
        icon="mdi-camera"
        body="Anexe uma imagem para o time selecionado."
        class="card-title"
      />

      <Loader :overlay="loader" />

      <v-row>
        <v-col cols="12" md="6">
          <v-combobox
            v-model="team"
            :items="times"
            item-title="text"
            item-value="value"
            label="Selecione o time"
            density="comfortable"
            outlined
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-file-input
            @change="onFileChange"
            prepend-icon="mdi-image-plus"
            accept="image/*"
            label="Anexar imagem"
            density="comfortable"
            outlined
          />
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-4">
        <v-btn
          @click="addPhoto"
          color="#1E5AA8"
          variant="outlined"
          elevation="4"
          :disabled="!invalid"
        >
          Enviar
        </v-btn>
      </v-row>
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
      loader: false,
      team: null,
      myFileObject: null,
      serverDomain: process.env.VUE_APP_SERVER_DOMAIN,
    };
  },

  computed: {
    invalid() {
      return this.team && this.myFileObject;
    },
  },

  methods: {
    onFileChange(e) {
      this.myFileObject = e;
    },

    async addPhoto() {
      if (!this.team || !this.myFileObject) return;

      this.loader = true;
      try {
        const formData = new FormData();
        formData.append("file", this.myFileObject);
        formData.append(
          "bodyReq",
          JSON.stringify({ value: this.team.value })
        );

        await axios.post(`${this.serverDomain}/teams/picture`, formData);

        this.$refs.form.reset();
        this.team = null;
        this.myFileObject = null;

        this.$emit("notify", { type: "success", message: "Imagem enviada com sucesso!" });
      } catch (error) {
        console.error(error);
        this.$emit("notify", { type: "error", message: "Erro ao enviar imagem." });
      } finally {
        this.loader = false;
      }
    },
  },

  created() {
    this.loader = true;
    fetch(`${this.serverDomain}/teams`, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        this.times = json.map((t) => ({
          text: `${t.value} - ${t.text}`,
          value: t.value,
        }));
      })
      .finally(() => (this.loader = false));
  },
};
</script>

<style scoped>
.card-title {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.v-btn {
  font-family: "Roboto", sans-serif;
  text-transform: none;
  font-weight: 500;
}

.v-combobox,
.v-file-input {
  font-family: "Roboto", sans-serif;
}
</style>