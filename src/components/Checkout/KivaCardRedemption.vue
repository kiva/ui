<template>
	<div
		class="kiva-card-entry-wrapper columns">
		<div class="kiva-card-toggle-wrapper">
			<span>
				<a @click="toggleAccordion">
					<kv-icon
						:class="{ flipped: open }"
						class="toggle-arrow"
						name="medium-chevron" />
				</a>
			</span>
			<span
				class="featured-text accordion-title"
				@click="toggleAccordion">Have a Kiva Card?</span>
		</div>
		<kv-expandable easing="ease-in-out">
			<div
				v-show="open"
				class="accordion-info row">
				<div class="small-12">
					<input
						placeholder="ABCD-1234-EFGH-5678"
						class="kiva-card-input"
						v-model="kivaCardCode">
					<button class="button secondary"
						@click="updateKivaCard('redemption_code')">Apply</button>
					<a>Need help?</a>
					<span
						class="card-value-wrap"
						v-if="showKivaCardTotal">
						<p>Kiva Card value:</p>
						<input
							class="kiva-card-amount"
							:value="totals.redemptionCodeAppliedTotal">
						<span class="remove-wrapper"
							@click="updateKivaCard('remove')">
							<kv-icon class="remove-x" name="small-x" />
						</span>
					</span>
				</div>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvExpandable from '@/components/Kv/KvExpandable';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import _forEach from 'lodash/forEach';

export default {
	components: {
		KvIcon,
		KvExpandable
	},
	inject: ['apollo'],
	props: {
		totals: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			open: false,
			kivaCardCode: ''
		};
	},
	methods: {
		toggleAccordion() {
			this.open = !this.open;
		},
		updateKivaCard(type) {
			this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: addCreditByType,
				variables: {
					creditType: type,
					redemptionCode: this.kivaCardCode
				}
			}).then(data => {
				if (data.errors) {
					_forEach(data.errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					this.$emit('refreshtotals');
					this.$kvTrackEvent('Checkout', 'Apply Kiva Card', 'Kiva Card successfully applied');
				}
				this.$emit('updating-totals', false);
			}).catch(error => {
				console.error(error);
				this.$emit('updating-totals', false);
			});
		}
	},
	computed: {
		showKivaCardTotal() {
			return parseFloat(this.totals.redemptionCodeAppliedTotal) > 0;
		},
	}
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "global/transitions";

.kiva-card-entry-wrapper {
	@include breakpoint(medium) {
		margin: $list-side-margin;
	}
}

.kiva-card-toggle-wrapper {
	display: flex;
	align-items: center;
}

.toggle-arrow {
	transition: transform 300ms ease;
	display: block;
	height: rem-calc(40);
	width: rem-calc(40);
	margin-right: rem-calc(22);
}

.accordion-title {
	padding-left: rem-calc(12);

	&:hover {
		cursor: pointer;
	}
}

.accordion-info {
	margin-left: 4.625rem;
}

.flipped {
	transform: rotate(180deg);
}

.accordion-info button.secondary {
	color: $kiva-accent-blue;
	border: 1px solid $kiva-accent-blue;
	box-shadow: 0 1px $kiva-accent-blue;
	visibility: visible;
	font-size: $medium-text-font-size;
	margin: 0;

	@include breakpoint(medium) {
		padding: rem-calc(6) rem-calc(20);
		margin-right: rem-calc(15);
		width: inherit;
		font-size: $normal-text-font-size;
		height: rem-calc(36);
	}
}

.card-value-wrap {
	@include breakpoint(medium) {
		float: right;
	}
}

.kiva-card-amount {
	display: block;
	border: 1px solid $charcoal;
	border-radius: $button-radius;
	width: 132px;
	text-align: center;
	font-weight: 300;
	color: $charcoal;
	margin-bottom: rem-calc(15);
	height: rem-calc(50);
	font-size: $medium-text-font-size;

	@include breakpoint(medium) {
		width: rem-calc(95);
		font-size: $normal-text-font-size;
		height: rem-calc(36);
	}
}

.kiva-card-input {
	width: rem-calc(250);
	border: 1px solid $charcoal;
	color: $charcoal;
	border-radius: $button-radius;
	font-weight: 300;
	text-align: center;
	margin-right: rem-calc(15);
	margin-bottom: rem-calc(15);
	height: rem-calc(50);
	font-size: $medium-text-font-size;

	@include breakpoint(medium) {
		font-size: $normal-text-font-size;
		height: rem-calc(36);
	}
}

.remove-x {
	fill: $subtle-gray;
	display: inline-block;
	width: 1.1rem;
	height: rem-calc(50);

	@include breakpoint(medium) {
		height: rem-calc(36);
	}
}
</style>
