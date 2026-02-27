<template>
  <v-container fluid>
    <!-- Loader -->
    <v-skeleton-loader v-if="loader" class="mx-auto mt-4" type="table" elevation="1" :loading="loader">
      <template #default>
        <v-card flat>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Prêmio</th>
                <th class="text-left">Time</th>
                <th class="text-left">Sala</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in 6" :key="n">
                <td><v-skeleton-loader type="text" width="80%" /></td>
                <td><v-skeleton-loader type="text" width="60%" /></td>
                <td><v-skeleton-loader type="text" width="40%" /></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>
    </v-skeleton-loader>

    <!-- Grid de prêmios -->
    <v-row dense v-else>
      <v-col v-for="award in groupedAwards" :key="award.name" cols="12" sm="6" md="4" lg="3">
        <v-hover v-slot="{ isHover }">
          <v-card :elevation="isHover ? 12 : 4" class="award-card">
            <v-card-title class="card-title">
              {{ award.name }}
              <v-icon icon="mdi-information-outline" size="small" @click="displayAward(award)" />
            </v-card-title>

            <draggable v-if="isFTC" v-model="award.teams" item-key="Teams_idTeams" tag="v-list" handle=".drag-handle"
              @end="onDragEnd($event, award)">
              <template #item="{ element: team }">
                <v-list-item @click="openDialog(team, award)" :class="[
                  team.nominated ? 'tile' : 'alreadyAwarded',
                  positionClass(team),
                ]">
                  <v-list-item-title>
                    <v-icon icon="mdi-drag" size="small" class="mr-2 drag-handle" />
                    <b>{{ team.teamName }} - {{ team.teamNumber }}</b>
                  </v-list-item-title>
                </v-list-item>
              </template>
            </draggable>

            <v-list v-else>
              <v-list-item v-for="team in award.teams" :key="team.Teams_idTeams" @click="openDialog(team, award)"
                :class="[
                  team.nominated ? 'tile' : 'alreadyAwarded',
                  positionClass(team),
                ]">
                <v-list-item-title>
                  <b>{{ team.teamName }} - {{ team.teamNumber }}</b>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card v-if="currentTeam">
        <v-card-title class="headline">
          {{ currentAward?.name }}
        </v-card-title>

        <v-card-subtitle class="headline">
          {{ `${currentTeam.teamName} - ${currentTeam.teamNumber}` }}
        </v-card-subtitle>

        <v-card-text>
          <b>Indicado por:</b> {{ currentTeam.judge }}<br />
          <b>Descrição:</b> {{ currentTeam.motive }}
        </v-card-text>

        <v-card-actions class="flex-column">
          <v-btn color="#F9A825" text @click="toggleNomination(currentTeam, currentAward.name)">
            {{ currentTeam.nominated ? "Retirar de consideração" : "Considerar" }}
          </v-btn>
          <v-btn color="#F9A825" text @click="deleteAward(currentTeam, currentAward.name)">
            Deletar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useApi } from "@/composables/useApi";
import { useEventStore } from "@/stores/eventStore";
import draggable from "vuedraggable";

export default {
  components: { draggable },
  setup() {
    const api = useApi();
    const eventStore = useEventStore();

    const isFTC = computed(() => {
      const event = eventStore.selectedEvent;
      if (!event) return false;

      // ajuste conforme seu modelo real
      return event.program === "ftc";
    });

    const loader = ref(false);
    const dialog = ref(false);
    const groupedAwards = ref([]);

    const currentTeam = ref(null);
    const currentAward = ref(null);

    const onDragEnd = async (evt, award) => {
      /*
        evt.oldIndex → posição antiga
        evt.newIndex → posição nova
        award        → prêmio onde ocorreu o drag
      */

      const movedTeam = award.teams[evt.newIndex];

      const payload = {
        awardName: award.name,
        teamId: movedTeam.Teams_idTeams,
        newOrder: evt.newIndex + 1, // geralmente começa em 1 no banco
      };

      try {
        await api.apiRequest("awards/order", {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("Erro ao salvar nova ordem", error);
      }
    };

    const fetchAwards = async () => {
      if (!eventStore.selectedEvent?.value) return;

      loader.value = true;

      try {
        const result = await api.apiRequest("awards", {
          method: "GET",
          headers: { eventCode: eventStore.selectedEvent.value },
        });

        const teamStats = {};
        const grouped = {};

        // 1️⃣ Mapeia histórico corretamente por TIME
        result.forEach((item) => {
          const teamId = item.Teams_idTeams; // ✅ ID REAL DO TIME
          if (!teamStats[teamId]) {
            teamStats[teamId] = {
              hasAE: false,
              hasMCI: false,
              hasThink: false,
              teamNumber: item.teamNumber,
              teamName: item.teamName,
              nominated: true
            };
          }
          if (item.category === "AE") teamStats[teamId].hasAE = true;
          if (item.category === "MCI") teamStats[teamId].hasMCI = true;
          if (item.awardName === "Think Award") {
            teamStats[teamId].hasThink = true;
          }

          // agrupamento normal
          if (!grouped[item.awardName]) {
            grouped[item.awardName] = {
              name: item.awardName,
              teams: [],
            };
          }

          grouped[item.awardName].teams.push(item);
        });


        // 2️⃣ Calcula Inspire (1 equipe = 1 entrada)
        const inspireTeams = Object.values(teamStats)
          .filter(
            (team) =>
              team.hasAE &&
              team.hasMCI &&
              team.hasThink
          )
        // 3️⃣ Cria ou remove Inspire
        if (inspireTeams.length > 0) {
          grouped["Inspire Award"] = {
            name: "Inspire Award",
            teams: inspireTeams,
          };
        } else {
          delete grouped["Inspire Award"];
        }

        groupedAwards.value = Object.values(grouped);
      } catch (error) {
        console.error("Erro ao buscar prêmios:", error.message);
      } finally {
        loader.value = false;
      }
    };

    const displayAward = (award) => {
      currentAward.value = award;
      dialog.value = true;
    };

    const openDialog = (team, award) => {
      currentTeam.value = team;
      currentAward.value = award;
      team.motive ? dialog.value = true : dialog.value = false;
    };

    const toggleNomination = async (team, award) => {
      try {
        await api.apiRequest(`awards`, {
          method: "PUT",
          body: JSON.stringify({
            id: team.Teams_idTeams,
            nominated: !team.nominated,
            award: award
          }),
        });
        team.nominated = !team.nominated;
        dialog.value = !dialog.value
      } catch (err) {
        console.error(err);
      }
    };

    const deleteAward = async (team,award ) => {
      try {
        await api.apiRequest(`awards`, {
          method: "DELETE",
          body: JSON.stringify({
            id: team.Teams_idTeams,
            award: award
          }),
        });

        const awardDeleted = groupedAwards.value.find(
          (a) => a.name === currentAward.value.name
        );

        awardDeleted.teams = awardDeleted.teams.filter(
          (t) => t.Teams_idTeams !== team.Teams_idTeams
        );

        dialog.value = false;
      } catch (err) {
        console.error(err);
      }
    };

    const positionClass = (team) => {
      if (team.premiado) return "winner";
      return "";
    };

    watch(
      () => eventStore.selectedEvent,
      (newEvent, oldEvent) => {
        if (newEvent?.value !== oldEvent?.value) fetchAwards();
      }
    );

    onMounted(fetchAwards);

    return {
      isFTC,
      loader,
      dialog,
      groupedAwards,
      currentTeam,
      currentAward,
      displayAward,
      openDialog,
      toggleNomination,
      deleteAward,
      positionClass,
      onDragEnd
    };
  },
};
</script>

<style scoped>
.card-title {
  background-color: #f7ca5f;
  display: flex;
  justify-content: space-between;
}

.award-card {
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 1rem;
}

.tile:hover {
  background: #92dbac;
}

.winner {
  background: #ffd740;
}

.alreadyAwarded {
  background: #ef9a9a;
}

.v-list-item {
  transition: background 0.2s ease;
}
</style>