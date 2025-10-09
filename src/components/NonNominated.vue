<template>
  <div>
    <!-- Diálogo de Imagem -->
    <v-dialog v-model="dialog" max-width="320">
      <v-card v-if="times.length > 0">
        <v-img :src="srcComputed" />
      </v-card>
    </v-dialog>

    <!-- Loader -->
  <!-- Loader -->
  <v-skeleton-loader
  v-if="loader"
  class="mx-auto mt-4"
  type="table"
  elevation="1"
  :loading="loader"
>
  <template #default>
    <v-card flat>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-left">Número</th>
            <th class="text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 8" :key="n">
            <td><v-skeleton-loader type="text" width="70%"></v-skeleton-loader></td>
            <td><v-skeleton-loader type="text" width="40%"></v-skeleton-loader></td>
            <td><v-skeleton-loader type="text" width="50%"></v-skeleton-loader></td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </template>
</v-skeleton-loader>

    <!-- Título -->
    <v-container v-else fluid>
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          Times não indicados </v-card-title>

        <!-- Tabela -->
        <v-data-table :headers="headers" hover :items="times" hide-default-footer class="team-table"
          @click:row="openDialog" />
      </v-card>
    </v-container>
  </div>
</template>

<script>
import CardTitlePage from "./CardTitlePage";

export default {
  components: {CardTitlePage },
  data() {
    return {
      times: [],
      index: 0,
      dialog: false,
      loader: false,
      serverDomain: process.env.VUE_APP_SERVER_DOMAIN,

      headers: [
        { title: "Nome", key: "text", align: "start" },
        { title: "Número", key: "value" },
        { title: "Estado", key: "state" },
      ],
    };
  },
  computed: {
    srcComputed() {
      if (!this.times[this.index]) return require("../assets/fotos_times/standard.webp");
      try {
        return require(`../assets/fotos_times/${this.times[this.index].value}.jpg`);
      } catch {
        return require("../assets/fotos_times/standard.webp");
      }
    },
  },
  methods: {
    openDialog(item) {
      const i = this.times.findIndex((t) => t.value === item.value);
      this.index = i;
      this.dialog = true;
    },
  },
  created() {
    this.loader = true;
    fetch(`${this.serverDomain}/awards/non-nominated/teams`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        this.times = json.sort((a, b) => Number(a.value) - Number(b.value));
      })
      .catch((err) => console.error(err))
      .finally(() => (this.loader = false));
  },
};
</script>

<style scoped>
.card-title {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

/* Estética da tabela */
.team-table {
  font-family: "Roboto", sans-serif;
  --v-theme-surface-variant: transparent;
}

.v-data-table-row:hover {
  background-color: rgba(30, 90, 168, 0.08) !important;
  /* hover azul leve */
  cursor: pointer;
}
</style>