<template>
	<div class="card-container">
		<div
			v-if="loanStatus"
			class="tw-bg-white tw-absolute tw-top-1 tw-left-1 tw-rounded tw-px-1 tw-py-0.5 tw-font-medium"
		>
			{{ loanStatus }}
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
			<HeroBackground style="height: 92px;" :status-card="true" class="!tw-block" :loan-id="loan.id" />
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
					<p class="tw-text-center md:tw-text-left tw-line-clamp-2">
						{{ description }}
					</p>
					<button
						class="tw-flex tw-items-center tw-justify-center tw-mt-1"
						@click="showLoanDetails"
					>
						<p
							class="tw-text-action tw-font-medium
								md:tw-w-full md:tw-text-left"
						>
							{{ stepsCopy }}
						</p>
						<KvMaterialIcon
							class="tw-w-3 tw-h-3 tw-text-action"
							:icon="mdiChevronRight"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import HeroBackground from '#src/components/BorrowerProfile/HeroBackground';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import {
	mdiChevronRight,
	mdiDotsVertical,
} from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import {
	ref,
	computed,
	toRefs,
	defineProps,
	inject,
	watch,
} from 'vue';
import {
	DEFAULTED,
	FUNDRAISING,
	REFUNDED,
	EXPIRED,
	INACTIVE_EXPIRED,
	PAYING_BACK,
	RAISED,
	ENDED,
	FUNDED,
} from '#src/api/fixtures/LoanStatusEnum';

const COMMENT_ID = 'comment';
const SHARE_ID = 'share';

const $kvTrackEvent = inject('$kvTrackEvent');

const emit = defineEmits(['open-comment-modal', 'open-share-modal', 'open-side-sheet']);

const props = defineProps({
	loan: {
		type: Object,
		required: true,
	},
	showMenu: {
		type: Boolean,
		default: false,
	},
});

const { loan } = toRefs(props);
const menuOpen = ref(false);
const optionsMenu = ref(null);

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

const menuOptions = computed(() => {
	const options = [{
		id: SHARE_ID,
		label: 'Share',
	}];
	if (isFundraising.value) {
		options.unshift({
			id: COMMENT_ID,
			label: 'Leave a comment',
		});
	}
	return options;
});

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
			return '🎉 Fundraising';
		case RAISED:
		case FUNDED:
			return '🎉 Funded';
		case PAYING_BACK:
			return '🎉 Repaying';
		case REFUNDED:
			return 'Refunded';
		case INACTIVE_EXPIRED:
		case EXPIRED:
			return 'Expired';
		case DEFAULTED:
			return 'Ended in default';
		case ENDED:
			return '🎉 Repaid';
		default:
			return '';
	}
});

const description = computed(() => {
	let loanUsageDescription = isFundraising.value ? 'will use ' : 'used ';
	loanUsageDescription += pronoun.value;
	if (showWhatIsNextColumn.value) {
		loanUsageDescription = 'asked for a ';
	}
	return `${borrowerName.value}
		${loanUsageDescription}
		loan ${loanUse.value}`;
});

const showLoanDetails = () => {
	$kvTrackEvent('portfolio', 'click', stepsCopy.value, borrowerName.value, loan.value.id);
	if (showWhatIsNextColumn.value) {
		emit('open-side-sheet', { loan: loan.value });
		return;
	}
	window.location = 'https://help.kiva.org/s/article/What-happens-if-a-loan-doesn-t-fully-fund-on-Kiva-1611075923145';
};

const menuAction = id => {
	if (id === COMMENT_ID) {
		emit('open-comment-modal', { loan: loan.value, borrowerName: borrowerName.value });
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
	width: 336px;
	min-height: 268px;

	@apply tw-flex tw-flex-col tw-justify-center tw-items-center tw-rounded tw-bg-white tw-relative;
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
