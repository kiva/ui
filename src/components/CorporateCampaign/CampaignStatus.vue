<template>
	<section
		class="campaign-status section row align-center"
		:class="[{
			'campaign-status--loading': loadingPromotion,
			'campaign-status--error': !promoApplied && promoErrorMessage && !loadingPromotion && !inContext,
			'campaign-status--success': (promoApplied && !promoErrorMessage && !inContext) || statusMessageOverride,
			'campaign-status--incontext': inContext,
		}, inContextClasses]"
	>
		<div class="small-12 columns" :class="{ 'large-8': !inContext }">
			<div
				:class="[{
					'tw-font-medium': inContext,
					'tw-font-book': !inContext,
				}]"
			>
				<template v-if="statusMessageOverride">
					<span>{{ statusMessageOverride }}</span>
				</template>
				<template v-else>
					<template v-if="loadingPromotion && !promoApplied && !promoErrorMessage">
						<kv-loading-spinner />
						<span>Validating Promotion</span>
					</template>

					<template v-if="!promoApplied && promoErrorMessage && !loadingPromotion">
						<kv-icon class="campaign-status__icon" name="error" />
						<span>{{ promoErrorMessage }}</span>
					</template>
					<template v-else-if="!loadingPromotion && promoApplied === false">
						<span>No promotion applied.</span>
					</template>

					<template v-if="!loadingPromotion && promoApplied && !promoErrorMessage && !isMatching">
						<span
							v-if="promoName && (promoAmount !== '$0.00') && activeCreditType !== 'lending_reward'"
							@click="handlePromoLinkClick"
							:class="{ 'tw-underline': inContext, 'tw-cursor-pointer': inContext }"
							:style="inContext ? 'text-decoration: underline; cursor: pointer;' : ''"
						>
							You have ${{ promoAmount | numeral }}
							<span v-if="promoName">from {{ promoName }}</span>
							to lend!
						</span>
						<span v-if="activeCreditType === 'lending_reward'">
							Complete a loan to receive your lending reward
							<span v-if="promoName"> from {{ promoName }}</span>!
						</span>
					</template>
					<template v-else-if="promoApplied && !promoErrorMessage && isMatching">
						<span>Make a matched loan while {{ promoName }}’s funds last</span>
					</template>
				</template>
			</div>
		</div>
	</section>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	name: 'CampaignStatus',
	components: {
		KvIcon,
		KvLoadingSpinner,
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
	computed: {
		inContextClasses() {
			return this.inContext ? 'tw-relative tw-bg-secondary tw-rounded' : '';
		}
	},
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

<style lang="scss" scoped>
@import 'settings';

.campaign-status {
	max-width: inherit;
	padding: 0.5rem 1rem;
	text-align: center;
	background-color: $kiva-bg-darkgray;
	transition: background-color 0.25s ease-in, color 0.25s ease-in;

	@include breakpoint(large) {
		padding: 0.875rem;
	}

	&--loading {
		background-color: $kiva-bg-darkgray;
	}

	&--error {
		background-color: $kiva-accent-red;
		color: $white;
	}

	&--success {
		background-color: $kiva-green;
		color: $white;
	}

	&__icon {
		width: 1rem;
		height: 1rem;
		fill: $white;
		margin-right: 0.25rem;
		vertical-align: baseline;
		transform: translateY(0.1rem);
	}

	.loading-spinner {
		width: 1rem;
		height: 1rem;
		margin-right: 0.25rem;
		vertical-align: baseline;
		transform: translateY(0.1rem);
	}
}
</style>
