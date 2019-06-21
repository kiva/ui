<template>
	<div class="hover-loan-card-small" :class="{expanded}">
		<loan-card-image
			class="hover-loan-card-image"
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="true"
			:use-default-styles="false"

			@track-loan-card-interaction="trackInteraction"
		/>
		<div class="hover-loan-card-data-wrap">
			<p class="name">
				{{ loan.name }}
			</p>
			<div class="minimal-fundraising-meter">
				<fundraising-status-meter
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:is-funded="loan.status==='funded'"
					:short-meter="true"
				/>
			</div>
			<p class="small-text loan-data">
				{{ loan.geocode.country.name }} / {{ loan.activity.name }}
			</p>
		</div>
	</div>
</template>
<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatusMeter';
import hoverLoanCardMixin from '@/components/LoanCards/HoverLoanCard/hoverLoanCardMixin';

export default {
	components: {
		LoanCardImage,
		FundraisingStatusMeter,
	},
	inject: ['apollo'],
	mixins: [
		hoverLoanCardMixin,
	],
	props: {
		expanded: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
<style lang="scss" scoped>
@import "settings";
@import "components/loan-cards/hover-loan-card";

.hover-loan-card-small {
	width: $small-hover-card-width;
	background: $white;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-shrink: 0;
	border-radius: $hover-card-border-radius;
	// Re-enable to add card expansion animation
	// transform: scale(1, 1);
	opacity: 1;
	pointer-events: initial;
	transition: $hover-card-transition-transform, $hover-card-transition-opacity-in;

	.hover-loan-card-image {
		border-radius: $hover-card-border-radius $hover-card-border-radius 0 0;
		overflow: hidden;
	}

	.hover-loan-card-data-wrap {
		position: relative;
		padding: 0.75rem 1rem;
		text-align: center;
		border: rem-calc(1) solid $kiva-stroke-gray;
		border-radius: 0 0 $hover-card-border-radius $hover-card-border-radius;
		border-top: none;
		height: rem-calc(90);

		.name {
			line-height: rem-calc(20);
			color: $kiva-text-dark;
			margin-bottom: 0.75rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.minimal-fundraising-meter {
			margin-bottom: rem-calc(14);
		}

		.loan-data {
			color: $kiva-text-light;
			margin: 0;
			line-height: 1.2;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&.expanded {
		opacity: 0;
		pointer-events: none;
		transition: $hover-card-transition-opacity-out;
		// Re-enable to add card expansion animation
		// transform: scale($width-ratio-large-to-small, $height-ratio-large-to-small);
		// transition: $hover-card-transition-transform, $hover-card-transition-opacity-out;
	}
}
</style>
