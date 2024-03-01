<template>
  <div id="table">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-left">Autonomous</th>
            <th class="text-left">Creativity</th>
            <th class="text-left">Excellence in Engineering</th>
            <th class="text-left">Industrial Design</th>
            <th class="text-left">Innovation in Control</th>
            <th class="text-left">Quality</th>
            <th class="text-left">Engineering Inspiration</th>
            <th class="text-left">Gracious Professionalism</th>
            <th class="text-left">Imagery</th>
            <th class="text-left">Judges</th>
            <th class="text-left">Rookie All-Star</th>
            <th class="text-left">Rookie Inspiration</th>
            <th class="text-left">Team Spirit</th>
            <th class="text-left">Team Sustainability</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in times" :key="item.value">
            <td>{{ item.text }}</td>
            <td :class="[findAward(0, item.value) ? 'blue' : '']">
              <a v-if="findAward(0, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(1, item.value) ? 'blue' : '']">
              <a v-if="findAward(1, item.value)">--------- </a>
            </td>
            <td :class="[findAward(2, item.value) ? 'blue' : '']">
              <a v-if="findAward(2, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(3, item.value) ? 'blue' : '']">
              <a v-if="findAward(3, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(4, item.value) ? 'blue' : '']">
              <a v-if="findAward(4, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(5, item.value) ? 'blue' : '']">
              <a v-if="findAward(5, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(6, item.value) ? 'blue' : '']">
              <a v-if="findAward(6, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(7, item.value) ? 'blue' : '']">
              <a v-if="findAward(7, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(8, item.value) ? 'blue' : '']">
              <a v-if="findAward(8, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(9, item.value) ? 'blue' : '']">
              <a v-if="findAward(9, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(10, item.value) ? 'blue' : '']">
              <a v-if="findAward(10, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(11, item.value) ? 'blue' : '']">
              <a v-if="findAward(11, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(12, item.value) ? 'blue' : '']">
              <a v-if="findAward(12, item.value)"> --------- </a>
            </td>
            <td :class="[findAward(13, item.value) ? 'blue' : '']">
              <a v-if="findAward(13, item.value)"> --------- </a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-btn :to="'/awards'" class="mx-4" fab dark small color="#00ACC1">
      <v-icon dark>mdi-arrow-left-thick</v-icon>
    </v-btn>

    <v-btn v-on:click="imprimir()" class="mx-4" fab dark small color="#00ACC1">
      <v-icon dark>mdi-printer</v-icon>
    </v-btn>
  </div>
</template>

<script>
import printJS from "print-js";

export default {
  data() {
    return {
      times: [],
      index: 0,
      dialog: false,
      serverDomain: window.location.host.includes("localhost")
      ? "http://localhost:3000"
      : "https://frc-awards-server-9337a2478636.herokuapp.com",
     
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
      {
        name: "Innovation in Control",
        teams: [],
        value: 5,
      },
      {
        name: "Quality",
        teams: [],
        value: 6,
      },
      {
        name: "Engineering Inspiration",
        teams: [],
        value: 7,
      },
      {
        name: "Gracious Professionalism",
        teams: [],
        value: 8,
      },
      {
        name: "Imagery",
        teams: [],
        value: 9,
      },
      {
        name: "Judges",
        teams: [],
        value: 10,
      },
      {
        name: "Rookie All-Star",
        teams: [],
        value: 11,
      },
      {
        name: "Rookie Inspiration",
        teams: [],
        value: 12,
      },
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
    };
  },
  methods: {
    findAward(numberAward, teamNumber) {
      for (var i = 0; i < this.items[numberAward].teams.length; i++) {
        if (this.items[numberAward].teams[i].value == teamNumber) return true;
      }

      return false;
    },

    imprimir: function () {
      printJS("table", "html");
    },
  },

  created() {

    fetch(`${this.serverDomain}/teams`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        this.loader = false;
        this.times = json;

        this.times.forEach( (element) => {
          element.text = `${element.text}-${element.value}`
        } )
      
      })
      .catch(() => {});

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