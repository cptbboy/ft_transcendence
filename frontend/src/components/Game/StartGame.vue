<template>
	<div class="startgame">
		<div class="slideshow" :class="{ blur: showCount }">
			<div :class="['block-style', compSetClass]">
				<button class="set-button" @click="search_game" v-if="compBlockSelected">
						<span v-show="!isLooking">Queue</span>
						<span v-show="isLooking">Cancel</span>
				</button>
				<span class="block-title">Settings</span>
			</div>
			<div :class="['comp-block', 'block-style', compBlockClass]" @click="selectCompBlock">
				<img src="../../assets/pong.gif" class="block-image">
				<span class="block-title">Competitive</span>
			</div>
			<div :class="['fun-block', 'block-style', funBlockClass]" @click="selectFunBlock">
				<img src="../../assets/pong.gif" class="block-image">
				<span class="block-title">Fun Mode</span>
			</div>
			<div :class="['block-style', funSetClass]">
				<span class="block-title">Settings</span>
			</div>
		</div>
		<div class="countdown-overlay" v-if="showCount">
			<div class="grid">
				<div class="player">
					<img id="player-picture" class="profile-picture" :src="profile_picture"/>
					<h1 class="username-text">{{ username }}</h1>
				</div>
				<div id="countdown" class="countdown">
					<span id="seconds">{{ timeLeft }}</span>
				</div>
				<div class="enemy">
					<img id="enemy-picture" class="profile-picture" :src="enemy_picture"/>
					<h1 class="username-text">{{ enemy_name }}</h1>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, defineComponent } from 'vue'
	import { useUserStore } from '../../stores/UserStore';
	import { io, Socket } from 'socket.io-client';
	import { storeToRefs } from 'pinia';
	import { useGameStore } from '../../stores/GameStore';
	import Game from '../../views/Game.vue'

	const userStore = useUserStore();
	const gameStore = useGameStore();
	const funBlockVisible = ref(true);
	const compBlockVisible = ref(true);
	const compBlockSelected = ref(false);
	const funBlockSelected = ref(false);
	const isLooking = ref(false);
	const showCount = ref(false);
	const timeLeft = ref(4);
	var socket;
	const { username } = storeToRefs(userStore);
	const { profile_picture } = storeToRefs(userStore);
	const { enemy_name } = storeToRefs(gameStore);
	const { enemy_picture } = storeToRefs(gameStore);
	const emit = defineEmits(["start-match"]);

	function countdown() {
		timeLeft.value--;
		if (timeLeft.value > 0)
			setTimeout(countdown, 1000);
		else
		{
			showCount.value = false;
			timeLeft.value = 4;
			emit('start-match');
		}
	}

	function search_game()
	{
		//establish connection
		if (!isLooking.value) {
			socket = io(`${location.hostname}:3000`);
			gameStore.setSocket(socket);
			socket.on('connect', function() {
				console.log('Connected');
			});
			socket.on('disconnect', function() {
				console.log('Disconnected');
			});
			socket.on('foundOpponent', function(username: string, pic: string, room_id: string) {
				gameStore.setIntra(userStore.intra);
        		gameStore.setEnemyName(username);
        		gameStore.setEnemyPicture(pic);
				gameStore.setRoomId(room_id);
        		showCount.value = true;
        		countdown();
			});
			socket.on('noOpponent', function() {
				console.log("No fitting opponent in matchmaking, waiting...");
			});
			socket.emit("createOrJoin", userStore.intra);

			isLooking.value = true;
		}
		else {
			console.log("store.intra is: ", userStore.intra);
			socket.emit("cancelQueue", userStore.intra);
			isLooking.value = false;
		}
	}

	function selectCompBlock() {
		if (funBlockSelected.value)
			return ;
		funBlockVisible.value = !funBlockVisible.value
		compBlockSelected.value = !compBlockSelected.value;
	}

	function selectFunBlock() {
		if (compBlockSelected.value)
			return ;
		compBlockVisible.value = !compBlockVisible.value;
		funBlockSelected.value = !funBlockSelected.value;
	}

	const compBlockClass = computed(() => {
		if (funBlockSelected.value)
			return ('comp-block-hidden');
		else if (funBlockVisible.value)
			return ('comp-block-visible');
		return ('comp-block-selected');
	})

	const funBlockClass = computed(() => {
		if (compBlockSelected.value)
			return ('fun-block-hidden');
		else if (compBlockVisible.value)
			return ('fun-block-visible');
		return ('fun-block-selected');
	})

	const funSetClass = computed(() => {
		if (funBlockSelected.value)
			return ('fun-set-visible');
		return ('fun-set-hidden');
	})

	const compSetClass = computed(() => {
		if (compBlockSelected.value)
			return ('comp-set-visible');
		return ('comp-set-hidden');
	})
</script>

<style scoped>

	/* @font-face {
		font-family: ibm-3270;
		src: url('./assets/3270-Regular.ttf') format('truetype');
	} */

	.startgame {
		@apply h-full;
	}

	.slideshow {
		@apply flex h-full items-center justify-center;
	}

	.block-style {
		/* @apply border w-full md:w-1/3 lg:w-1/3 mx-2 px-2 py-60 bg-transparent transition-all duration-300 ease-in-out rounded-lg; */
		@apply flex flex-col justify-center items-center w-1/4 h-1/2 transition-all duration-700 ease-in-out rounded-lg;
	}

	.comp-block:hover, .fun-block:hover {
		/* @apply transform bg-white bg-opacity-10 scale-110; */
		@apply bg-white bg-opacity-10;
	}

	.set-button {
		@apply flex text-2xl bg-white bg-opacity-10 px-6 py-4 mb-2;
	}

	.set-button:hover {
		@apply text-3xl transition-all duration-300 ease-in-out;
	}

	.block-image {
		@apply w-full h-auto;
	}

	.block-title {
		@apply block text-center mt-4 text-xl;
	}

	.fun-block-visible, .comp-block-visible {
		@apply opacity-100 translate-x-0;
	}

	.fun-block-selected {
		@apply opacity-100 transform -translate-x-full;
		@apply bg-white bg-opacity-10;
	}

	.fun-block-hidden {
		@apply opacity-0 transform translate-x-full;
	}

	.fun-set-visible {
		@apply opacity-100 transform -translate-x-full;
	}

	.fun-set-hidden {
		@apply opacity-0 transform -translate-x-0;
	}
	.comp-block-selected {
		@apply opacity-100 transform translate-x-full;
		@apply bg-white bg-opacity-10;
	}
	.comp-block-hidden {
		@apply opacity-0 transform -translate-x-full;
	}

	.comp-set-visible {
		@apply opacity-100 transform translate-x-full;
	}

	.comp-set-hidden {
		@apply opacity-0 transform translate-x-0;
	}

	.blur {
		filter: blur(7px);
	}

	.countdown-overlay {
		@apply fixed w-full h-full flex items-center justify-between z-50 top-0 bg-black bg-opacity-60;
	}

	.grid {
		@apply inline-flex w-full items-center justify-center gap-40;
	}


	.player, .enemy {
		@apply flex flex-col items-center;
	}

	.profile-picture {
		@apply w-40 h-40 rounded-full object-cover;
	}

	.username-text {
		@apply mt-3 text-4xl;
	}

	.countdown {
		@apply text-9xl animate-ping;
	}
</style>