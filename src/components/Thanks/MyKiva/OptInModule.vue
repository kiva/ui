<template>
	<transition-group name="collapse" tag="div">
		<template v-if="!newConsentAnswered">
			<div class="module-container">
				<h2>{{ title }}</h2>
				<div class="tw-flex tw-items-center tw-justify-center">
					<KvUserAvatar
						v-for="loan, index in loansToDisplay"
						:key="loan.id"
						:lender-name="loan?.name"
						:lender-image-url="getLoanImageUrl(loan)"
						class="borrower-image tw-rounded-full tw-shadow"
						:class="{
							'centered-borrower-image' : index === 1 && loansToDisplay.length === 3,
							'single-pair-loans': loansToDisplay.length < 3
						}"
						:style="{
							marginRight: getMarginRight(index),
							marginLeft: getMarginLeft(index),
							zIndex: index === 1 ? 2 : 1,
						}"
					/>
				</div>
				<h3 class="tw-font-book">
					{{ description }}
				</h3>
				<div class="tw-w-full tw-flex tw-flex-col tw-gap-2">
					<kv-button
						class="tw-w-full btn"
						@click="() => updateOptIn(true)"
					>
						Yes, keep me updated
					</kv-button>
					<kv-button
						@click="() => updateOptIn(false)"
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
import { computed, inject, ref } from 'vue';
import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';
import KvButton from '#kv-components/KvButton';
import useIsMobile from '#src/composables/useIsMobile';
import {
	MOBILE_BREAKPOINT,
} from '#src/composables/useBadgeModal';
import KvUserAvatar from '#kv-components/KvUserAvatar';
import { getKivaImageUrl } from '#src/util/imageUtils';
import OptInNotification from './OptInNotification';

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
	}
});

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const $appConfig = inject('$appConfig');
const cookieStore = inject('cookieStore');
const newConsentAnswered = ref(false);
const receiveNews = ref(false);

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const title = computed(() => {
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

const description = computed(
	() => `Want to hear how you're impacting ${props.loans[0]?.name}'s life and more ways to help people like them?`
);

const loansToDisplay = computed(() => props.loans.slice(0, 3));

const getMarginRight = index => {
	if (loansToDisplay.value.length > 2 && index === 0) {
		if (isMobile.value) {
			return '-81.5px';
		}
		return '-100px';
	}

	return '0';
};

const getMarginLeft = index => {
	if (loansToDisplay.value.length > 1 && index === loansToDisplay.value.length - 1) {
		if (loansToDisplay.value.length === 2) {
			return '-63px';
		}

		if (isMobile.value) {
			return '-81.5px';
		}
		return '-100px';
	}

	return '0';
};

const updateCommunicationSettings = lenderNews => {
	try {
		apollo.mutate({
			mutation: gql`
					mutation updateCommunicationSettings(
						$lenderNews: Boolean
					) {
						my {
							updateCommunicationSettings(
								communicationSettings: {
									lenderNews: $lenderNews
								}
							)
						}
					}
				`,
			variables: {
				lenderNews,
			},
		});
	} catch (error) {
		logReadQueryError(error, 'OptInModule updateCommunicationSettings');
	}
};

const updateVisitorEmailOptIn = (lenderNews, visitorId) => {
	try {
		apollo.mutate({
			mutation: gql`
				mutation updateVisitorCommunicationSettings(
					$lenderNews: Boolean,
					$visitorId: String!
				) {
					visitorEmailOptIn {
						updateCommunicationSettings(
							communicationSettings: {
								lenderNews: $lenderNews
							},
							visitorId: $visitorId
						)
					}
				}
			`,
			variables: {
				lenderNews,
				visitorId,
			},
		});
	} catch (error) {
		logReadQueryError(error, 'OptInModule updateVisitorCommunicationSettings');
	}
};

const updateOptIn = value => {
	$kvTrackEvent(
		'post-checkout',
		'click',
		`${value ? 'accept' : 'reject'}-opt-in-request`,
		props.isGuest ? 'guest' : 'signed-in',
		props.numberOfBadges,
	);

	if (value) {
		const visitorId = cookieStore.get('uiv') || null;
		if (props.isGuest) {
			updateVisitorEmailOptIn(value, visitorId);
		} else {
			updateCommunicationSettings(value);
		}
	}
	newConsentAnswered.value = true;
	receiveNews.value = value;
};

const getLoanImageUrl = loan => {
	return getKivaImageUrl({
		height: 500,
		width: 500,
		base: $appConfig.photoPath,
		hash: loan?.image?.hash,
	});
};
</script>

<style lang="postcss" scoped>

.module-container {
	max-width: 620px;
	max-height: 900px;

	@apply tw-flex tw-flex-col tw-mx-auto tw-overflow-hidden tw-opacity-full tw-bg-white
		tw-text-center tw-px-3 md:tw-px-8 tw-gap-3 tw-rounded-lg tw-py-4;
}

.borrower-container {
	animation: fadein ease-in 1s;
	width: 70px;

	@screen md {
		width: 150px;
	}

	@apply tw-block tw-relative tw-mx-auto tw-z-4;
}

.borrower-container > div {
	height: 100px;

	@screen md {
		height: 200px;
	}
}

.borrower-image, .borrower-image :deep(img) {
	width: 124px;
	height: 124px;

	@screen md {
		width: 160px;
		height: 160px;
	}
}

.single-pair-loans, .single-pair-loans :deep(img) {
	width: 148px !important;
	height: 148px !important;

	@screen md {
		width: 200px !important;
		height: 200px !important;
	}
}

.centered-borrower-image, .centered-borrower-image :deep(img) {
	width: 164px !important;
	height: 160px !important;

	@screen md {
		width: 200px !important;
		height: 200px !important;
	}
}

.borrower-image :deep(img), .centered-borrower-image :deep(img) {
	@apply tw-border-4 tw-border-white;
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
