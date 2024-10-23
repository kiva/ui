<template>
	<div
		class="tw-relative tw-inline-block tw-cursor-pointer"
		:class="{ 'tw-grayscale': status === BADGE_IN_PROGRESS || isLocked }"
		@click="handleBadgeClick"
	>
		<slot></slot>
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
} from '#src/composables/useBadgeModal';
import { mdiLock } from '@mdi/js';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';

const props = defineProps({
	status: {
		type: String,
		default: BADGE_COMPLETED,
		validator: value => (BADGE_STATUS.indexOf(value) !== -1),
	}
});

const isLocked = computed(() => props.status === BADGE_LOCKED);
const animateLock = ref(false);

const handleBadgeClick = () => {
	if (isLocked.value) {
		animateLock.value = true;
		setTimeout(() => { animateLock.value = false; }, 1500);
	}
};
</script>

<style lang="postcss" scoped>
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
  30% {
    transform: rotateZ(3deg);
  }
  40% {
    transform: rotateZ(-3deg);
  }
  45% {
    transform: rotateZ(1deg);
  }
  50%, 100% {
    transform: rotateZ(0);
  }
}

.animate-wiggle {
	animation: wiggle 2s linear;
}
</style>
