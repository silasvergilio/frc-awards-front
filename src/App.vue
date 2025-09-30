<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item
          v-for="menuItem in this.allowedMenuItems"
          v-bind:key="menuItem.id"
          :to="menuItem.route"
        >
          <v-list-item-action>
            <v-icon>{{ menuItem.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="this.$store.state.user" @click="logout()">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: center;
            padding-top: 10rem;
          "
        >
          <v-img style="max-width: 50%" :src="require('./assets/logo.png.webp')" />
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#0083AE" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>FRC - Reefscape</v-toolbar-title>

      <v-spacer></v-spacer>
      <p v-if="this.$store.state.user" class="font-weight-bold">
        {{ this.$store.state.user.fullName }}
      </p>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="#ABD8E7" app>
      <span class="white--text">&copy; 2025 - Silver Tech</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.user-title {
  margin-left: 50rem;
}
</style>
<script>
export default {
  props: {
    source: String,
  },

  methods: {
    logout() {
      this.$router.push("/login");
      this.$store.commit("updateUser", null);
    },
  },

  data: () => ({
    user: null,
    drawer: null,
    menuItens: [
      {
        name: "Login",
        icon: "mdi-login",
        route: "/login",
        permission: [""],
      },
      {
        name: "Adicionar Usuário",
        icon: "mdi-account-multiple-plus",
        route: "/adduser",
        permission: ["Administrador"],
      },
      {
        name: "Adicionar Time",
        icon: "mdi-shield-plus-outline",
        route: "/addTeam",
        permission: ["Administrador"],
      },
      {
        name: "Adicionar Times",
        icon: "mdi-folder-check",
        route: "/addTeams",
        permission: ["Administrador", "Juiz de Sala"],
      },
      {
        name: "Adicionar Foto",
        icon: "mdi-camera",
        route: "/adicionar-foto",
        permission: ["Administrador", "Juiz de Sala"],
      },
      {
        name: "Lista de Times",
        icon: "mdi-account-badge-horizontal-outline",
        route: "/listTeams",
        permission: ["Administrador", "Juiz de Sala"],
      },

      {
        name: "Indicar Times",
        icon: "mdi-file-tree",
        route: "/nominateTeam",
        permission: ["Administrador", "Juiz de Sala"],
      },
      {
        name: "Times não indicados",
        icon: "mdi-clipboard",
        route: "/non-nominated",
        permission: ["Administrador", "Juiz de Sala"],
      },
      {
        name: "Visitas",
        icon: "mdi-door-open",
        route: "/visits",
        permission: ["Administrador", "Juiz de Sala"],
      },
      {
        name: "Indicações",
        icon: "mdi-trophy-award",
        route: "/awards",
        permission: ["Administrador", "Juiz de Sala"],
      },
    ],
  }),

  components: {},
  computed: {
    allowedMenuItems() {
      var allowedMenuItems = [];
      if (!this.$store.state.user) {
        if (this.menuItens.indexOf(this.menuItens[0] === -1))
          allowedMenuItems.push(this.menuItens[0]);
          allowedMenuItems.push(this.menuItens[1]);
      }
      this.menuItens.forEach((menuItem) => {
        if (this.$store.state.user) {
          if (menuItem.permission.includes(this.$store.state.user.permission)) {
            allowedMenuItems.push(menuItem);
          }
        }
      });
      return allowedMenuItems;
    },
  },
};
</script>
