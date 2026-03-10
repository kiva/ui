<template>
	<transition
		name="fade"
		mode="out-in"
		enter-active-class="tw-transition-all tw-duration-500"
		enter-from-class="tw-opacity-0"
		enter-to-class="tw-opacity-full"
		leave-active-class="tw-transition-all tw-duration-500"
		leave-from-class="tw-opacity-full"
		leave-to-class="tw-opacity-0"
	>
		<MyKivaEmailUpdatesCard
			v-if="!accepted"
			key="acceptEmails"
			:loans="loans"
			:latest-loan="latestLoan"
			@accept-email-updates="$emit('accept-email-updates')"
		/>
		<ThankYouCard
			v-else
			key="tkYouCard"
		>
			<template #header>
				<span
					class="tw-inline-flex tw-items-center tw-gap-1
					tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5"
				>
					<KvMaterialIcon
						class="tw-w-2 tw-h-2 tw-shrink-0"
						:icon="mdiEmailOutline"
					/>
					<span
						class="tw-text-primary tw-font-medium tw-align-middle"
						style="font-size: 0.875rem;"
					>
						Email updates
					</span>
				</span>
			</template>
			<template #content>
				<span>We'll keep you updated. Change your <a
					href="/settings/email"
					target="_blank"
					v-kv-track-event="['portfolio', 'click', 'email-preferences-settings']"
				>email preferences</a> at any time.</span>
			</template>
		</ThankYouCard>
	</transition>
</template>

<script setup>
import { mdiEmailOutline } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import MyKivaEmailUpdatesCard from '#src/components/MyKiva/MyKivaEmailUpdatesCard';
import ThankYouCard from '#src/components/MyKiva/ThankYouCard';

defineOptions({ name: 'MyKivaEmailUpdatesTransition' });

defineEmits(['accept-email-updates']);

defineProps({
	accepted: {
		type: Boolean,
		default: false,
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	latestLoan: {
		type: Object,
		default: null,
	},
});
</script>
