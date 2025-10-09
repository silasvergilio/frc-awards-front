<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="menuItem in allowedMenuItems"
          :key="menuItem.id"
          :to="menuItem.route"
        >
        <template v-slot:prepend>
          <v-icon :icon="menuItem.icon"></v-icon>
        </template>
          <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="user" @click="logout">
          <template v-slot:prepend>
          <v-icon icon= 'mdi-logout'></v-icon>
        </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>

        <div class="drawer-logo">
          <v-img max-width="100" :src="require('./assets/logo.png.webp')" />
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app color="#0083AE" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title><v-img
      src="@/assets/logo_text.png"
      alt="FRC-Reefscape"
      max-height="40"
      max-width="300"
      contain
    ></v-img></v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user" class="font-weight-bold">{{ user.fullName }}</div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
      <Loader :overlay="loader" />
    </v-main>

    <!-- Footer -->
    <v-footer app color="#ABD8E7">
      <span class="white--text">&copy; 2025 - Silver Tech</span>
    </v-footer>
  </v-app>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const drawer = ref(false);
    const store = useStore();
    const router = useRouter();
    const loader = ref(true);


    const user = computed(() => store.state.user);

    const menuItems = [
      { name: "Login", icon: "mdi-login", route: "/login", permission: [""] },
      { name: "Adicionar Usuário", icon: "mdi-account-multiple-plus", route: "/adduser", permission: ["Administrador"] },
      { name: "Adicionar Time", icon: "mdi-shield-plus-outline", route: "/addTeam", permission: ["Administrador"] },
      { name: "Adicionar Times", icon: "mdi-folder-check", route: "/addTeams", permission: ["Administrador","Juiz de Sala"] },
      { name: "Adicionar Foto", icon: "mdi-camera", route: "/adicionar-foto", permission: ["Administrador","Juiz de Sala"] },
      { name: "Lista de Times", icon: "mdi-list-box-outline", route: "/listTeams", permission: ["Administrador","Juiz de Sala"] },
      { name: "Indicar Times", icon: "mdi-file-tree", route: "/nominateTeam", permission: ["Administrador","Juiz de Sala"] },
      { name: "Times não indicados", icon: "mdi-clipboard", route: "/non-nominated", permission: ["Administrador","Juiz de Sala"] },
      { name: "Visitas", icon: "mdi-door-open", route: "/visits", permission: ["Administrador","Juiz de Sala"] },
      { name: "Indicações", icon: "mdi-trophy-award", route: "/awards", permission: ["Administrador","Juiz de Sala"] },
    ];

    const allowedMenuItems = computed(() => {
      if (!user.value) {
        return menuItems.filter(item => item.name === "Login" || item.name === "Adicionar Usuário");
      }
      return menuItems.filter(item => item.permission.includes(user.value.permission));
    });

    const logout = () => {
      store.commit("updateUser", null);
      router.push("/login");
    };

    return { drawer, allowedMenuItems, logout, user, loader };
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