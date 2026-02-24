<template>
  <div>
    <!-- Dialog de imagem -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-img v-if="times.length > 0" :src="srcComputed" max-height="300" contain />
      </v-card>
    </v-dialog>

    <!-- Loader -->
    <!-- Loader -->
    <v-skeleton-loader v-if="loader" class="mx-auto mt-4" type="table" elevation="1" :loading="loader">
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
    <!-- Tabela de times -->
    <v-container v-else fluid>
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          Controle de visitas </v-card-title>

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
            <tr v-for="item in times" :key="item.value" style="cursor: pointer">
              <td>{{ item.text }}</td>
              <td>{{ item.value }}</td>
              <td class="text-center">
                <v-checkbox hide-details density="compact" color="#1E5AA8" v-model="item.visitedTA"
                  @change="visitChange(item, 'visitedTA')" />
              </td>
              <td class="text-center">
                <v-checkbox hide-details density="compact" color="#1E5AA8" v-model="item.visitedMCI"
                  @change="visitChange(item, 'visitedMCI')" />
              </td>
              <td class="text-center">
                <v-checkbox hide-details density="compact" color="#1E5AA8" v-model="item.visitedExtra"
                  @change="visitChange(item, 'visitedExtra')" />
              </td>
            </tr>
          </tbody>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useApi } from "@/composables/useApi";
import { useEventStore } from "@/stores/eventStore";

export default {
  data() {
    return {
      dialog: false,
      index: 0,
      loader: false,
    };
  },

  setup() {
    const times = ref([]);
    const loader = ref(false);

    const api = useApi();
    const eventStore = useEventStore();

    const fetchTeams = async () => {
      loader.value = true;
      try {
        const result = await api.apiRequest("teams", {
          method: "GET",
          headers: { eventCode: eventStore.selectedEvent?.value },
        });

        // 🔹 Converter valores para booleanos reais
        times.value = result.map(team => ({
          ...team,
          visitedTA: team.visitedTA === true || team.visitedTA === "true" || team.visitedTA === 1,
          visitedMCI: team.visitedMCI === true || team.visitedMCI === "true" || team.visitedMCI === 1,
          visitedExtra: team.visitedExtra === true || team.visitedExtra === "true" || team.visitedExtra === 1,
        }));
      } catch (error) {
        console.error("Erro ao buscar times:", error.message);
      } finally {
        loader.value = false;
      }
    };


    // 🔁 Reativo: sempre que o evento mudar, recarrega times e dados do evento
    watch(
      () => eventStore.selectedEvent,
      (newEvent, oldEvent) => {
        if (newEvent?.value && newEvent?.value !== oldEvent?.value) {
          fetchTeams();
        }
      },
      { immediate: true }
    );


    // 📌 Atualizar visita
    const visitChange = async (item, visitType) => {
      loader.value = true;
      try {
        await api.apiRequest(`teams/${item.value}`, {
          method: "PUT",
          headers: { eventCode: eventStore.selectedEvent?.value },
          body: JSON.stringify({
            visit: visitType,
            newValue: item[visitType],
          }),
        });
      } catch (error) {
        console.error("Erro ao atualizar visita:", error.message);
      } finally {
        loader.value = false;
      }
    };



    // Chama o fetch ao montar
    fetchTeams();

    return { times, loader, visitChange };
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
  },


};
</script>

<style scoped>
tr:hover {
  background-color: #e3f2fd;
  transition: 0.2s;
}
</style>