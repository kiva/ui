<template>
	<figure>
		<figcaption class="tw-text-base tw-mb-2">
			<span class="tw-sr-only">The Kiva effect:</span>
			When your investment makes a greater impact due to the power of relending.
		</figcaption>
		<div class="tw-flex tw-items-center tw-mx-auto tw-text-white" style="max-width: 24rem;">
			<div v-if="loading" class="tw-flex-auto tw-rounded-full tw-overflow-hidden" style="flex-grow: 3;">
				<kv-loading-placeholder style="padding-bottom: 100%;" />
			</div>
			<div v-if="loading" class="tw-flex-auto tw-rounded-full tw-overflow-hidden" style="flex-grow: 5;">
				<kv-loading-placeholder style="padding-bottom: 100%;" />
			</div>
			<div
				v-if="!loading"
				class="tw-flex-auto tw-relative"
				:style="`flex-grow: ${depositAmount}; flex-basis: ${depositBasis}%;`"
			>
				<div
					class="tw-bg-brand-900 tw-w-full tw-rounded-full"
					style="padding-bottom: 100%;"
				></div>
				<div
					class="
						tw-absolute tw-inset-0
						tw-flex tw-flex-col tw-items-center tw-justify-center
					"
				>
					<span class="tw-text-h3" style="line-height: 1;">
						{{ depositFormatted }}
					</span>
					<span class="tw-text-small" style="line-height: 1;">
						invested
					</span>
				</div>
			</div>
			<div
				v-if="!loading"
				class="tw-flex-auto tw-relative"
				:style="`flex-grow: ${lendAmount}; flex-basis: ${lendBasis}%;`"
			>
				<div
					class="tw-bg-brand tw-w-full tw-rounded-full"
					style="padding-bottom: 100%;"
				></div>
				<div
					class="
						tw-absolute tw-inset-0
						tw-flex tw-flex-col tw-items-center tw-justify-center
					"
				>
					<span class="tw-text-h3" style="line-height: 1;">
						{{ lendFormatted }}
					</span>
					<span class="tw-text-small" style="line-height: 1;">
						of impact
					</span>
				</div>
			</div>
		</div>
	</figure>
</template>

<script>
import numeral from 'numeral';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

const formatAmount = value => numeral(value).format('$0,0[.]00a');

// returns a flex basis value between 22% and 38% (16% difference)
// amount.length will be 2 - 8 characters (as short as '$5' and as long as '$123.456k')
const getBasis = (amount = '') => 22 + ((amount.length - 2) * (16 / 6));

export default {
	name: 'KivaEffectFigure',
	components: {
		KvLoadingPlaceholder,
	},
	props: {
		depositAmount: {
			type: Number,
			default: 0,
		},
		lendAmount: {
			type: Number,
			default: 0,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		depositFormatted() {
			return formatAmount(this.depositAmount);
		},
		depositBasis() {
			return getBasis(this.depositFormatted);
		},
		lendFormatted() {
			return formatAmount(this.lendAmount);
		},
		lendBasis() {
			return getBasis(this.lendFormatted);
		},
	},
};
</script>
