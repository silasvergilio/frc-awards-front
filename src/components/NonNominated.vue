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

    <!-- Título -->
    <v-container v-else fluid>
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          Times não indicados </v-card-title>

        <!-- Tabela -->
        <v-data-table :headers="headers" hover :items="times"   :items-per-page="-1"
        hide-default-footer class="team-table"
          @click:row="openDialog" />
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import { ref, computed, onMounted, watch } from "vue";
  import { useApi } from "@/composables/useApi";
  import { useEventStore } from "@/stores/eventStore";
  
  export default {
    setup() {
      const dialog = ref(false);
      const times = ref([]);
      const event = ref(null); // 📌 para armazenar os dados do evento
      const index = ref(0);
      const loader = ref(false);
  
      const headers = [
        { title: 'Estado', value: 'state' },
        { title: 'Nome', value: 'text' },
        { title: '#Time', value: 'value' },
        { title: 'Escola', value: 'school' },
      ];
  
      const srcComputed = computed(() => {
        if (!times.value[index.value]) return null;
        try {
          return require(`../assets/fotos_times/${times.value[index.value].value}.jpg`);
        } catch {
          return require("../assets/fotos_times/standard.webp");
        }
      });
  
      const openDialog = (item) => {
        const i = times.value.findIndex((t) => t.value === item.value);
        index.value = i;
        dialog.value = true;
      };
  
      const api = useApi();
      const eventStore = useEventStore();
  
      // 📌 Fetch de times
      const fetchTeams = async () => {
        loader.value = true;
        try {
          const result = await api.apiRequest('awards/non-nominated/teams', {
            method: "GET",
            headers: { eventCode: eventStore.selectedEvent?.value }
          });
  
          times.value = result;
          loader.value = false
        } catch (error) {
          console.error("Erro ao buscar times:", error.message);
        }
      };
  
      // 📌 Fetch do evento
      const fetchEvent = async () => {
        try {
          const result = await api.apiRequest('events', {
            method: "GET",
            headers: { eventCode: eventStore.selectedEvent?.value }
          });
          event.value = result;
        } catch (error) {
          console.error("Erro ao buscar evento:", error.message);
        }
      };
  
      // 📌 Função que chama ambas as APIs
      const fetchData = async () => {
        loader.value = true;
        await Promise.all([fetchTeams(), fetchEvent()]);
        loader.value = false;
      };
  
      // 🔁 Reativo: sempre que o evento mudar, recarrega times e dados do evento
      watch(
        () => eventStore.selectedEvent,
        (newEvent, oldEvent) => {
          if (newEvent?.value && newEvent?.value !== oldEvent?.value) {
            fetchData();
          }
        },
        { immediate: true }
      );
  
      return { dialog, times, event, index, loader, srcComputed, openDialog, headers };
    }
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