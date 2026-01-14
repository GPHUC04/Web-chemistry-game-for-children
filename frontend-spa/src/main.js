import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Login from "./view/Login.vue";
import Home from "./view/Home.vue";
import HomePage from "./view/HomePage.vue";
import Games from "./view/Games.vue";
import ChemistryChef from "./view/games/ChemistryChef.vue";
import ChainReaction from "./view/games/ChainReaction.vue";
import ChemCrossword from "./view/games/ChemCrossword.vue";
import FormulaDetective from "./view/games/FormulaDetective.vue";
import Leaderboard from "./view/leaderboard.vue";
import Learn from "./view/Learn.vue";
import Experiments from "./view/experiments.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import Profile from "./view/Profile.vue";
import Admin from "./view/Admin.vue";

import GameAdmin from "./view/GameAdmin.vue";
import ElementAdmin from "./view/ElementAdmin.vue";
import CompoundAdmin from "./view/CompoundAdmin.vue";
import ReactionAdmin from "./view/ReactionAdmin.vue";
import CrosswordAdmin from "./view/CrosswordAdmin.vue";
import SessionAdmin from "./view/SessionAdmin.vue";

const routes = [
  {
    path: "/login",
    component: Login,
    name: "Login",
  },
  {
    path: "/homepage",
    component: HomePage,
    name: "HomePage",
  },
  {
    path: "/games",
    component: Games,
    name: "Games",
  },
  {
    path: "/",
    component: Home,
    name: "Home",
  },

  {
    path: "/game/master_chef",
    name: "master_chef",
    component: ChemistryChef,
  },
  {
    path: "/game/chain_reaction",
    name: "chain_reaction",
    component: ChainReaction,
  },
  {
    path: "/game/chem_crossword",
    name: "chem_crossword",
    component: ChemCrossword,
  },
  {
    path: "/game/formula_detective",
    name: "formula_detective",
    component: FormulaDetective,
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: Leaderboard,
  },
  {
    path: "/learn",
    name: "learn",
    component: Learn,
  },
  {
    path: "/experiments",
    name: "experiments",
    component: Experiments,
  },
  {
    path: "/profile",
    name: "ProfileView",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
  },
  {
    path: "/admin/games",
    name: "adminGames",
    component: GameAdmin,
  },
  {
    path: "/admin/elements",
    name: "adminElements",
    component: ElementAdmin,
  },
  {
    path: "/admin/compounds",
    name: "adminCompounds",
    component: CompoundAdmin,
  },
  {
    path: "/admin/reactions",
    name: "adminReactions",
    component: ReactionAdmin,
  },
  {
    path: "/admin/crosswords",
    name: "adminCrosswords",
    component: CrosswordAdmin,
  },
  {
    path: "/admin/sessions",
    name: "adminSessions",
    component: SessionAdmin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const app = createApp(App);
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 2, // Thử lại 2 lần nếu request thất bại
        staleTime: 1000 * 60 * 5, // Dữ liệu được coi là "fresh" trong 5 phút
        cacheTime: 1000 * 60 * 10, // Cache dữ liệu trong 10 phút
      },
    },
  },
});

createApp(App).use(router).mount("#app");
