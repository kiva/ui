<template>
	<div class="hover-loan-card-small tw-bg-primary" :class="{expanded}">
		<loan-card-image
			class="hover-loan-card-image"
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="true"
			:use-default-styles="false"
			:disable-link="true"

			@image-click="handleClick"
		/>
		<div
			class="hover-loan-card-data-wrap"
			@click="handleClick"
		>
			<p class="name tw-text-primary">
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
			<p class="tw-text-small tw-text-secondary loan-data">
				{{ loan.geocode.country.name }} / {{ loan.activity.name }}
			</p>
		</div>
	</div>
</template>
<script>
import LoanCardImage from '#src/components/LoanCards/LoanCardImage';
import FundraisingStatusMeter from '#src/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';
import hoverLoanCardMixin from '#src/components/LoanCards/HoverLoanCard/hoverLoanCardMixin';

export default {
	name: 'HoverLoanCardSmall',
	components: {
		LoanCardImage,
		FundraisingStatusMeter,
	},
	inject: ['apollo'],
	mixins: [
		hoverLoanCardMixin,
	],
	emits: ['update-detailed-loan-index'],
	props: {
		expanded: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		handleClick() {
			this.$emit('update-detailed-loan-index');
		},
	},
};
</script>
<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;
@use '#src/assets/scss/components/loan-cards/hover-loan-card' as *;

.hover-loan-card-small {
	@extend .base-portrait-hover-loan-card;

	width: $small-hover-card-width;
	height: $small-hover-card-height;

	// Re-enable to add card opacity transition
	// transition: $hover-card-transition-transform, $hover-card-transition-opacity-out;

	transition: $hover-card-transition-transform;

	.hover-loan-card-image {
		@extend .base-portrait-hover-loan-card-image;

		height: $small-hover-card-image-height;
	}

	.hover-loan-card-data-wrap {
		@extend .base-portrait-hover-loan-card-data-wrap;

		height: $small-hover-card-data-height;
		padding: 0.75rem 1rem;
		text-align: center;

		.name {
			margin-bottom: 0.75rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.minimal-fundraising-meter {
			margin-bottom: rem-calc(14);
		}

		.loan-data {
			margin: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&.expanded {
		pointer-events: none;
		transform: scale($width-ratio-large-to-small, $height-ratio-large-to-small);

		// Re-enable to add card opacity transition
		// opacity: 0;
		// transition: $hover-card-transition-transform, $hover-card-transition-opacity-in;

		.hover-loan-card-image {
			transform: scale(1, $small-hover-card-image-scale-y);
		}
	}
}
</style>
