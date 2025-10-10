<template>
  <div>
    <!-- Dialog de Imagem -->
    <v-dialog v-model="dialog" max-width="290">
      <v-card v-if="times.length > 0">
        <v-img v-if="times[index]?.imageLink" :src="times[index].imageLink" />
        <v-img v-else :src="srcComputed" />
      </v-card>
    </v-dialog>

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
    <!-- Tabela de Times com hover e zebra stripes -->
    <!-- <v-simple-table class="team-table">
      <thead>
        <tr>
          <th class="text-left">Nome</th>
          <th class="text-left">Número</th>
          <th class="text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in times"
          :key="item.value"
          class="team-row"
          :class="{ 'even-row': i % 2 === 1 }"
          @click="openDialog(item)"
        >
          <td>{{ item.text }} <v-icon v-if="item.value >= 10000">mdi-star</v-icon></td>
          <td>{{ item.value }}</td>
          <td>{{ item.state }}</td>
        </tr>
      </tbody>
    </v-simple-table> -->

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
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const dialog = ref(false);
    const times = ref([]);
    const index = ref(0);
    const loader = ref(false);

    const headers = [
      { title: 'Estado', value: 'state' },
      { title: 'Nome', value: 'text' },
      { title: '# Time', value: 'value' },
      { title: 'Escola', value: 'school' },
    ];

    const serverDomain = process.env.VUE_APP_SERVER_DOMAIN;

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

    const fetchTeams = async () => {
      loader.value = true;
      try {
        const res = await fetch(`${serverDomain}/teams?image=true`, {
          credentials: "include",
        });
        const json = await res.json();
        times.value = json.sort((a, b) => Number(a.value) - Number(b.value));
      } catch (err) {
        console.error(err);
      } finally {
        loader.value = false;
      }
    };

    onMounted(fetchTeams);

    return { dialog, times, index, loader, srcComputed, openDialog, headers };
  },
};
</script>

<style scoped>

/* Para todas as linhas da tabela */
.v-data-table tbody tr:hover {
  background-color: #e0f7fa !important; /* substitua pela cor desejada */
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