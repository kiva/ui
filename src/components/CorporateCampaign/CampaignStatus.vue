<template>
	<section
		class="
			tw-bg-secondary
			tw-py-1 tw-px-2 md:tw-p-1.5
			tw-h-5 md:tw-h-6
			tw-text-center
			tw-transition-colors
		"
		:class="[{
			'tw-bg-secondary': loadingPromotion,
			'tw-bg-danger tw-text-white': !promoApplied && promoErrorMessage && !loadingPromotion && !inContext,
			'tw-bg-brand tw-text-white': (promoApplied && !promoErrorMessage && !inContext) || statusMessageOverride,
			'tw-relative tw-bg-secondary tw-rounded campaign-status--incontext': inContext,
		}]"
	>
		<div class="section row align-center">
			<div class="small-12 columns" :class="{ 'large-8': !inContext }">
				<div class="tw-mb-0 "
					:class="{
						'tw-font-medium': !inContext,
						'tw-font-book': inContext
					}"
					style="line-height: 1.357rem;"
				>
					<template v-if="statusMessageOverride">
						<span>{{ statusMessageOverride }}</span>
					</template>
					<template v-else>
						<template v-if="loadingPromotion && !promoApplied && !promoErrorMessage">
							<kv-loading-spinner
								size="small"
								class="tw-inline-flex tw-mr-0.5"
								style="margin-top: -0.1rem;"
							/>
							<span>Validating Promotion</span>
						</template>

						<template v-if="!promoApplied && promoErrorMessage && !loadingPromotion">
							<kv-material-icon
								class="
									tw-text-white tw-fill-current
									tw-mr-0.5 tw-w-2 tw-h-2
									tw-inline-block tw-align-baseline"
								style="margin-bottom: -0.1rem;"
								:icon="mdiAlertCircle"
							/>
							<span>Validating Promotion {{ promoErrorMessage }}</span>
						</template>
						<template v-else-if="!loadingPromotion && promoApplied === false">
							<span>No promotion applied.</span>
						</template>

						<template v-if="!loadingPromotion && promoApplied && !promoErrorMessage && !isMatching">
							<span
								v-if="promoName && (promoAmount !== '$0.00') && activeCreditType !== 'lending_reward'"
								@click="handlePromoLinkClick"
								:class="{
									'tw-underline': inContext,
									'tw-cursor-pointer': inContext
								}"
							>
								You have ${{ promoAmount | numeral }}
								<span v-if="promoName">from {{ promoName }}</span>
								to lend!
							</span>
							<span v-if="activeCreditType === 'lending_reward'">
								Complete a loan to recieve your lending reward
								<span v-if="promoName"> from {{ promoName }}</span>!
							</span>
						</template>
						<template v-else-if="promoApplied && !promoErrorMessage && isMatching">
							<span>Make a matched loan while {{ promoName }}’s funds last</span>
						</template>
					</template>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mdiAlertCircle } from '@mdi/js';
import KvLoadingSpinner from '~/@kiva/kv-components/vue/KvLoadingSpinner';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		KvLoadingSpinner,
		KvMaterialIcon,
	},
	props: {
		activeCreditType: {
			type: String,
			default: null
		},
		inContext: {
			type: Boolean,
			default: false
		},
		isMatching: {
			type: Boolean,
			default: false
		},
		loadingPromotion: {
			type: Boolean,
			default: false
		},
		promoErrorMessage: {
			type: String,
			default: null
		},
		promoApplied: {
			type: Boolean,
			default: null
		},
		promoAmount: {
			type: String,
			default: '$0.00'
		},
		promoName: {
			type: String,
			default: null
		},
		statusMessageOverride: {
			type: String,
			default: null
		}
	},
	data() { return { mdiAlertCircle }; },
	methods: {
		handlePromoLinkClick() {
			// Do nothing if not within the In-Context scenario
			if (!this.inContext) return false;
			// Refresh the page we are in context
			window.location = window.location.origin + window.location.pathname;
		}
	}
};
</script>
