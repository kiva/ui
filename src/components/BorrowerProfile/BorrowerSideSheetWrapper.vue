<template>
	<KvSideSheet
		:kv-track-function="$kvTrackEvent"
		:show-back-button="false"
		:show-go-to-link="true"
		:show-headline-border="true"
		:visible="showSideSheet"
		:width-dimensions="{ default: '100%', xl:'600px', lg: '50%', md:'50%', sm: '100%' }"
		@go-to-link="goToLink"
		@side-sheet-closed="handleCloseSideSheet"
	>
		<BorrowerSideSheetContent
			:loan-id="selectedLoan?.id"
			:is-adding="isAdding"
			:basket-items="basketItems"
			@add-to-basket="addToBasket"
		/>
	</KvSideSheet>
</template>

<script setup>
import {
	defineProps,
	ref,
	inject,
	onMounted,
} from 'vue';
import BorrowerSideSheetContent from '#src/components/BorrowerProfile/BorrowerSideSheetContent';
import { handleInvalidBasket, hasBasketExpired } from '#src/util/basketUtils';
import updateLoanReservation from '#src/graphql/mutation/updateLoanReservation.graphql';
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';
import useTipMessage from '#src/composables/useTipMessage';
import loanCardBasketed from '#src/graphql/query/loanCardBasketed.graphql';
import { KvSideSheet } from '@kiva/kv-components';

const props = defineProps({
	selectedLoan: {
		type: Object,
		default: () => ({})
	},
	showSideSheet: {
		type: Boolean,
		default: false
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');
const cookieStore = inject('cookieStore');

const { $showTipMsg } = useTipMessage(apollo);
const emit = defineEmits(['close-side-sheet']);

const isAdding = ref(false);
const basketItems = ref([]);

const loadInitialBasketItems = async () => {
	try {
		const basketId = cookieStore.get('kvbskt');
		if (!basketId) {
			basketItems.value = [];
			return;
		}
		const { data } = await apollo.query({
			query: loanCardBasketed,
			variables: {
				id: 0, // dummy id since we only need basket data
				basketId
			},
			fetchPolicy: 'network-only'
		});
		basketItems.value = data?.shop?.basket?.items?.values || [];
	} catch (error) {
		console.error('Error loading initial basket items:', error);
		basketItems.value = [];
	}
};

const addToBasket = lendAmount => {
	$kvTrackEvent(
		'Lending',
		'Add to basket',
		'lend-button-click',
		props.selectedLoan?.id,
		lendAmount
	);
	isAdding.value = true;
	apollo.mutate({
		mutation: updateLoanReservation,
		variables: {
			loanId: Number(props.selectedLoan?.id),
			price: numeral(lendAmount).format('0.00'),
		},
	}).then(({ errors }) => {
		if (errors) {
			// Handle errors from adding to basket
			errors.forEach(error => {
				try {
					$kvTrackEvent(
						'Lending',
						'Add-to-Basket',
						`Failed: ${error.message.substring(0, 40)}...`
					);
					Sentry.captureMessage(`Add to Basket: ${error.message}`);
					if (hasBasketExpired(error?.extensions?.code)) {
						// eslint-disable-next-line max-len
						$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
						return handleInvalidBasket({
							cookieStore,
							loan: {
								id: props.selectedLoan?.id,
								price: lendAmount
							}
						});
					}
					$showTipMsg(error.message, 'error');
				} catch (e) {
					// no-op
				}
			});
		} else {
			try {
				// track facebook add to basket
				if (typeof window !== 'undefined' && typeof fbq === 'function') {
					window.fbq('track', 'AddToCart', { content_category: 'Loan' });
				}
			} catch (e) {
				console.error(e);
			}
			const basketId = cookieStore.get('kvbskt');
			return apollo.query({
				query: loanCardBasketed,
				variables: {
					id: props.selectedLoan?.id,
					basketId: basketId || undefined
				},
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				basketItems.value = data?.shop?.basket?.items?.values || [];
			});
		}
	}).catch(error => {
		$showTipMsg('Failed to add loan. Please try again.', 'error');
		$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
		Sentry.captureException(error);
	}).finally(() => {
		isAdding.value = false;
	});
};

const goToLink = () => {
	$kvTrackEvent('borrower-profile', 'go-to-old-bp', undefined, `${props.selectedLoan?.id}`);
	window.open(`lend/${props.selectedLoan?.id}`);
};

const handleCloseSideSheet = () => {
	emit('close-side-sheet');
};

onMounted(() => {
	loadInitialBasketItems();
});

</script>
