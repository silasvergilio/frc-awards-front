<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      hide-default-footer
    >
      <Loader v-bind:overlay="loader"> </Loader>

      <!--Dialog de Confirmação -->

      <v-dialog v-if="dialog" v-model="dialog" max-width="350px">
        <v-card>
          <v-card-title class="headline">
            {{ items[awardIndex].name }}
          </v-card-title>

          <v-img
            v-if="items[awardIndex].teams[index].imageLink"
            :src="items[awardIndex].teams[index].imageLink"
          />

          <v-card-text v-if="items[0].teams[0]">
            <b>Indicado por:</b> {{ items[awardIndex].teams[index].judge }}
            <br />
            <b> Descrição </b>
            {{ items[awardIndex].teams[index].motive }}
          </v-card-text>
          <v-card-actions
            v-if="this.$store.state.user.permission == 'Administrador'"
            style="display: flex; flex-direction: column"
          >
            <v-spacer></v-spacer>

            <v-btn
              v-if="items[awardIndex].teams[index].nominated"
              color="#F9A825"
              text
              @click="
                dialog = false;
                award(false);
              "
            >
              Retirar de consideração
            </v-btn>

            <v-btn
              v-if="!items[awardIndex].teams[index].nominated"
              color="#F9A825"
              text
              @click="
                dialog = false;
                award(true);
              "
            >
              Considerar
            </v-btn>
            <br />
            <v-btn
              v-if="this.$store.state.user.permission == 'Administrador'"
              color="#F9A825"
              text
              @click="
                dialog = false;
                deleteAward();
              "
            >
              Deletar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--Dialog de Confirmação -->

      <template>
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            style="max-width: 100%"
          >
            <v-card>
              <v-card-title class="subheading">{{ item.name }}</v-card-title>

              <v-list>
                <v-list-item
                  color="primary"
                  v-for="team in item.teams"
                  v-bind:key="team.id"
                  v-on:click="
                    dialog = true;
                    changeIndex(team.value, item.name);
                  "
                  :class="[team.nominated ? 'tile' : 'alreadyAwarded']"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <b> {{ team.value }} - {{ team.text }} </b>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <v-btn
        :to="'/callback'"
        class="mx-4"
        style="margin-top: 2.5rem"
        fab
        dark
        large
        color="teal darken-3"
      >
        <v-icon dark>mdi-google-spreadsheet</v-icon>
      </v-btn>
    </v-data-iterator>
  </v-container>
</template>

<script>
//import draggable from "vuedraggable";
import Loader from "./Loader.vue";

export default {
  components: {
    //  draggable,
    Loader,
  },

  computed: {
    srcComputed() {
      /* eslint-disable*/
      let index = this.index;
      try {
        return require("../assets/fotos_times/" +
          this.times[index].value +
          ".jpg");
      } catch {
        return require("../assets/fotos_times/standard.png");
      }
    },
  },

  data: () => ({
    awardReqCount: 0,
    awardCount: 0,
    orderReqCount: 0,
    itemsPerPage: 5,
    loader: false,
    serverDomain: window.location.host.includes("localhost")
      ? "http://localhost:3000"
      : "https://frc-awards-server-9337a2478636.herokuapp.com",
    dialog: false,

    index: 0,
    awardIndex: 0,

    items: [
      {
        name: "Autonomous",
        teams: [],
        value: 1,
      },
      {
        name: "Creativity",
        teams: [],
        value: 2,
      },
      {
        name: "Excellence in Engineering",
        teams: [],
        value: 3,
      },
      {
        name: "Industrial Design",
        teams: [],
        value: 4,
      },
      // {
      //   name: "Innovation in Control",
      //   teams: [],
      //   value: 5,
      // },
      // {
      //   name: "Quality",
      //   teams: [],
      //   value: 6,
      // },
      {
        name: "Engineering Inspiration",
        teams: [],
        value: 7,
      },
      // {
      //   name: "Gracious Professionalism",
      //   teams: [],
      //   value: 8,
      // },
      // {
      //   name: "Imagery",
      //   teams: [],
      //   value: 9,
      // },
      // {
      //   name: "Judges",
      //   teams: [],
      //   value: 10,
      // },
      {
        name: "Rookie All-Star",
        teams: [],
        value: 11,
      },
      // {
      //   name: "Rookie Inspiration",
      //   teams: [],
      //   value: 12,
      // },
      {
        name: "Team Spirit",
        teams: [],
        value: 13,
      },
      {
        name: "Team Sustainability",
        teams: [],
        value: 14,
      },
    ],
  }),
  methods: {
    say: function (msg) {
      alert(msg);
    },

    imgError(awardIndex, index) {
      this.items[awardIndex].teams[index].imageLoad = false;
    },

    deleteAward() {
      this.loader = true;
      let requisicao = {
        id: this.items[this.awardIndex].teams[this.index].Teams_idTime,
      };

      var url = "";
      switch (this.items[this.awardIndex].value) {
        case 1:
          url = `${this.serverDomain}/awards/Autonomous`;
          break;
        case 2:
          url = `${this.serverDomain}/awards/Creativity`;
          break;
        case 3:
          url = `${this.serverDomain}/awards/ExcellenceEngineering`;
          break;
        case 4:
          url = `${this.serverDomain}/awards/IndustrialDesign`;
          break;
        case 5:
          url = `${this.serverDomain}/awards/InnovationControl`;
          break;
        case 6:
          url = `${this.serverDomain}/awards/Quality`;
          break;
        case 7:
          url = `${this.serverDomain}/awards/EngineeringInspiration`;
          break;
        case 8:
          url = `${this.serverDomain}/awards/Gracious`;
          break;
        case 9:
          url = `${this.serverDomain}/awards/Imagery`;
          break;
        case 10:
          url = `${this.serverDomain}/awards/Judges`;
          break;
        case 11:
          url = `${this.serverDomain}/awards/Ras`;
          break;
        case 12:
          url = `${this.serverDomain}/awards/RookieInspiration`;
          break;
        case 13:
          url = `${this.serverDomain}/awards/TeamSpirit`;
          break;
        case 14:
          url = `${this.serverDomain}/awards/TeamSustainability`;
          break;
      }

      fetch(url, {
        method: "DELETE",
        body: JSON.stringify(requisicao),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        this.loader = false;
        this.items[this.awardIndex].teams.splice(this.index, 1)
       // location.reload();
      });
    },

    alreadyAwarded(teamValue, awardIndex) {
      for (var i = 0; i < this.items.length; i++) {
        if (i == awardIndex) continue;
        for (var k = 0; k < this.items[i].teams.length; k++) {
          if (
            this.items[i].teams[k].value == teamValue &&
            this.items[i].teams[k].premiado
          )
            return true;
        }
      }
      return false;
    },

    positionClass: function (award, index) {
      for (var k = 0; k < index; k++) {
        if (this.items[award].teams[k].premiado) return "secondPlace";
      }

      return "winner";
    },

    updateAndSave: function () {
      this.loader = true;
      for (let i = 0; i < this.items.length; i++) {
        for (let k = 0; k < this.items[i].teams.length; k++) {
          this.awardCount++;
          this.position(i, k);
        }
      }
    },

    changeIndex: function (newTeam, newAward) {
      for (let i = 0; i < this.items.length; i++) {
        if (newAward == this.items[i].name) this.awardIndex = i;
      }

      for (let k = 0; k < this.items[this.awardIndex].teams.length; k++) {
        if (newTeam == this.items[this.awardIndex].teams[k].value)
          this.index = k;
      }
    },

    position: function (awardIndex, teamIndex) {
      var requisicao = {
        position: teamIndex,
        id: this.items[awardIndex].teams[teamIndex].Teams_idTime,
      };
      var uri = "";

      switch (this.items[awardIndex].value) {
        case 1:
          url = `${this.serverDomain}/awards/Autonomous`;
          break;
        case 2:
          url = `${this.serverDomain}/awards/Creativity`;
          break;
        case 3:
          url = `${this.serverDomain}/awards/ExcellenceEngineering`;
          break;
        case 4:
          url = `${this.serverDomain}/awards/IndustrialDesign`;
          break;
        case 5:
          url = `${this.serverDomain}/awards/InnovationControl`;
          break;
        case 6:
          url = `${this.serverDomain}/awards/Quality`;
          break;
        case 7:
          url = `${this.serverDomain}/awards/EngineeringInspiration`;
          break;
        case 8:
          url = `${this.serverDomain}/awards/Gracious`;
          break;
        case 9:
          url = `${this.serverDomain}/awards/Imagery`;
          break;
        case 10:
          url = `${this.serverDomain}/awards/Judges`;
          break;
        case 11:
          url = `${this.serverDomain}/awards/Ras`;
          break;
        case 12:
          url = `${this.serverDomain}/awards/RookieInspiration`;
          break;
        case 13:
          url = `${this.serverDomain}/awards/TeamSpirit`;
          break;
        case 14:
          url = `${this.serverDomain}/awards/TeamSustainability`;
          break;
      }

      fetch(uri, {
        method: "PUT",
        body: JSON.stringify(requisicao),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        this.orderReqCount++;
        if (this.orderReqCount == this.awardCount) this.loader = false;
      });
    },

    award: function (intention) {
      this.loader = true;

      if (intention) {
        for (let j = 0; j < this.items[this.awardIndex].teams.length; j++) {
          if (this.items[this.awardIndex].teams[j].premiado) allowAward = true;
        }
      }

      var requisicao = {
        nominated: intention,
        id: this.items[this.awardIndex].teams[this.index].Teams_idTime,
      };
      /* eslint-disable*/
      var url = "";

      switch (this.items[this.awardIndex].value) {
        case 1:
          url = `${this.serverDomain}/awards/Autonomous`;
          break;
        case 2:
          url = `${this.serverDomain}/awards/Creativity`;
          break;
        case 3:
          url = `${this.serverDomain}/awards/ExcellenceEngineering`;
          break;
        case 4:
          url = `${this.serverDomain}/awards/IndustrialDesign`;
          break;
        case 5:
          url = `${this.serverDomain}/awards/InnovationControl`;
          break;
        case 6:
          url = `${this.serverDomain}/awards/Quality`;
          break;
        case 7:
          url = `${this.serverDomain}/awards/EngineeringInspiration`;
          break;
        case 8:
          url = `${this.serverDomain}/awards/Gracious`;
          break;
        case 9:
          url = `${this.serverDomain}/awards/Imagery`;
          break;
        case 10:
          url = `${this.serverDomain}/awards/Judges`;
          break;
        case 11:
          url = `${this.serverDomain}/awards/Ras`;
          break;
        case 12:
          url = `${this.serverDomain}/awards/RookieInspiration`;
          break;
        case 13:
          url = `${this.serverDomain}/awards/TeamSpirit`;
          break;
        case 14:
          url = `${this.serverDomain}/awards/TeamSustainability`;
          break;
      }

      fetch(url, {
        method: "PUT",
        body: JSON.stringify(requisicao),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        this.loader = false;
        this.items[this.awardIndex].teams[this.index].nominated = intention;
        // location.reload();
      });
    },
  },
  created() {
    this.loader = true;
    fetch(`${this.serverDomain}/awards/Autonomous`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[0].teams = json;
      });

    fetch(`${this.serverDomain}/awards/Creativity`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;

        this.items[1].teams = json;
      });

    fetch(`${this.serverDomain}/awards/ExcellenceEngineering`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;

        this.items[2].teams = json;
      });

    fetch(`${this.serverDomain}/awards/IndustrialDesign`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;

        this.items[3].teams = json;
      });

    fetch(`${this.serverDomain}/awards/InnovationControl`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;

        this.items[4].teams = json;
      });
    fetch(`${this.serverDomain}/awards/Quality`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[5].teams = json;
      });
    fetch(`${this.serverDomain}/awards/EngineeringInspiration`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[6].teams = json;
      });
    fetch(`${this.serverDomain}/awards/Gracious`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[7].teams = json;
      });
    fetch(`${this.serverDomain}/awards/Imagery`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[8].teams = json;
      });
    fetch(`${this.serverDomain}/awards/Judges`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[9].teams = json;
      });
    fetch(`${this.serverDomain}/awards/Ras`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[10].teams = json;
      });
    fetch(`${this.serverDomain}/awards/RookieInspiration`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[11].teams = json;
      });
    fetch(`${this.serverDomain}/awards/TeamSpirit`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[12].teams = json;
      });
    fetch(`${this.serverDomain}/awards/TeamSustainability`)
      .then((response) => response.json())
      .then((json) => {
        this.awardReqCount++;
        if (this.awardReqCount >= 14) this.loader = false;
        this.items[13].teams = json;
      });
  },
};
</script>

<style scoped>
.tile:hover {
  background: #c8e9f5;
}

.winner {
  background: #ffd740;
}

.secondPlace {
  background: #448aff;
}

.alreadyAwarded {
  background: #ef9a9a;
}
</style>
