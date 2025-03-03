<template>
  <div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-img v-if="this.times.length > 0" :src="srcComputed" />
      </v-card>
    </v-dialog>
    <!--Dialog de Confirmação -->

    <Loader v-bind:overlay="loader"> </Loader>

    <CardTitlePage
    class="card-title"
      titulo="Times não nomeados"
      icon="mdi-clipboard"
      body="Estes são times que não foram nomeados a nenhum prêmio, mas recomenda-se que sejam visitados."
    >
    </CardTitlePage>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-left">Número</th>
            <th class="text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in times"
            :key="item.value"
            v-on:click="
              dialog = true;
              changeIndex(item.value);
            "
          >
            <td>{{ item.text }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.state }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<style scoped>
.card-title{
    margin-top: 2rem;
    margin-bottom: 2rem;
}
</style>

<script>
import CardTitlePage from "./CardTitlePage";
import Loader from "./Loader.vue";

export default {
  data() {
    return {
      times: [],
      index: 0,
      dialog: false,
      loader: false,
      serverDomain: window.location.host.includes("localhost")
        ? "http://localhost:3000"
        : process.env.SERVER_DOMAIN,
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
        return require("../assets/fotos_times/standard.webp");
      }
    },
  },
  components: {
    Loader,
    CardTitlePage,
  },
  methods: {
    imageError: function() {
      /* eslint-disable*/
      console.log("image not working");
    },
    changeIndex: function(newTeam) {
      this.$store.commit("increment");

      for (let k = 0; k < this.times.length; k++) {
        if (newTeam == this.times[k].value) this.index = k;
      }
    },
  },

  created() {
    this.loader = true;
    fetch(`${this.serverDomain}/awards/non-nominated/teams`, {
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
