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
          <v-img v-if="event?.program == 'frc'" max-width="100" :src="require('./assets/logo_frc.png')" />
          <v-img v-else max-width="100" :src="require('./assets/logo_ftc.png')" />
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app :color="event?.program == 'frc' ? '#e5ae32' : '#92dbac'" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-if="event?.program == 'frc'"><v-img src="@/assets/logo_text.png" alt="FRC-Rebuilt"
          max-height="40" max-width="300" contain></v-img></v-toolbar-title>

      <v-toolbar-title v-else><v-img src="@/assets/logo_text_ftc.png" alt="FTC-Decode" max-height="40" max-width="300"
          contain></v-img></v-toolbar-title>

      <v-combobox v-model="event" :items="events" item-title="text" item-value="value" label="Selecione o evento"
        variant="solo-filled" class="combo-event"
        :bg-color="event?.program == 'frc' ? '#b3e5fc' : '#ffcc80'"></v-combobox>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
        {{ snackbarMessage }}
      </v-snackbar>
    </v-main>

    <!-- Footer -->
    <v-footer app color="#598290">
      <span class="white--text">&copy; 2026 - Silver Tech</span>
      <v-img src="@/assets/first_age_logo.png" alt="FRC-Reefscape" max-height="40" max-width="300" contain></v-img>
    </v-footer>
  </v-app>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import { useEventStore } from "@/stores/eventStore";
import { useSnackbar } from "@/composables/useSnackbar";


export default {
  setup() {
    const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
    const { snackbar, snackbarMessage, snackbarColor } = useSnackbar();

    const router = useRouter();
    const drawer = ref(false);

    // Store global de eventos
    const eventStore = useEventStore();

    if (!isAuthenticated || !user.value) {
      loginWithRedirect();
    }

    // Extrai roles e gera eventos
    const extractUserRoles = () => {
      const roles = user.value?.["https://myapp.example.com/roles"] || [];
      const isAdmin = roles.includes("admin");
      const isJudge = roles.includes("judge");
      const eventRoles = roles.filter((r) => r !== "admin" && r !== "judge");
      return { isAdmin, isJudge, eventRoles };
    };

    const { isAdmin, isJudge, eventRoles } = extractUserRoles();

    // Popula os eventos disponíveis no store global
    // Transforma "BRBA-frc" em { text: "BRBA", value: "BRBA", program: "frc" }
    const parsedEvents = eventRoles.map((role) => {
      const [eventCode, program] = role.split("-");
      return {
        text: eventCode.toUpperCase(),
        value: eventCode,
        program: program || null, // pode não ter programa em roles antigos
      };
    })

    eventStore.setAvailableEvents(parsedEvents);

    // Sincroniza combobox com store
    const event = computed({
      get: () => eventStore.selectedEvent,
      set: (val) => eventStore.setSelectedEvent(val),
    });

    // Menu dinâmico
    const menuItems = [
      { name: "Login", icon: "mdi-login", route: "/login" },
      { name: "DashBoard", icon: "mdi-view-dashboard-outline", route: "/dashboard" },
      //   { name: "Adicionar Time", icon: "mdi-shield-plus-outline", route: "/addTeam" },
      //      { name: "Adicionar Times", icon: "mdi-folder-check", route: "/addTeams" },
      { name: "Adicionar Foto", icon: "mdi-camera", route: "/adicionar-foto" },
      { name: "Lista de Times", icon: "mdi-list-box-outline", route: "/listTeams" },
      { name: "Indicar Times", icon: "mdi-file-tree", route: "/nominateTeam" },
      { name: "Times não indicados", icon: "mdi-clipboard", route: "/non-nominated" },
      { name: "Visitas", icon: "mdi-door-open", route: "/visits" },
      { name: "Indicações", icon: "mdi-trophy-award", route: "/awards" },
    ];

    const allowedMenuItems = computed(() => {
      if (!isAuthenticated.value || !user.value) {
        return menuItems.filter((item) => item.name === "Login");
      }
      if (isAdmin) {
        return menuItems.filter((item) => item.name !== "Login");
      }
      if (isJudge) {
        return menuItems.filter(
          (item) => !["Login", "Adicionar Time", "Adicionar Times"].includes(item.name)
        );
      }
      return menuItems.filter((item) => item.name !== "Login");
    });

    const doLogout = () => {
      logout({
        logoutParams: { returnTo: window.location.origin },
      });
    };

    return {
      drawer,
      allowedMenuItems,
      doLogout,
      user,
      event,
      events: eventStore.availableEvents,
      snackbar,
      snackbarMessage,
      snackbarColor,
    };
  },
};
</script>
<style scoped>
.drawer-logo {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

.combo-event {
  margin-top: 1.4rem;
}
</style>