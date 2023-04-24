import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Intro from '../views/Intro.vue';
import Profile from '../views/Profile.vue';
import Game from '../views/Game.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Intro',
		component: Intro,
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile,
	},
	{
		path: '/game',
		name: 'Game',
		component: Game,
	},
];

const router = createRouter({
	history: createWebHistory("/"),
	routes,
});

export default router;