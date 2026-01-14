<template>
	<transition-group name="collapse" tag="div">
		<template v-if="!newConsentAnswered">
			<div class="module-container">
				<h2 style="line-height: 1.25;">
					{{ title }}
				</h2>
				<BorrowerAvatarsContainer
					v-if="loansToDisplay.length && !props.achievementsCompleted"
					:loans="loansToDisplay"
					show-large-avatars
				/>
				<h3 class="tw-font-book">
					{{ description }}
				</h3>
				<div class="tw-w-full tw-flex tw-flex-col tw-gap-2">
					<kv-button
						class="tw-w-full btn"
						@click="() => updateOptIn(true)"
						:state="buttonState"
					>
						Yes, keep me updated
					</kv-button>
					<kv-button
						@click="() => updateOptIn(false)"
						:state="buttonState"
						variant="ghost"
						class="tw-w-full btn ghost"
					>
						No, I don’t want to receive updates
					</kv-button>
				</div>
			</div>
		</template>

		<template v-else>
			<OptInNotification
				:loans-to-display="loansToDisplay"
				:receive-news="receiveNews"
				:is-mobile="isMobile"
			/>
		</template>
	</transition-group>
</template>

<script setup>
import {
	computed, inject, onMounted, ref
} from 'vue';
import { KvButton } from '@kiva/kv-components';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import useIsMobile from '#src/composables/useIsMobile';
import useOptIn from '#src/composables/useOptIn';
import {
	MOBILE_BREAKPOINT,
} from '#src/composables/useBadgeModal';
import OptInNotification from '#src/components/Thanks/MyKiva/OptInNotification';
import BorrowerAvatarsContainer from '#src/components/Thanks/BorrowerAvatarsContainer';

const props = defineProps({
	loans: {
		type: Array,
		default: () => ([])
	},
	isGuest: {
		type: Boolean,
		default: false,
	},
	numberOfBadges: {
		type: Number,
		default: 0,
	},
	onlyDonations: {
		type: Boolean,
		default: false,
	},
	achievementsCompleted: {
		type: Boolean,
		default: false,
	},
});

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const cookieStore = inject('cookieStore');
const newConsentAnswered = ref(false);
const receiveNews = ref(false);
const buttonState = ref('');

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const {
	setMailUpdatesOptOutCookie, updateCommunicationSettings, updateVisitorEmailOptIn
} = useOptIn(apollo, cookieStore);

const primaryBorrowerName = computed(() => props.loans[0]?.name ?? '');
const primaryBorrowerPossessiveName = computed(() => formatPossessiveName(primaryBorrowerName.value));

const title = computed(() => {
	if (props.onlyDonations || props.achievementsCompleted) {
		return 'Thank you!';
	}
	if (!props.loans.length) {
		return 'Thank you for changing lives with Kiva!';
	}
	if (props.loans.length === 1) {
		return `Thank you! You and ${props.loans[0]?.name} are in this together now.`;
	}
	if (props.loans.length === 2) {
		const names = props.loans.map(loan => loan?.name).join(' and ');
		return `Thank you! You, ${names} are in this together now.`;
	}

	return `Thank you! You, ${props.loans[0]?.name}, ${props.loans[1]?.name}
		and ${props.loans[2]?.name} are in this together now.`;
});

const description = computed(() => {
	if (props.onlyDonations) {
		return 'Want to hear how your donation is changing real lives?';
	}
	if (props.loans.length && !props.achievementsCompleted) {
		// eslint-disable-next-line max-len
		return `Want to hear how you're impacting ${primaryBorrowerPossessiveName.value} life and more ways to help people like them?`;
	}

	return 'Want to hear how your support is changing real lives?';
});

const loansToDisplay = computed(() => props.loans.slice(0, 3));

const emit = defineEmits(['answered']);

const updateOptIn = async value => {
	buttonState.value = 'loading';

	$kvTrackEvent(
		'post-checkout',
		'click',
		`${value ? 'accept' : 'reject'}-opt-in-request`,
		props.isGuest ? 'guest' : 'signed-in',
		props.numberOfBadges,
	);

	if (value) {
		const visitorId = cookieStore.get('uiv') || null;
		if (props.isGuest && visitorId) {
			await updateVisitorEmailOptIn(value, value, false, visitorId);
		} else {
			await updateCommunicationSettings(value, value, false);
		}
		setMailUpdatesOptOutCookie(false);
	}
	newConsentAnswered.value = true;
	receiveNews.value = value;
	emit('answered', value);
};

onMounted(() => {
	setMailUpdatesOptOutCookie(true);
});

</script>

<style lang="postcss" scoped>

.module-container {
	max-width: 620px;
	max-height: 900px;

	@apply tw-flex tw-flex-col tw-overflow-hidden tw-opacity-full tw-bg-white tw-w-full
		tw-text-center tw-px-3 md:tw-px-8 tw-gap-3 tw-rounded md:tw-rounded-xl tw-py-4 tw-shadow-lg;
}

.btn :deep(span) {
	@apply tw-px-0;
}

.btn.ghost :deep(span) {
	@apply tw-bg-transparent;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.5s ease, opacity 0.5s ease, padding 0.5s ease;
  overflow: hidden;
}

.collapse-enter,
.collapse-leave-to {
	@apply tw-max-h-0 tw-opacity-0 tw-py-0;
}
</style>
