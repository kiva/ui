<template>
	<div
		class="tw-relative tw-inline-block tw-cursor-pointer"
		:class="{ 'tw-grayscale': isInProgress }"
		@click="handleBadgeClick"
	>
		<slot></slot>
		<component
			v-if="isInProgress"
			:is="outlineComponent"
			class="tw-absolute tw-h-full"
			style="height: 105%; width: 105%; top: -4px; left: -4px;"
		/>
		<component v-else-if="isLocked" :is="solidComponent" class="tw-absolute tw-h-full tw-top-0" />
		<div
			v-if="isLocked"
			class="tw-absolute tw-flex"
			:class="{ 'animate-wiggle': animateLock }"
			style="left: calc(50% - 14px); top: calc(50% - 14px)"
		>
			<KvMaterialIcon
				class="tw-w-3.5 tw-h-3.5 tw-text-white"
				:icon="mdiLock"
			/>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
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
import { mdiLock } from '@mdi/js';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import OutlineArch from '#src/assets/images/my-kiva/badge-outline-arch.svg';
import OutlineCircle from '#src/assets/images/my-kiva/badge-outline-circle.svg';
import OutlineOblong from '#src/assets/images/my-kiva/badge-outline-oblong.svg';
import OutlineOval from '#src/assets/images/my-kiva/badge-outline-oval.svg';
import OutlineRectangle from '#src/assets/images/my-kiva/badge-outline-rectangle.svg';
import SolidArch from '#src/assets/images/my-kiva/badge-solid-arch.svg';
import SolidCircle from '#src/assets/images/my-kiva/badge-solid-circle.svg';
import SolidOblong from '#src/assets/images/my-kiva/badge-solid-oblong.svg';
import SolidOval from '#src/assets/images/my-kiva/badge-solid-oval.svg';
import SolidRectangle from '#src/assets/images/my-kiva/badge-solid-rectangle.svg';

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
});

const isInProgress = computed(() => props.status === BADGE_IN_PROGRESS);

const isLocked = computed(() => props.status === BADGE_LOCKED);

const animateLock = ref(false);

const outlineComponent = computed(() => {
	switch (props.shape) {
		case BADGE_SHAPE_ARCH:
			return OutlineArch;
		case BADGE_SHAPE_OBLONG:
			return OutlineOblong;
		case BADGE_SHAPE_OVAL:
			return OutlineOval;
		case BADGE_SHAPE_RECTANGLE:
			return OutlineRectangle;
		default:
			return OutlineCircle;
	}
});

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

const handleBadgeClick = () => {
	if (isLocked.value) {
		animateLock.value = true;
		setTimeout(() => { animateLock.value = false; }, 1600);
	}
};
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

.animate-wiggle {
	animation: wiggle 2s linear;
}
</style>
