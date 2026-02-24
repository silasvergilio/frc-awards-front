<template>
  <div>
    <!-- Dialog de Imagem -->
    <v-dialog v-model="dialog" max-width="290">
      <v-card v-if="times.length > 0">
        <v-img v-if="times[index]?.imageLink" :src="times[index].imageLink" />
        <v-img v-else :src="srcComputed" />
      </v-card>
    </v-dialog>

    <v-card v-if="event" color="#598290" class="mx-auto" prepend-icon="mdi-robot" :subtitle=event.location>
      <template v-slot:title>
        <span class="font-weight-black">{{event.name}}</span>
      </template>

    </v-card>

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


    <v-data-table v-else :headers="headers" :items="times" hover hide-default-footer :items-per-page="times.length">
      <template #item="{ item }">
        <tr @click="openDialog(item)" style="cursor: pointer;">
          <td>{{ item.state }}</td>
          <td>{{ item.text }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.school }}</td>
        </tr>
      </template>

    </v-data-table>

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
        const result = await api.apiRequest('teams', {
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
/* Para todas as linhas da tabela */
.v-data-table tbody tr:hover {
  background-color: #e0f7fa !important;
  /* substitua pela cor desejada */
  cursor: pointer;
}

.team-table {
  width: 100%;
  border-collapse: collapse;
}

.team-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.team-row:hover {
  background-color: #e0f7fa;
}

.even-row {
  background-color: #f5f5f5;
}
</style>