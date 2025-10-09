<template>
  <v-container fluid>
    <!-- Loader -->
    <Loader :overlay="loader" />

    <!-- Dialog de Imagem -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card v-if="currentTeam">
        <v-card-title class="headline">{{ currentAward?.name }}</v-card-title>

        <v-img
          v-if="currentTeam.imageLink"
          :src="currentTeam.imageLink"
          max-height="250"
        />
        <v-card-text v-else>
          <b>Indicado por:</b> {{ currentTeam.judge }}<br/>
          <b>Descrição:</b> {{ currentTeam.motive }}
        </v-card-text>

        <v-card-actions v-if="isAdmin" class="flex-column">
          <v-spacer />
          <v-btn
            v-if="currentTeam.nominated"
            color="#F9A825"
            text
            @click="award(false)"
          >
            Retirar de consideração
          </v-btn>
          <v-btn
            v-else
            color="#F9A825"
            text
            @click="award(true)"
          >
            Considerar
          </v-btn>
          <v-btn color="#F9A825" text @click="deleteAward">
            Deletar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Grid de prêmios -->
    <v-row dense>
      <v-col
        v-for="(award, awardIndex) in items"
        :key="award.name"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover v-slot="{ isHover }">
          <v-card :elevation="isHover ? 12 : 4" class="award-card">
            <v-card-title class="subheading">
              {{ award.name }}
            </v-card-title>

            <v-list>
              <v-list-item
                v-for="(team, teamIndex) in award.teams"
                :key="team.value"
                @click="openDialog(team, awardIndex)"
                :class="[
                  team.nominated ? 'tile' : 'alreadyAwarded',
                  positionClass(awardIndex, teamIndex)
                ]"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <b>{{ team.value }} - {{ team.text }}</b>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Loader from "./Loader.vue";

export default {
  components: { Loader },
  setup() {
    const loader = ref(false);
    const dialog = ref(false);
    const items = ref([]);
    const index = ref(0);
    const awardIndex = ref(0);

    const serverDomain = process.env.VUE_APP_SERVER_DOMAIN;
    const user = ref(JSON.parse(localStorage.getItem("vuex"))?.user || {});
    const isAdmin = computed(() => user.value?.permission === "Administrador");

    const currentAward = computed(() => items.value[awardIndex.value]);
    const currentTeam = computed(() => currentAward.value?.teams[index.value]);

    const awardUrls = {
      1: "Autonomous",
      2: "Creativity",
      3: "ExcellenceEngineering",
      4: "IndustrialDesign",
      5: "InnovationControl",
      6: "Quality",
      7: "EngineeringInspiration",
      8: "Gracious",
      9: "Imagery",
      10: "Judges",
      11: "Ras",
      12: "RookieInspiration",
      13: "TeamSpirit",
      14: "TeamSustainability",
    };

    const awardsList = [
      "Destaque em Autônomo",
      "Criatividade",
      "Destaque em Engenharia",
      "Destaque em Design",
      "Destaque em Controle",
      "Destaque em Qualidade",
      "SESI de Inspiração para Engenharia",
      "Gracious Professionalism",
      "Imagery",
      "Jurados",
      "Equipe Iniciante Destaque",
      "Rising All-Star",
      "Team Spirit",
      "Equipe Sustentável",
    ];

    const fetchAwards = async () => {
      loader.value = true;
      try {
        const fetches = awardsList.map((name, i) =>
          fetch(`${serverDomain}/awards/${awardUrls[i + 1]}`)
            .then(res => res.json())
            .then(json => ({ name, teams: json, value: i + 1 }))
        );
        items.value = await Promise.all(fetches);
      } catch (err) {
        console.error(err);
      } finally {
        loader.value = false;
      }
    };

    const openDialog = (team, aIndex) => {
      awardIndex.value = aIndex;
      index.value = items.value[aIndex].teams.findIndex(t => t.value === team.value);
      dialog.value = true;
    };

    const positionClass = (aIndex, tIndex) => {
      const team = items.value[aIndex].teams[tIndex];
      if (team.premiado) return "winner";
      return "";
    };

    const award = async (intention) => {
      loader.value = true;
      const team = currentTeam.value;
      const url = `${serverDomain}/awards/${awardUrls[currentAward.value.value]}`;

      try {
        await fetch(url, {
          method: "PUT",
          body: JSON.stringify({ nominated: intention, id: team.Teams_idTime }),
          headers: { "Content-Type": "application/json" },
        });
        team.nominated = intention;
      } catch (err) {
        console.error(err);
      } finally {
        loader.value = false;
        dialog.value = false;
      }
    };

    const deleteAward = async () => {
      loader.value = true;
      const team = currentTeam.value;
      const url = `${serverDomain}/awards/${awardUrls[currentAward.value.value]}`;

      try {
        await fetch(url, {
          method: "DELETE",
          body: JSON.stringify({ id: team.Teams_idTime }),
          headers: { "Content-Type": "application/json" },
        });
        items.value[awardIndex.value].teams.splice(index.value, 1);
      } catch (err) {
        console.error(err);
      } finally {
        loader.value = false;
        dialog.value = false;
      }
    };

    onMounted(fetchAwards);

    return {
      items,
      dialog,
      loader,
      index,
      awardIndex,
      openDialog,
      currentTeam,
      currentAward,
      isAdmin,
      award,
      deleteAward,
      positionClass,
    };
  },
};
</script>

<style scoped>
.award-card {
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 1rem;
}

.tile:hover {
  background: #c8e9f5;
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