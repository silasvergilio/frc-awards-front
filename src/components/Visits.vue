<template>
  <div>
    <!-- Dialog de imagem -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-img
          v-if="times.length > 0"
          :src="srcComputed"
          max-height="300"
          contain
        />
      </v-card>
    </v-dialog>

    <!-- Loader -->
    <Loader :overlay="loader" />

    <!-- Tabela de times -->
    <v-container fluid>
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
Controle de visitas        </v-card-title>

        <v-data-table hide-default-footer :items-per-page="times.length">
          <thead>
            <tr>
              <th class="text-left">Nome</th>
              <th class="text-left">Número</th>
              <th class="text-center">Visita AE</th>
              <th class="text-center">Visita MCI</th>
              <th class="text-center">Visita Extra</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in times"
              :key="item.value"
              style="cursor: pointer"
            >
              <td>{{ item.text }}</td>
              <td>{{ item.value }}</td>
              <td class="text-center">
                <v-checkbox
                  hide-details
                  density="compact"
                  color="#1E5AA8"
                  v-model="item.visitedTA"
                  @change="visitChange(item, 'visitedTA')"
                />
              </td>
              <td class="text-center">
                <v-checkbox
                  hide-details
                  density="compact"
                  color="#1E5AA8"
                  v-model="item.visitedMCI"
                  @change="visitChange(item, 'visitedMCI')"
                />
              </td>
              <td class="text-center">
                <v-checkbox
                  hide-details
                  density="compact"
                  color="#1E5AA8"
                  v-model="item.visitedExtra"
                  @change="visitChange(item, 'visitedExtra')"
                />
              </td>
            </tr>
          </tbody>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Loader from "./Loader.vue";

export default {
  components: { Loader },

  data() {
    return {
      times: [],
      dialog: false,
      index: 0,
      loader: false,
      serverDomain: process.env.VUE_APP_SERVER_DOMAIN,
    };
  },

  computed: {
    srcComputed() {
      try {
        return require(`../assets/fotos_times/${this.times[this.index].value}.jpg`);
      } catch {
        return require("../assets/fotos_times/standard.webp");
      }
    },
  },

  methods: {
    openDialog(index) {
      this.index = index;
      this.dialog = true;
    },

    async visitChange(item, visitType) {
      this.loader = true;
      try {
        const requisicao = {
          visit: visitType,
          newValue: item[visitType],
        };

        await fetch(`${this.serverDomain}/teams/${item.value}`, {
          method: "PUT",
          body: JSON.stringify(requisicao),
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Erro ao atualizar visita:", err);
      } finally {
        this.loader = false;
      }
    },
  },

  created() {
    this.loader = true;
    fetch(`${this.serverDomain}/teams`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        this.times = json.map((t) => ({
          ...t,
          visitedMCI: t.visitedMCI == 0 ? false : true,
          visitedTA: t.visitedTA == 0 ? false : true,
          visitedExtra: t.visitedExtra == 0 ? false : true,

        }));
      })
      .finally(() => {
        this.loader = false;
      });
  },
};
</script>

<style scoped>
tr:hover {
  background-color: #e3f2fd;
  transition: 0.2s;
}
</style>