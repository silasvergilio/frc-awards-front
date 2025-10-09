<template>
  <v-container fluid>
    <!-- Loader -->

    <!-- Dialog de Imagem -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card v-if="currentTeam">
        <v-card-title class="headline">{{ currentAward?.name.name }}</v-card-title>
        <v-card-subtitle class="headline">{{ `${currentTeam.text} - ${currentTeam.value}` }}</v-card-subtitle>


        <v-img v-if="currentTeam.imageLink" x :src="currentTeam.imageLink" max-height="250" />
        <v-card-text v-else>
          <b>Indicado por:</b> {{ currentTeam.judge }}<br />
          <b>Descrição:</b> {{ currentTeam.motive }}
        </v-card-text>

        <v-card-actions v-if="isAdmin" class="flex-column">
          <v-spacer />
          <v-btn v-if="currentTeam.nominated" color="#F9A825" text @click="award(false)">
            Retirar de consideração
          </v-btn>
          <v-btn v-else color="#F9A825" text @click="award(true)">
            Considerar
          </v-btn>
          <v-btn color="#F9A825" text @click="deleteAward">
            Deletar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Imagem -->
    <v-dialog v-model="dialogDescription" max-width="400px">
      <v-card>
        <v-card-title class="headline">{{ currentAward?.name.name }}</v-card-title>
        <v-card-subtitle class="headline">Descrição Resumida</v-card-subtitle>

        <v-card-text>
          {{ currentAward.name.description }}
        </v-card-text>

        <v-card-actions v-if="isAdmin" class="flex-column">
          <v-spacer />
          <v-btn v-if="currentTeam.nominated" color="#F9A825" text @click="award(false)">
            Retirar de consideração
          </v-btn>
          <v-btn v-else color="#F9A825" text @click="award(true)">
            Considerar
          </v-btn>
          <v-btn color="#F9A825" text @click="deleteAward">
            Deletar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            <th class="text-left">Prêmio</th>
            <th class="text-left">Time</th>
            <th class="text-left">Sala</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 6" :key="n">
            <td>
              <v-skeleton-loader type="text" width="80%"></v-skeleton-loader>
            </td>
            <td>
              <v-skeleton-loader type="text" width="60%"></v-skeleton-loader>
            </td>
            <td>
              <v-skeleton-loader type="text" width="40%"></v-skeleton-loader>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </template>
</v-skeleton-loader>

    <!-- Grid de prêmios -->
    <v-row dense v-else>
      <v-col v-for="(award, awardIndex) in items" :key="award.name" cols="12" sm="6" md="4" lg="3">
        <v-hover v-slot="{ isHover }">
          <v-card :elevation="isHover ? 12 : 4" class="award-card">
            <v-card-title class="card-title">
              {{ award.name.name }}
              <v-icon icon="mdi-information-outline" size="small" @click="displayAward(awardIndex)"></v-icon>
            </v-card-title>

            <v-list>
              <v-list-item v-for="(team, teamIndex) in award.teams" :key="team.value"
                @click="openDialog(team, awardIndex)" :class="[
                  team.nominated ? 'tile' : 'alreadyAwarded',
                  positionClass(awardIndex, teamIndex)
                ]">
                <v-list-item-title>
                  <b>{{ team.value }} - {{ team.text }}</b>
                </v-list-item-title>
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

export default {
  setup() {
    const loader = ref(false);
    const dialog = ref(false);
    const dialogDescription = ref(false);
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
      { "name": "Autonomous", "description": "Celebrates the team whose machine has demonstrated consistent, reliable, high-performance robot operation during autonomous (i.e. non-operated guided) actions during match play. Evaluation is based on the robot’s ability to sense its surroundings, position itself or onboard mechanisms appropriately, and execute tasks." },
      { "name": "Creativity", "description": "Celebrates a creative robotic component, concept, or attribute that enhances strategy of play that was intentionally designed and not discovered." },
      { "name": "Excellence in Engineering", "description": "Celebrates the team whose machine incorporates an engineering solution designed to have components work together seamlessly." },
      { "name": "Industrial Design", "description": "Celebrates the team whose machine demonstrates industrial design principles, striking a balance between form, function, and aesthetics. " },
      { "name": "Innovation in Control", "description": "Celebrates an innovative control system or application of control components – electrical, mechanical or software – to provide unique machine functions." },
      { "name": "Quality", "description": "Celebrates machine robustness in concept and fabrication" },
      { "name": "Engineering Inspiration", "description": "Celebrates a team who demonstrates outstanding success in advancing respect and appreciation for engineering within a team’s school or organization and community." },
      { "name": "Gracious Professionalism", "description": "Celebrates outstanding demonstration of FIRST Core Values such as continuous Gracious Professionalism®, sportsmanship, and working together both on and off the playing field." },
      { "name": "Imagery", "description": "In honor of Jack Kamen, Dean’s father, for his dedication to art and illustration and his devotion to FIRST. This award celebrates attractiveness in engineering and outstanding visual aesthetic integration of machine and team appearance." },
      { "name": "Judges", "description": "During the course of the competition, the judging panel may decide a team’s unique efforts, performance, or dynamics merit recognition." },
      { "name": "Rookie All Star", "description": "Celebrates the rookie team exemplifying a young but strong partnership effort, as well as implementing the mission of FIRST to inspire students to learn more about science and technology. ." },
      { "name": "Rising All-Star", "description": "Celebrates the team that has persisted through challenges, despite the difficulties of being young. This could be the result of being a new team, or a team with recent turnover in membership." },
      { "name": "Team Spirit", "description": "Celebrates extraordinary enthusiasm and spirit through exceptional partnership and teamwork furthering the objectives of FIRST." },
      { "name": "Sustainability", "description": "Celebrates a team which has developed sustainable practices that focus on a “triple bottom line” (i.e. People, Prosperity, and Planet) to have a positive impact and achieve long-term continuity. " }
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


    const displayAward = (aIndex) => {
      awardIndex.value = aIndex;
      dialogDescription.value = true;
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
      dialogDescription,
      openDialog,
      displayAward,
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
.card-title {
  background-color: #F7CA5F;
  display: flex;
  justify-content: space-between;
  cursor: default;
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