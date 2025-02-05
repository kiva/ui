<template>
	<div class="module-container">
		<div
			style="min-height: 481px;"
			class="
        tw-flex
        tw-flex-col
        tw-items-center
        tw-gap-1.5
        tw-text-center
        tw-overflow-hidden
        print:tw-hidden
        tw-relative
        tw-justify-between
      "
		>
			<h2 v-html="title" class="tw-text-center"></h2>
			<!-- BG Rays -->
			<div class="ray_box">
				<div class="ray ray1"></div>
				<div class="ray ray2"></div>
				<div class="ray ray3"></div>
				<div class="ray ray4"></div>
				<div class="ray ray5"></div>
				<div class="ray ray6"></div>
				<div class="ray ray7"></div>
				<div class="ray ray8"></div>
				<div class="ray ray9"></div>
				<div class="ray ray10"></div>
			</div>
			<Globe class="tw-z-1" style="width: 194px; height: 189px;" />
			<KvButton
				class="tw-w-full"
				@click="emit('continue')"
			>
				<div class="tw-flex tw-items-center tw-gap-1">
					Continue
					<KvMaterialIcon
						class="tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
				</div>
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import { computed, defineProps, inject } from 'vue';
import Globe from '#src/assets/inline-svgs/thanks/globe.svg';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowRight } from '@mdi/js';

const props = defineProps({
	isLoggedIn: {
		type: Boolean,
		default: false,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
	},
});

const title = computed(() => {
	const msg = 'Stay up to date with your lending history, stats, and more!';
	return props.isOptedIn
		? `Thank you!<br>${msg}`
		: msg;
});

</script>

<style lang="postcss" scoped>

.module-container {
	@apply tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8
		tw-py-4 tw-flex tw-flex-col tw-text-center tw-gap-3 tw-mb-2.5;
}

/** Rays */
.ray_box {
	@apply tw-absolute tw-mx-auto tw-left-0 tw-right-0 tw-bottom-0 tw-aspect-square;

  top: 9rem;
  width: 200px;

  @screen md{
    top: 7rem;
    width: 250px;
  }
}

.ray {
	background: linear-gradient(180deg, rgba(241 179 67 / 3%) 0%,
	rgba(241 179 67 / 25%) 50%, rgba(241 179 67 / 3%) 100%);
	border-radius:80% 80% 0 0;
	animation: ray_anim 2.5s ease-in-out infinite;
	@apply tw-absolute tw-ml-1;
}

.ray1 {
	transform: rotate(180deg);
	height: 130px;
	width: 30px;
	top: -15%;
	left: 42%;
	@screen md {
		height: 120px;
		top: -12%;
	}
}

.ray2 {
	transform: rotate(220deg);
	animation-delay: 1s;
	height: 140px;
	width: 8px;
	top: -5%;
	left: 85%;
	@screen md {
		height: 150px;
		top: -15%;
		left: 85%;
	}
}

.ray3 {
	transform: rotate(250deg);
	animation-delay: 1.5s;
	height: 80px;
	width: 20px;
	top: 45%;
	left: 88%;
	@screen md {
		height: 200px;
		top: 15%;
		left: 105%;
	}
}

.ray4 {
	transform: rotate(305deg);
	animation-delay: 0.5s;
	height: 90px;
	width: 14px;
	top: 80%;
	left: 90%;
	@screen md {
		height: 200px;
		top: 65%;
		left: 98%;
	}
}

.ray5 {
	transform: rotate(-15deg);
	animation-delay: 1s;
	height: 110px;
	width: 30px;
	top: 110%;
	left: 60%;
	@screen md {
		height: 180px;
		top: 80%;
		left: 58%;
	}
}

.ray6 {
	transform: rotate(30deg);
	animation-delay: 2s;
	height: 110px;
	width: 25px;
	top: 105%;
	left: 18%;
	@screen md {
		height: 180px;
		top: 80%;
		left: 15%;
	}
}

.ray7 {
	transform: rotate(70deg);
	animation-delay: 1.5s;
	height: 90px;
	width: 10px;
	top: 80%;
	left: 0%;
	@screen md {
		height: 200px;
		top: 63%;
		left: -15%;
	}
}

.ray8 {
	transform: rotate(100deg);
	animation-delay: 0.5s;
	height: 80px;
	width: 28px;
	top: 55%;
	left: -5%;
	@screen md {
		height: 180px;
		top: 25%;
		left: -20%;
	}
}

.ray9 {
	transform: rotate(120deg);
	animation-delay: 2s;
	height: 80px;
	width: 10px;
	top: 30%;
	left: 1%;
	@screen md {
		height: 180px;
		top: -5%;
		left: -15%;
	}
}

.ray10 {
	transform: rotate(150deg);
	animation-delay: 1s;
	height: 120px;
	width: 23px;
	top: -2%;
	left: 12%;
	@screen md {
		height: 120px;
		top: -5%;
		left: 12%;
	}
}

@keyframes ray_anim {
	0% {
		opacity: 0.4;
	}

	25% {
		opacity: 1;
	}

	75% {
		opacity: 1;
	}

	100% {
		opacity: 0.4;
	}
}
</style>
