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
					<div>
						<input
							placeholder="ABCD-1234-EFGH-5678"
							class="kiva-card-input"
							v-model="kivaCardCode">
						<button class="button secondary"
							@click.prevent="updateKivaCard('redemption_code')">Apply</button>

						<!-- This lightbox will be replaced with a Popper tip message. -->
						<a @click.prevent="triggerDefaultLightbox"
							class="help-lightbox">Need help?
						</a>
						<kv-lightbox
							:visible="defaultLbVisible"
							@lightbox-closed="lightboxClosed">
							<h2 slot="title">Where can I find my Kiva Card code?</h2>
							<p>
								Kiva issues three types of Kiva Cards: print-it-yourself cards,
								email delivery and postal delivery.
							</p>
							<p>Print-it-yourself:</p>
							<img alt="print-kiva-card"
								class="card-spacing"
								height="116"
								src="../../assets/images/checkout/printcard_codelocation.jpg"
								width="450">
							<p>Email delivery:</p>
							<img alt="email-kiva-card"
								class="card-spacing"
								height="199"
								src="../../assets/images/checkout/emailcard_codelocation.jpg"
								width="450">
							<p>Postal delivery:</p>
							<img alt="postal-kiva-card"
								class="postal-card"
								height="158"
								src="../../assets/images/checkout/physicalcard_codelocation.jpg"
								width="430">
						</kv-lightbox>

						<div
							class="card-value-wrap"
							v-if="showKivaCardTotal">
							<span>Kiva Card value:</span>
							<span class="kiva-card-amount">{{ formatedKivaCardTotal }}</span>
							<span class="remove-wrapper"
								@click.prevent.stop="removeCredit('redemption_code')">
								<kv-icon class="remove-x" name="small-x" />
							</span>
						</div>
					</div>
				</div>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvExpandable from '@/components/Kv/KvExpandable';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';
import _forEach from 'lodash/forEach';
import numeral from 'numeral';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvIcon,
		KvExpandable,
		KvLightbox
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
			kivaCardCode: '',
			id: '',
			defaultLbVisible: false,
		};
	},
	computed: {
		showKivaCardTotal() {
			return parseFloat(this.totals.redemptionCodeAppliedTotal) > 0;
		},
		formatedKivaCardTotal() {
			return numeral(this.totals.redemptionCodeAppliedTotal).format('$0,0.00');
		}
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
		},
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
		},

		removeCredit(type) {
			this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: removeCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				this.$emit('updating-totals', false);
				this.$kvTrackEvent('Checkout', 'Kiva Card', 'Remove Kiva Card Success');
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
				this.$emit('updating-totals', false);
			});
		}
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
	text-align: center;

	@include breakpoint(medium) {
		margin-left: 16%;
		text-align: unset;
	}

	@include breakpoint(large) {
		margin-left: 14%;
	}

	@include breakpoint(xlarge) {
		margin-left: 12%;
	}

	@include breakpoint(xxlarge) {
		margin-left: 8%;
	}
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

	@include breakpoint(large) {
		float: left;
		margin: rem-calc(15) rem-calc(15) 0 0;
	}
}

.card-spacing {
	border: 1px solid black;
	margin-bottom: rem-calc(50);
}

.card-value-wrap {
	font-weight: 400;
	margin-bottom: 1rem;
	font-size: rem-calc(18);
	white-space: nowrap;

	@include breakpoint(medium) {
		float: right;
	}

	@include breakpoint(xlarge) {
		margin-top: rem-calc(15);
	}
}

.card-value-wrap p {
	float: left;
	padding-right: rem-calc(15);
}

.kiva-card-input {
	width: rem-calc(250);
	border: 1px solid $charcoal;
	color: $charcoal;
	border-radius: $button-radius;
	font-weight: 300;
	text-align: center;
	margin: rem-calc(15) auto;
	display: block;
	height: rem-calc(50);
	font-size: $medium-text-font-size;

	@include breakpoint(medium) {
		margin: rem-calc(15) 0;
	}

	@include breakpoint(large) {
		font-size: $normal-text-font-size;
		float: left;
		height: rem-calc(36);
		margin: rem-calc(15) rem-calc(15) rem-calc(15) 0;
	}
}

.help-lightbox {
	margin: rem-calc(15) 0;

	@include breakpoint(large) {
		float: left;
	}
}

.remove-x {
	fill: $subtle-gray;
	display: inline-block;
	width: 1.1rem;
	height: 1rem;
	cursor: pointer;
}
</style>
