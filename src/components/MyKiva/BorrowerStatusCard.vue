<template>
	<div class="card-container">
		<div class="tw-bg-white tw-absolute tw-top-1 tw-left-1 tw-rounded tw-px-1 tw-py-0.5 tw-font-medium">
			🎉 {{ loanStatus }}
		</div>
		<div
			v-if="showMenu"
			class="tw-absolute tw-top-1 tw-right-1"
		>
			<div class="tw-relative">
				<button
					class="tw-bg-white tw-rounded-full tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center
						tw-absolute tw-right-0 menu-trigger"
					v-kv-track-event="['portfolio', 'click', '3-dot-menu']"
					@click="menuOpen = true"
				>
					<KvMaterialIcon
						:icon="mdiDotsVertical"
					/>
				</button>
				<div
					ref="optionsMenu"
					v-if="menuOpen"
					class="tw-absolute tw-right-0 tw-rounded tw-border tw-border-tertiary tw-bg-white tw-z-1
						vertical-menu"
					style="width: 236px;"
				>
					<div
						v-for="(item) in menuOptions"
						:key="item.id"
						class="tw-px-3 tw-py-1.5 tw-border-b tw-border-gray-100 last:tw-border-b-0"
					>
						<button
							@click="menuAction(item.id)"
							class="tw-w-full tw-text-left"
						>
							{{ item.label }}
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="tw-top-0 tw-h-full tw-w-full tw-overflow-hidden tw-rounded-t tw-flex tw-flex-col">
			<HeroBackground style="height: 96px;" class="!tw-block" :loan-id="loan.id" />
			<div
				class="tw-flex tw-justify-center tw-gap-1 md:tw-gap-3 tw-flex-col md:tw-flex-row tw-px-1.5 md:tw-px-2.5
					md:tw-pb-1.5 tw-flex-grow tw-pb-1.5"
			>
				<div class="tw-text-center md:tw-text-left tw-flex-grow md:tw-flex-1">
					<div
						class="tw-w-10 tw-h-10 tw-mx-auto md:tw-mx-0 tw-border-white tw-border-4
							tw-rounded-full tw-shadow tw--mt-5"
					>
						<BorrowerImage
							class="tw-w-full tw-rounded-full"
							:alt="borrowerName"
							:aspect-ratio="1"
							:default-image="{ width: 80, faceZoom: 50 }"
							:hash="hash"
							:images="[
								{ width: 80, faceZoom: 50, viewSize: 1024 },
								{ width: 72, faceZoom: 50, viewSize: 734 },
								{ width: 64, faceZoom: 50 },
							]"
						/>
					</div>
					<div class="tw-text-center md:tw-text-left tw-mb-1 tw-line-clamp-2 tw-font-medium">
						{{ title }}
					</div>
					<p class="tw-text-center md:tw-text-left tw-line-clamp-3 md:tw-line-clamp-6">
						{{ description }}
					</p>
					<button
						v-if="!showMenu"
						class="tw-text-action tw-inline"
						@click="viewDetails"
						variant="primary"
					>
						View details
					</button>
				</div>
				<div class="md:tw-flex-1">
					<button
						class="tw-flex tw-items-center tw-justify-center tw-w-full
							md:tw-pointer-events-none"
						@click="toggleWhatIsNext"
					>
						<p
							class="tw-text-action tw-font-medium md:tw-text-black
								md:tw-w-full md:tw-text-left md:tw-mt-5 md:tw-mb-1"
							:class="{
								'!tw-text-action': !showWhatIsNextColumn,
							}"
						>
							{{ stepsCopy }}
						</p>
						<KvMaterialIcon
							v-if="showWhatIsNextColumn"
							class="tw-w-3 tw-h-3 tw-text-action md:tw-hidden"
							:icon="open ? mdiChevronUp : mdiChevronDown"
						/>
					</button>
					<kv-expandable easing="ease-in-out" class="tw-block md:tw-hidden">
						<div v-show="open">
							<LoanNextSteps
								v-if="showWhatIsNextColumn"
								id="loan-next-steps"
								:weeks-to-repay="weeksToRepay"
								:current-step="currentStep"
								:repayments-started="!isFundraising"
								no-animation
							/>
						</div>
					</kv-expandable>
					<LoanNextSteps
						v-if="showWhatIsNextColumn"
						id="loan-next-steps"
						class="tw-hidden md:tw-block"
						:weeks-to-repay="weeksToRepay"
						:current-step="currentStep"
						:repayments-started="!isFundraising"
						no-animation
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import HeroBackground from '#src/components/BorrowerProfile/HeroBackground';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import {
	mdiChevronDown,
	mdiChevronUp,
	mdiDotsVertical,
} from '@mdi/js';
import KvExpandable from '#src/components/Kv/KvExpandable';
import LoanNextSteps from '#src/components/Thanks/LoanNextSteps';
import { addMonths, differenceInWeeks } from 'date-fns';
import { KvMaterialIcon } from '@kiva/kv-components';
import { useRouter } from 'vue-router';
import {
	ref,
	computed,
	toRefs,
	defineProps,
	inject,
	watch,
} from 'vue';
import {
	FUNDRAISING,
	REFUNDED,
	EXPIRED,
	PAYING_BACK,
	ENDED,
	FUNDED,
} from '#src/api/fixtures/LoanStatusEnum';

const COMMENT_ID = 'comment';
const DETAILS_ID = 'details';
const SHARE_ID = 'share';

const router = useRouter();
const $kvTrackEvent = inject('$kvTrackEvent');

const emit = defineEmits(['toggle-what-is-next', 'open-comment-modal', 'open-share-modal']);

const props = defineProps({
	loan: {
		type: Object,
		required: true,
	},
	openWhatIsNext: {
		type: Boolean,
		required: false,
	},
	showMenu: {
		type: Boolean,
		default: false,
	},
});

const { loan, openWhatIsNext } = toRefs(props);
const open = ref(openWhatIsNext.value);
const menuOpen = ref(false);
const optionsMenu = ref(null);

const menuOptions = [
	{
		id: COMMENT_ID,
		label: 'Leave a comment',
	},
	{
		id: DETAILS_ID,
		label: 'View details',
	},
	{
		id: SHARE_ID,
		label: 'Share',
	},
];

const borrowerName = computed(() => loan.value?.name ?? '');
const borrowerCountry = computed(() => loan.value?.geocode?.country?.name ?? '');
const hash = computed(() => loan.value?.image?.hash ?? '');
const pronoun = computed(() => {
	if (loan.value?.gender === 'male') return 'his';
	if (loan?.value?.gender === 'female') return 'her';
	return 'their';
});
const title = computed(() => `${borrowerName.value} in ${borrowerCountry.value}`);
const loanUse = computed(() => loan.value?.use ?? '');

const isFundraising = computed(() => loan.value?.status === FUNDRAISING);

const showWhatIsNextColumn = computed(() => {
	return !([REFUNDED, EXPIRED, ENDED].includes(loan.value?.status));
});

const stepsCopy = computed(() => {
	if (!showWhatIsNextColumn.value) {
		return 'Learn what this means';
	}
	return 'What’s next?';
});

const loanStatus = computed(() => {
	switch (loan.value?.status) {
		case FUNDRAISING:
			return 'Fundraising';
		case FUNDED:
			return 'Funded';
		case PAYING_BACK:
			return 'Repaying';
		case REFUNDED:
			return 'Refunded';
		case EXPIRED:
			return 'Expired';
		case ENDED:
			return 'Ended in default';
		default:
			return 'Repaid';
	}
});

const description = computed(() => {
	let loanUsageDescription = isFundraising.value ? 'will use ' : 'used ';

	if (showWhatIsNextColumn.value) {
		loanUsageDescription = 'asked for a loan to ';
	}

	return `${borrowerName.value}
		${loanUsageDescription}
		${pronoun.value} loan ${loanUse.value}`;
});
const currentStep = computed(() => {
	if (isFundraising.value) {
		return 1;
	}
	return 4;
});

const weeksToRepay = computed(() => {
	const today = new Date();
	const date = loan.value?.terms?.expectedPayments
		?.find(payment => differenceInWeeks(Date.parse(payment?.dueToKivaDate), today) > 0)
		?.dueToKivaDate ?? null;
	if (date) {
		// Get the number of weeks between the first repayment date (in the future) and now
		return `${differenceInWeeks(Date.parse(date), today)} weeks`;
	}

	// Calculating a possible range of weeks between the planned expiration date and a month after
	const expDate = Date.parse(loan.value?.plannedExpirationDate);
	const minDate = differenceInWeeks(addMonths(today, 1), today);
	const maxDate = differenceInWeeks(addMonths(expDate, 1), today);

	if (minDate === maxDate || maxDate < 0) {
		return `${minDate} weeks`;
	}

	return `${minDate} - ${maxDate} weeks`;
});

const toggleWhatIsNext = () => {
	if (!open.value) {
		$kvTrackEvent('portfolio', 'click', 'What’s next?', borrowerName.value, loan.value.id);
	}
	if (!showWhatIsNextColumn.value) {
		// eslint-disable-next-line max-len
		window.location = 'https://help.kiva.org/s/article/What-happens-if-a-loan-doesn-t-fully-fund-on-Kiva-1611075923145';
	}
	emit('toggle-what-is-next', !open.value);
};

const viewDetails = () => {
	$kvTrackEvent(
		'portfolio',
		'click',
		props.showMenu ? 'recent-loans' : 'View details',
		borrowerName.value,
		loan.value.id
	);

	router.push(`/lend/${loan.value?.id}`);
};

const menuAction = id => {
	if (id === COMMENT_ID) {
		emit('open-comment-modal', { loanId: loan.value?.id, borrowerName: borrowerName.value });
	} else if (id === DETAILS_ID) {
		viewDetails();
	} else if (id === SHARE_ID) {
		$kvTrackEvent('portfolio', 'click', 'share-lightbox', 'social_share_portfolio');
		emit('open-share-modal', { loan: loan.value });
	}

	menuOpen.value = false;
};

const withinBoundaryCheck = event => {
	const target = optionsMenu?.value ?? null;
	if (!target) return false;
	const withinBoundary = event.composedPath().includes(target);
	if (!withinBoundary && menuOpen.value) {
		menuOpen.value = false;
	}
};

watch(() => openWhatIsNext.value, () => {
	open.value = openWhatIsNext.value;
});

watch(() => menuOpen.value, () => {
	if (props.showMenu) {
		setTimeout(() => {
			if (menuOpen.value) {
				document.addEventListener('pointerup', withinBoundaryCheck);
			} else {
				document.removeEventListener('pointerup', withinBoundaryCheck);
			}
		});
	}
});
</script>

<style lang="postcss" scoped>
.card-container {
	@apply tw-flex tw-flex-col tw-justify-center tw-items-center tw-rounded tw-bg-white tw-relative;

	@screen md {
		width: 468px;
	}

	@screen lg {
		width: 520px;
	}
}

.menu-trigger, .vertical-menu {
	box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
}

:deep(#loan-next-steps .step-text) {
	@screen md {
		line-height: 1.25;
	}
}
</style>
