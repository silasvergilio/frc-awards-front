import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader

import Awards from "./components/Awards";
import AddTeam from "./components/AddTeam";
import nominateTeam from "./components/NominateTeam";
import listTeams from "./components/ListTeams";
import Home from "./components/Home";
import Callback from "./components/CallBack";
import AddUser from "./components/AddUser";
import Login from "./components/Login";
import BulkAddTeam from "./components/BulkAddTeam";
import NonNominated from "./components/NonNominated";
import Visits from './components/Visits'
import AddPicture from './components/AddPicture'

import VueMask from "v-mask";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);
Vue.use(VueMask);
Vue.use(VueRouter);
Vue.use(vuetify, {
  iconfont: "mdi",
});

Vue.config.productionTip = false;

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

const store = new Vuex.Store({
  state: {
    user: null,
  },

  mutations: {
    updateUser(state, newUserState) {
      state.user = newUserState;
    },
  },
  plugins: [vuexLocal.plugin],
});

const router = new VueRouter({
  base: __dirname,
  routes: [
    {
      name: "Login",
      path: "/login",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: '/visits',
      component: Visits,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/non-nominated",
      component: NonNominated,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/addTeams",
      component: BulkAddTeam,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/awards",
      component: Awards,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/addTeam",
      component: AddTeam,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/nominateteam",
      component: nominateTeam,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/listTeams",
      component: listTeams,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/adicionar-foto",
      component: AddPicture,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/callback",
      component: Callback,
      beforeEnter: (to, from, next) => {
        if (!store.state.user) next("/login");
        else next();
      },
    },
    {
      path: "/adduser",
      component: AddUser,
    },
    {
      path: "*",
      redirect: "/login",
    },
  ],
});

// /* eslint-disable*/
// router.beforeEach((to, from, next) => {
//   if (from.name !== '/login' && !store.state.user) next('/login')
//   else next('/');
// })

new Vue({
  vuetify,
  router,
  store,

  render: (h) => h(App),
}).$mount("#app");
