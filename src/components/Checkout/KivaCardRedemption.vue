<template>
	<div class="columns">
		<div
			class="kiva-card-entry-wrapper row">
			<span class="small-3 large-2">
				<a @click="toggleAccordion">
					<kv-icon
						:class="{ flipped: open }"
						class="toggle-arrow"
						name="medium-chevron" />
				</a>
			</span>
			<span
				class="featured-text accordion-title small-9 large-10"
				@click="toggleAccordion">Have a Kiva Card?</span>
			<kv-expandable easing="ease-in-out">
				<div
					v-show="open"
					class="accordion-info row small-12">
					<div class="small-3 large-2"></div>
					<div class="small-9 large-10">
						<div>
							<input
								placeholder="ABCD-1234-EFGH-5678"
								class="kiva-card-input"
								v-model="kivaCardCode"
								@keyup.enter.prevent="updateKivaCard('redemption_code')">
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

							<ul class="redemption-items">
								<li v-for="(credit, index) in credits" :key="index">
									<span class="heading">Kiva Card value: </span>
									<span class="value">${{ credit.applied }}</span>
									<span class="remove-wrapper"
										@click.prevent.stop="removeCredit('redemption_code', credit.id)">
										<kv-icon class="remove-x" name="small-x" />
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvExpandable from '@/components/Kv/KvExpandable';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';
import _forEach from 'lodash/forEach';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvIcon,
		KvExpandable,
		KvLightbox
	},
	inject: ['apollo'],
	props: {
		credits: {
			type: Array,
			default: () => []
		},
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
	mounted() {
		if (this.showKivaCardTotal) {
			this.toggleAccordion();
		}
	},
	computed: {
		showKivaCardTotal() {
			return parseFloat(this.totals.redemptionCodeAppliedTotal) > 0;
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
					this.$emit('updating-totals', false);
				} else {
					this.$emit('refreshtotals', 'kiva-card-applied');
					this.$kvTrackEvent('basket', 'Apply Kiva Card', 'Kiva Card successfully applied');
				}
			}).catch(error => {
				console.error(error);
				this.$emit('updating-totals', false);
			});
		},

		removeCredit(type, id) {
			this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: removeCreditByType,
				variables: {
					creditType: type,
					creditId: id || null
				}
			}).then(() => {
				this.$kvTrackEvent('basket', 'Kiva Card', 'Remove Kiva Card Success');
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

div.columns .kiva-card-entry-wrapper {
	max-width: rem-calc(800);
	margin: 0 auto;
}

.toggle-arrow {
	transition: transform 300ms ease;
	display: block;
	height: rem-calc(40);
	width: rem-calc(40);
	margin: 0 auto;
}

.accordion-title {
	font-weight: $global-weight-highlight;

	&:hover {
		cursor: pointer;
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
	margin-top: rem-calc(15);

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

.redemption-items {
	font-weight: $global-weight-highlight;
	margin: rem-calc(15) 0;
	font-size: rem-calc(18);
	white-space: nowrap;

	@include breakpoint(medium) {
		float: right;
		margin: 0 0 rem-calc(15) rem-calc(15);
	}

	@include breakpoint(large) {
		margin: rem-calc(15) 0 rem-calc(15) rem-calc(15);
	}

	li {
		list-style: none;
		padding: 0.1rem 0;
	}
}

.kiva-card-input {
	width: rem-calc(200);
	border: 1px solid $charcoal;
	color: $charcoal;
	border-radius: $button-radius;
	font-weight: 300;
	text-align: center;
	display: block;
	height: rem-calc(50);
	font-size: $medium-text-font-size;

	@include breakpoint(medium) {
		margin: rem-calc(15) 0;
	}

	@include breakpoint(large) {
		font-size: $normal-text-font-size;
		float: left;
		height: rem-calc(37);
		margin: rem-calc(15);
	}
}

.help-lightbox {
	margin: 1.2rem 0;

	@include breakpoint(large) {
		float: left;
	}
}

.remove-x {
	fill: $subtle-gray;
	width: 1.1rem;
	height: 1.1rem;
	cursor: pointer;
	vertical-align: middle;
	margin-top: -0.1rem;
}
</style>
