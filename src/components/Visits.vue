<template>
  <div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-img v-if="this.times.length > 0" :src="srcComputed" />
      </v-card>
    </v-dialog>
    <!--Dialog de Confirmação -->

    <Loader v-bind:overlay="loader"> </Loader>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-left">Número</th>
            <th>Visita MCI</th>
            <th>Visita TA</th>
            <th>Visita Extra</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in times" :key="item.value">
            <td>{{ item.text }}</td>
            <td>{{ item.value }}</td>
            <td>
              <v-checkbox
                v-on:click="visitChange(item,'visitedMCI')"
                v-model="item.visitedMCI"
              ></v-checkbox>
            </td>
            <td>
              <v-checkbox
                v-on:click="visitChange(item,'visitedTA')"
                v-model="item.visitedTA"
              ></v-checkbox>
            </td>
            <td>
              <v-checkbox
                v-on:click="visitChange(item,'visitedExtra')"
                v-model="item.visitedExtra"
              ></v-checkbox>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Loader from "./Loader.vue";

export default {
  data() {
    return {
      visited: false,
      times: [],
      index: 0,
      dialog: false,
      loader: false,
      serverDomain: window.location.host.includes("localhost")
        ? "http://localhost:3000"
        : "https://frc-awards-server-9337a2478636.herokuapp.com",
    };
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
  components: {
    Loader,
  },
  methods: {
    visitChange: function (item, visitType) {
      this.loader = true;
      var requisicao = {
        visit: visitType,
        newValue: item.visitedMCI,
      };

      fetch(`${this.serverDomain}/teams/${item.value}`, {
        method: "PUT",
        body: JSON.stringify(requisicao),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
       this.loader = false;
      }).catch( (err) =>{
        this.loader = false;
      } );
    },

    imageError: function () {
      /* eslint-disable*/
      console.log("image not working");
    },
    changeIndex: function (newTeam) {
      this.$store.commit("increment");

      for (let k = 0; k < this.times.length; k++) {
        if (newTeam == this.times[k].value) this.index = k;
      }
    },
  },

  created() {
    this.loader = true;
    fetch(`${this.serverDomain}/teams`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        this.loader = false;
        this.times = json;
      })
      .catch(() => {});
  },
};
</script>
