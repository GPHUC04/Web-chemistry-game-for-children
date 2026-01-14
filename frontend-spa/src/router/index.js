import { createRouter, createWebHistory } from "vue-router";
import Profile from '@/view/Profile.vue'
import ChemistryGame from "../components/ChemistryGame.vue";
import GamePlay from "../view/GamePlay.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/game",
    name: "GamePlay",
    component: GamePlay,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
