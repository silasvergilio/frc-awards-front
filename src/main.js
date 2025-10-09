// main.js (Vue 3)
import { createApp } from 'vue'
import App from './App.vue'


// Vuetify 3
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import "./plugins/validation"; // importa a config que criamos ✅

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})


// Estilos de ícones
import '@mdi/font/css/materialdesignicons.css'

// Vue Router 4
import { createRouter, createWebHistory } from 'vue-router'

// Vuex 4
import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

// Plugins adicionais
import VueTheMask from "vue-the-mask";

// Componentes
import Awards from './components/Awards.vue'
import AddTeam from './components/AddTeam.vue'
import NominateTeam from './components/NominateTeam.vue'
import ListTeams from './components/ListTeams.vue'
import Home from './components/Home.vue'
import Callback from './components/CallBack.vue'
import AddUser from './components/AddUser.vue'
import Login from './components/Login.vue'
import BulkAddTeam from './components/BulkAddTeam.vue'
import NonNominated from './components/NonNominated.vue'
import Visits from './components/Visits.vue'
import AddPicture from './components/AddPicture.vue'

// ---------- Vuex ----------
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    updateUser(state, newUserState) {
      state.user = newUserState
    },
  },
  plugins: [vuexLocal.plugin],
})

// ---------- Router ----------
const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', component: Home },
  { path: '/visits', component: Visits },
  { path: '/non-nominated', component: NonNominated },
  { path: '/addTeams', component: BulkAddTeam },
  { path: '/awards', component: Awards },
  { path: '/addTeam', component: AddTeam },
  { path: '/nominateteam', component: NominateTeam },
  { path: '/listTeams', component: ListTeams },
  { path: '/adicionar-foto', component: AddPicture },
  { path: '/callback', component: Callback },
  { path: '/adduser', component: AddUser },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Middleware de rota (login obrigatório)
router.beforeEach((to, from, next) => {
  const requiresAuth = !['Login', 'AddUser'].includes(to.name)
  if (requiresAuth && !store.state.user) next('/login')
  else next()
})


// ---------- App ----------
const app = createApp(App)

app.use(VueTheMask);
app.use(router)
app.use(store)
app.use(vuetify)

app.mount('#app')