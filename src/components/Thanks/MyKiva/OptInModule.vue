<template>
	<transition-group name="collapse" tag="div">
		<template v-if="!newConsentAnswered">
			<div class="module-container">
				<h2>{{ title }}</h2>
				<div class="borrower-container">
					<div
						class="tw-flex tw-justify-center tw-items-center tw-z-1 image-container"
					>
						<borrower-image
							v-for="loan, index in loansToDisplay"
							:key="loan.id"
							class="borrower-image"
							:class="{'centered-borrower' : index === 1 && loansToDisplay.length === 3}"
							:style="{
								marginLeft: `${loans.length === 2 && index === 1
									? (index * marginLeftWeight)
									: (index - 1) * marginLeftWeight}rem`,
								zIndex: `${index + 1}`,
							}"
							:aspect-ratio="1"
							:default-image="{ width: 200, faceZoom: 30 }"
							:hash="hash(loan)"
							:images="[
								{ width: 200, faceZoom: 30 },
							]"
						/>
					</div>
				</div>
				<p>{{ description }}</p>
				<div class="tw-w-full tw-flex tw-flex-col tw-gap-2">
					<kv-button
						class="tw-w-full"
						@click="() => updateOptIn(true)"
						v-kv-track-event="[
							'thanks',
							'click',
							'accept-opt-in-request',
						]"
					>
						Yes, keep me updated
					</kv-button>
					<kv-button
						@click="() => updateOptIn(false)"
						variant="ghost"
						class="tw-w-full ghost-button"
						v-kv-track-event="[
							'thanks',
							'click',
							'reject-opt-in-request',
						]"
					>
						No, I don’t want to receive updates
					</kv-button>
				</div>
			</div>
		</template>

		<template v-if="newConsentAnswered">
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
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import KvButton from '@kiva/kv-components/vue/KvButton';
import useIsMobile from '#src/composables/useIsMobile';
import {
	MOBILE_BREAKPOINT,
} from '#src/composables/useBadgeModal';
import OptInNotification from './OptInNotification';

const props = defineProps({
	selectedLoan: {
		type: Object,
		default: () => ({})
	},
	loans: {
		type: Array,
		default: () => ([])
	},
	optedIn: {
		type: Boolean,
		default: false
	}
});

const apollo = inject('apollo');
const newConsentAnswered = ref(false);
const receiveNews = ref(false);

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const borrowerName = computed(() => {
	return props.selectedLoan?.name ?? '';
});

const title = computed(() => {
	if (props.optedIn) {
		return 'Thank you! You reached a milestone';
	}
	if (props.loans.length === 1) {
		return `You and ${borrowerName.value} are in this together now.`;
	}
	if (props.loans.length === 2) {
		const names = props.loans.map(loan => loan?.name).join(' and ');
		return `Thank you! You, ${names} are in this together now.`;
	}

	return `Thank you! You, ${props.loans[0]?.name}, ${props.loans[1]?.name}
		and ${props.loans[2]?.name} are in this together now.`;
});

const description = computed(
	() => `Want to hear how you're impacting ${borrowerName.value}'s life and more ways to help people like them?`
);

const loansToDisplay = computed(() => {
	const loans = [...props.loans];
	if (props.loans.length === 3) {
		const indexToRemove = loans.indexOf(loan => loan.id === props.selectedLoan.id);
		const removedLoan = loans.splice(indexToRemove, 1)[0];
		loans.splice(1, 0, removedLoan);
	}
	return loans.slice(0, 3);
});

const marginLeftWeight = computed(() => {
	if (loansToDisplay.value.length === 1) {
		return 0;
	}
	if (loansToDisplay.value.length === 2) {
		return 6;
	}

	if (isMobile.value) {
		return 7;
	}

	return 12;
});

const hash = loan => {
	return loan?.image?.hash ?? '';
};

const updateOptIn = value => {
	if (value) {
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
					lenderNews: value,
				},
			});
		} catch (error) {
			logReadQueryError(error, 'error');
		}
	}
	newConsentAnswered.value = true;
	receiveNews.value = value;
};
</script>

<style lang="postcss" scoped>

.module-container {
	max-width: 620px;
	max-height: 800px;

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

.borrower-image {
	width: 80px !important;
	height: 80px !important;

	@screen md {
		width: 160px !important;
		height: 160px !important;
	}

	box-shadow: '0px 4.42px 22.1px 0px #D1DCD6';
	@apply tw-absolute tw-w-full tw-rounded-full tw-bg-black tw-border-4 tw-border-white tw-z-2 tw-pb-0;
}

.centered-borrower {
	width: 100px !important;
	height: 100px !important;

	@screen md {
		width: 180px !important;
		height: 180px !important;
	}

	@apply !tw-z-5;
}

.ghost-button :deep(span) {
	@apply tw-bg-transparent;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 1s ease, opacity 1s ease;
  overflow: hidden;
}

.collapse-enter,
.collapse-leave-to {
	@apply tw-max-h-0 tw-opacity-0 tw-py-0;
}
</style>
