<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="menuItem in allowedMenuItems" :key="menuItem.id" :to="menuItem.route">
          <template v-slot:prepend>
            <v-icon :icon="menuItem.icon" color="#C38C26"></v-icon>
          </template>
          <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="user" @click="doLogout">
          <template v-slot:prepend>
            <v-icon icon='mdi-logout' color="red"></v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>

        <div class="drawer-logo">
          <v-img max-width="100" :src="require('./assets/logo.png')" />
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app color="#e5ae32" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title><v-img src="@/assets/logo_text.png" alt="FRC-Reefscape" max-height="40" max-width="300"
          contain></v-img></v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user" class="font-weight-bold">{{ user.fullName }}</div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
      <Loader :overlay="loader" />
    </v-main>

    <!-- Footer -->
    <v-footer app color="#598290">
      <span class="white--text">&copy; 2026 - Silver Tech</span>
      <v-img src="@/assets/first_age_logo.png" alt="FRC-Reefscape" max-height="40" max-width="300" contain></v-img>
    </v-footer>
  </v-app>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useAuth0 } from '@auth0/auth0-vue';


export default {


  setup() {
    const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
    const drawer = ref(false);
    const store = useStore();
    const router = useRouter();
    const loader = ref(true);

    if (!isAuthenticated || !user.value) {
      console.log("Not logged")
      loginWithRedirect();
    }

    else {
      console.log("user", user.value?.["https://myapp.example.com/roles"].includes("judge"))
    }




    const menuItems = [
      { name: "Login", icon: "mdi-login", route: "/login" },
      { name: "Adicionar Time", icon: "mdi-shield-plus-outline", route: "/addTeam" },
      { name: "Adicionar Times", icon: "mdi-folder-check", route: "/addTeams" },
      { name: "Adicionar Foto", icon: "mdi-camera", route: "/adicionar-foto" },
      { name: "Lista de Times", icon: "mdi-list-box-outline", route: "/listTeams" },
      { name: "Indicar Times", icon: "mdi-file-tree", route: "/nominateTeam" },
      { name: "Times não indicados", icon: "mdi-clipboard", route: "/non-nominated" },
      { name: "Visitas", icon: "mdi-door-open", route: "/visits" },
      { name: "Indicações", icon: "mdi-trophy-award", route: "/awards" },
    ];

    const allowedMenuItems = computed(() => {
      const role = user.value?.["https://myapp.example.com/roles"] // ou o caminho onde sua role vem do Auth0

      // Usuário não logado → apenas "Login"
      if (!role) {
        return menuItems.filter(item => item.name === "Login");
      }

      // Admin → vê tudo (menos Login)
      if (role.includes("admin")) {
        return menuItems.filter(item => item.name !== "Login");
      }

      // Juiz → vê tudo menos Adicionar Time(s) e Login
      if (role.include("judge")) {
        return menuItems.filter(
          item => !["Login", "Adicionar Time", "Adicionar Times"].includes(item.name)
        );
      }

      // Caso outras roles apareçam no futuro → remove Login por padrão
      return menuItems.filter(item => item.name !== "Login");
    });

    const doLogout = () => {
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    };

    return { drawer, allowedMenuItems, doLogout, user, loader };
  },
};
</script>

<style scoped>
.drawer-logo {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}
</style>