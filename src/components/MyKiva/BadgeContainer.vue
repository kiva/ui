<template>
	<div
		class="tw-relative tw-inline-block tw-w-auto"
		:class="{
			'tw-grayscale': isInProgress,
			'tw-cursor-pointer': isLocked,
			'tw-overflow-hidden': showShine,
		}"
	>
		<FirstBadgeShine v-show="showShine" ref="firstShine" class="shine tw-w-full" />
		<SecondBadgeShine v-show="showShine" ref="secondShine" class="second-shine tw-w-full" />
		<slot v-if="!isLocked"></slot>
		<div
			v-if="isLocked"
			class="tw-absolute tw-top-0 tw-w-full tw-h-full tw-bg-no-repeat tw-bg-cover tw-bg-center"
		>
			<img
				class="tw-absolute tw-top-0 tw-w-full tw-h-full"
				:src="solidComponent"
			>
		</div>
	</div>
</template>

<script setup>
import {
	defineProps,
	ref,
	computed,
	onMounted,
	watch,
} from 'vue';
import {
	BADGE_STATUS,
	BADGE_COMPLETED,
	BADGE_IN_PROGRESS,
	BADGE_LOCKED,
	BADGE_SHAPE,
	BADGE_SHAPE_ARCH,
	BADGE_SHAPE_CIRCLE,
	BADGE_SHAPE_OBLONG,
	BADGE_SHAPE_OVAL,
	BADGE_SHAPE_RECTANGLE,
} from '#src/composables/useBadgeModal';
import FirstBadgeShine from '#src/assets/images/my-kiva/badge-shine/first.svg';
import SecondBadgeShine from '#src/assets/images/my-kiva/badge-shine/second.svg';
import SolidArch from '#src/assets/images/my-kiva/badge-solid-arch.svg?url';
import SolidCircle from '#src/assets/images/my-kiva/badge-solid-circle.svg?url';
import SolidOblong from '#src/assets/images/my-kiva/badge-solid-oblong.svg?url';
import SolidOval from '#src/assets/images/my-kiva/badge-solid-oval.svg?url';
import SolidRectangle from '#src/assets/images/my-kiva/badge-solid-rectangle.svg?url';

const props = defineProps({
	status: {
		type: String,
		default: BADGE_COMPLETED,
		validator: value => BADGE_STATUS.includes(value),
	},
	shape: {
		type: String,
		default: BADGE_SHAPE_CIRCLE,
		validator: value => BADGE_SHAPE.includes(value),
	},
	showShine: {
		type: Boolean,
		default: false,
	},
	isCarousel: {
		type: Boolean,
		default: false,
	},
	hasStarted: {
		type: Boolean,
		default: false,
	}
});

const isInProgress = computed(() => {
	if (props.isCarousel && props.hasStarted) {
		return;
	}
	return props.status === BADGE_IN_PROGRESS;
});

const isLocked = computed(() => props.status === BADGE_LOCKED);

const firstShine = ref(null);
const secondShine = ref(null);

const solidComponent = computed(() => {
	switch (props.shape) {
		case BADGE_SHAPE_ARCH:
			return SolidArch;
		case BADGE_SHAPE_OBLONG:
			return SolidOblong;
		case BADGE_SHAPE_OVAL:
			return SolidOval;
		case BADGE_SHAPE_RECTANGLE:
			return SolidRectangle;
		default:
			return SolidCircle;
	}
});

const handleShine = () => {
	if (firstShine.value?.$el && secondShine.value?.$el) {
		firstShine.value.$el.classList.remove('animate');
		secondShine.value.$el.classList.remove('animate');

		setTimeout(() => {
			firstShine.value?.$el.classList.add('animate');
			secondShine.value?.$el.classList.add('animate');
		}, 10);
	}
};

watch(() => props.showShine, newValue => {
	if (newValue) {
		handleShine();
	}
});

onMounted(() => {
	if (props.showShine) {
		handleShine();
	}
});
</script>

<style lang="postcss" scoped>
:deep(svg) {
	@apply tw-h-full tw-w-full;
}

@keyframes wiggle {
	0%, 7% {
		transform: rotateZ(0);
	}

	15% {
		transform: rotateZ(-15deg);
	}

	20% {
		transform: rotateZ(10deg);
	}

	25% {
		transform: rotateZ(-10deg);
	}

	30% {
		transform: rotateZ(5deg);
	}

	35% {
		transform: rotateZ(-5deg);
	}

	40% {
		transform: rotateZ(3deg);
	}

	45% {
		transform: rotateZ(-3deg);
	}

	50% {
		transform: rotateZ(1deg);
	}

	55%, 100% {
		transform: rotateZ(0);
	}
}

/** Shine */
.shine, .second-shine {
	width: 500px;
	transition: opacity 0.3s ease;

	@apply tw-absolute tw-w-full tw-h-full tw--top-full tw--left-full;
}

.shine.animate {
	animation: shineMove 2.4s ease-in-out forwards infinite;
}

.second-shine.animate {
	animation: shineMove 2.4s ease-in-out forwards 0.05s infinite;
}

@keyframes shineMove {
	0% {
		@apply tw--top-full tw--left-full;
	}

	100% {
		@apply tw-top-full tw-left-full;
	}
}
</style>
