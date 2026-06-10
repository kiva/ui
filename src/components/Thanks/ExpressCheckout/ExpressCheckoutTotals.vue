<template>
	<div
		class="tw-grid tw-grid-cols-2 tw-gap-2 tw-place-content-between tw-mb-2"
	>
		<div>
			<p class="tw-font-medium">
				{{ loanLabel }}
			</p>
			<p v-if="loan && loan.matchingText" class="tw-text-small tw-text-secondary matching-text">
				Matched by {{ loan.matchingText }}
			</p>
		</div>
		<p class="tw-text-right tw-font-medium">
			{{ formattedItemTotal }}
		</p>

		<template v-if="hasRedemptionCode">
			<p>
				{{ formattedRedemptionApplied }} Promotion
			</p>
			<div class="tw-flex tw-items-center tw-justify-end">
				<span>-{{ formattedRedemptionApplied }}</span>
				<!-- <button
					:disabled="removingPromotion"
					class="tw-ml-1 tw-h-2.5 tw-flex"
					data-testid="express-checkout-remove-promotion"
					@click="removePromotion"
				>
					<KvMaterialIcon
						class="tw-w-2.5 tw-text-secondary"
						:icon="mdiClose"
					/>
				</button> -->
			</div>
		</template>

		<template v-if="hasBonusCredit">
			<p>
				{{ formattedBonusApplied }} Kiva Promotion
			</p>
			<div class="tw-flex tw-items-center tw-justify-end">
				<span>-{{ formattedBonusApplied }}</span>
				<!-- <button
					:disabled="removingKivaPromotion"
					class="tw-ml-1 tw-h-2.5 tw-flex"
					data-testid="express-checkout-remove-kiva-promotion"
					@click="removeKivaPromotion"
				>
					<KvMaterialIcon
						class="tw-w-2.5 tw-text-secondary"
						:icon="mdiClose"
					/>
				</button> -->
			</div>
		</template>

		<template v-if="isCreditApplied || isCreditAvailable">
			<KvSwitch
				v-model="creditAppliedModel"
				:disabled="changingCredit"
				class="tw-flex"
			>
				Apply Kiva Credit
			</KvSwitch>
			<p class="tw-text-right">
				{{ isCreditApplied ? `-${formattedAppliedCredit}` : '' }}
			</p>
		</template>

		<p class="tw-font-medium">
			Total due:
		</p>
		<p class="tw-text-right tw-font-medium">
			{{ formattedTotalDue }}
		</p>
	</div>
</template>

<script setup>
import {
	inject, onBeforeUnmount, onMounted, ref, computed, watch,
} from 'vue';
import numeral from 'numeral';
import { applyKivaCredit, removeKivaCredit, watchBasketTotals } from '@kiva/kv-shop';
import { KvSwitch } from '@kiva/kv-components';
import useTipMessage from '#src/composables/useTipMessage';
import logFormatter from '#src/util/logFormatter';

const props = defineProps({
	loan: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['credit-toggled']);

const apollo = inject('apollo');
const { $showTipMsg } = useTipMessage(apollo);

const itemTotal = ref('0.00');
const appliedCredit = ref('0.00');
const availableCredit = ref('0.00');
const totalDue = ref('0.00');
const changingCredit = ref(false);
const creditAppliedModel = ref(false);
const redemptionCodeAppliedTotal = ref('0.00');
const bonusAppliedTotal = ref('0.00');
let totalsSubscription = null;

const loanLabel = computed(() => {
	const name = props.loan?.name ?? '';
	const country = props.loan?.geocode?.country?.name ?? '';
	if (name && country) return `${name} in ${country}`;
	return name || 'Your loan';
});

const formatMoney = value => numeral(value).format('$0,0.00');
const formattedItemTotal = computed(() => formatMoney(itemTotal.value));
const formattedAppliedCredit = computed(() => formatMoney(appliedCredit.value));
const formattedTotalDue = computed(() => formatMoney(totalDue.value));
const formattedRedemptionApplied = computed(() => formatMoney(redemptionCodeAppliedTotal.value));
const formattedBonusApplied = computed(() => formatMoney(bonusAppliedTotal.value));

const isCreditAvailable = computed(() => (numeral(availableCredit.value).value() ?? 0) > 0);
const isCreditApplied = computed(() => (numeral(appliedCredit.value).value() ?? 0) > 0);
const hasRedemptionCode = computed(() => (numeral(redemptionCodeAppliedTotal.value).value() ?? 0) > 0);
const hasBonusCredit = computed(() => (numeral(bonusAppliedTotal.value).value() ?? 0) > 0);

const toggleCredit = async apply => {
	changingCredit.value = true;
	try {
		if (apply) {
			await applyKivaCredit(apollo);
		} else {
			await removeKivaCredit(apollo);
		}
		// TODO: track success event for apply/remove kiva credit
	} catch (e) {
		const verb = apply ? 'applying' : 'removing';
		const message = e?.message
			|| `Something went wrong ${verb} your Kiva Credit. Please, refresh the page and try again.`;
		$showTipMsg(message, 'error');
		// Revert the switch to the actual basket state. Without this the
		// switch stays stuck on the user's selected position while the
		// credit was never applied/removed on the server — and the
		// `watchBasketTotals` subscription won't re-fire (the cache didn't
		// change because the mutation failed).
		creditAppliedModel.value = isCreditApplied.value;
		// TODO: track fail event for apply/remove kiva credit
	} finally {
		changingCredit.value = false;
	}
};

watch(creditAppliedModel, value => {
	if (value !== isCreditApplied.value) {
		toggleCredit(value);
	}
	emit('credit-toggled', value);
});

onMounted(() => {
	totalsSubscription = watchBasketTotals(apollo).subscribe({
		next: ({ data }) => {
			itemTotal.value = data?.shop?.basket?.totals?.itemTotal || '0.00';
			appliedCredit.value = data?.shop?.basket?.totals?.kivaCreditAppliedTotal || '0.00';
			availableCredit.value = data?.shop?.basket?.totals?.kivaCreditToReapply || '0.00';
			totalDue.value = data?.shop?.basket?.totals?.creditAmountNeeded || '0.00';
			redemptionCodeAppliedTotal.value = data?.shop?.basket?.totals?.redemptionCodeAppliedTotal || '0.00';
			bonusAppliedTotal.value = data?.shop?.basket?.totals?.bonusAppliedTotal || '0.00';
			creditAppliedModel.value = isCreditApplied.value;
		},
		error: e => {
			logFormatter(`ExpressCheckoutTotals: ${e}`, 'error');
		},
	});
});

onBeforeUnmount(() => {
	totalsSubscription?.unsubscribe();
	totalsSubscription = null;
});
</script>
