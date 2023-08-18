<template>
	<div class="kiva-card-entry-wrapper tw-flex">
		<div class="tw-mr-3">
			<button
				@click="toggleAccordion"
				data-testid="basket-code-entry-toggle-icon"
			>
				<kv-icon
					:class="{ flipped: open }"
					class="toggle-arrow"
					name="fat-chevron"
					:from-sprite="true"
				/>
			</button>
		</div>
		<div class="tw-w-full">
			<button
				class="tw-text-h3 tw-text-left accordion-title"
				@click="toggleAccordion"
				data-testid="basket-code-entry-toggle-text"
			>
				Have a Kiva Card?
			</button>
			<kv-expandable easing="ease-in-out">
				<div v-show="open" class="accordion-info tw-flex tw-w-full">
					<div class="tw-flex tw-flex-col tw-w-full lg:tw-w-2/3">
						<div class="tw-flex tw-flex-col md:tw-flex-row">
							<div class="tw-w-full md:tw-mr-4">
								<label for="kiva_card_input" class="tw-sr-only">Kiva Card Code</label>
								<kv-text-input
									id="kiva_card_input"
									data-testid="basket-code-entry-input"
									placeholder="ABCD-1234-EFGH-5678"
									class="kiva-card-input tw-w-full tw-mb-2"
									v-model="kivaCardCode"
									@keyup.enter.prevent="
										updateKivaCard('redemption_code')
									"
								/>
							</div>
							<div class="md:tw-w-2/4 md:tw-mr-4">
								<kv-button
									variant="secondary"
									@click="updateKivaCard('redemption_code')"
									data-testid="apply-card"
									class="tw-w-full"
								>
									Apply
								</kv-button>
							</div>
						</div>
						<div>
							<!-- This lightbox will be replaced with a Popper tip message. -->
							<button
								class="help-lightbox-trigger tw-text-link tw-text-left
								tw-font-medium tw-mt-3 md:tw-mt-0"
								@click="triggerDefaultLightbox"
								data-testid="basket-code-entry-help-text-button"
							>
								Need help?
							</button>
						</div>
						<kv-lightbox
							data-testid="basket-code-entry-lightbox"
							:visible="defaultLbVisible"
							@lightbox-closed="lightboxClosed"
							title="Where can I find my Kiva Card code?"
						>
							<p class="tw-mb-4">
								Kiva issues two types of Kiva Cards:
								print-it-yourself cards, and email delivery.
							</p>
							<p class="tw-mb-2">
								Print-it-yourself:
							</p>
							<img
								alt="print-kiva-card"
								class="tw-mb-6 tw-border tw-border-secondary"
								height="116"
								src="~@/assets/images/checkout/printcard_codelocation.jpg"
								width="450"
							>
							<p class="tw-mb-2">
								Email delivery:
							</p>
							<img
								alt="email-kiva-card"
								class="tw-mb-6 tw-border tw-border-secondary"
								height="199"
								src="~@/assets/images/checkout/emailcard_codelocation.jpg"
								width="450"
							>
						</kv-lightbox>

						<ul class="redemption-items">
							<li
								v-for="(credit, index) in credits"
								:key="index"
								:data-testid="`basket-code-entry-applied-credit-${index}`"
							>
								<span class="heading">Kiva Card value: </span>
								<span class="value">${{ credit.applied ? credit.applied : credit.amount }}</span>
								<button
									class="remove-wrapper"
									@click.prevent.stop="
										removeCredit(
											'redemption_code',
											credit.id
										)
									"
									:data-testid="`basket-code-entry-remove-applied-credit-${index}`"
								>
									<kv-icon
										class="remove-x tw-fill-current tw-text-tertiary"
										name="small-x"
										:from-sprite="true"
										title="Remove"
									/>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
import _forEach from 'lodash/forEach';
import KvIcon from '@/components/Kv/KvIcon';
import KvExpandable from '@/components/Kv/KvExpandable';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	name: 'KivaCardRedemption',
	components: {
		KvButton,
		KvIcon,
		KvExpandable,
		KvLightbox,
		KvTextInput,
	},
	inject: ['apollo'],
	props: {
		credits: {
			type: Array,
			default: () => [],
		},
		totals: {
			type: Object,
			default: () => {},
		},
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
		},
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
			this.apollo
				.mutate({
					mutation: addCreditByType,
					variables: {
						creditType: type,
						redemptionCode: this.kivaCardCode,
					},
				})
				.then(data => {
					if (data.errors) {
						_forEach(data.errors, ({ message }) => {
							this.$showTipMsg(message, 'error');
						});
						this.$emit('updating-totals', false);
					} else {
						this.$emit('refreshtotals', 'kiva-card-applied');
						this.$kvTrackEvent(
							'basket',
							'Apply Kiva Card',
							'Kiva Card successfully applied'
						);
					}
				})
				.catch(error => {
					console.error(error);
					this.$emit('updating-totals', false);
				});
		},

		removeCredit(type, id) {
			this.$emit('updating-totals', true);
			this.apollo
				.mutate({
					mutation: removeCreditByType,
					variables: {
						creditType: type,
						creditId: id || null,
					},
				})
				.then(() => {
					this.$kvTrackEvent(
						'basket',
						'Kiva Card',
						'Remove Kiva Card Success'
					);
					this.$emit('refreshtotals');
				})
				.catch(error => {
					console.error(error);
					this.$emit('updating-totals', false);
				});
		},
	},
};
</script>

<style lang='scss' scoped>
@import 'settings';

.toggle-arrow {
	transition: transform 300ms ease;
	display: block;
	height: rem-calc(30);
	width: rem-calc(20);
	margin-left: 9%;

	@media screen and (min-width: 851px) {
		margin-left: 18%;
	}
}

.flipped {
	transform: rotate(180deg);
}

.accordion-info {
	margin-top: 1rem;
	margin-bottom: 1rem;
}

.redemption-items {
	font-weight: $global-weight-highlight;
	margin: rem-calc(15) 0;
	white-space: nowrap;

	@include breakpoint(medium) {
		float: right;
		margin: 0 0 rem-calc(15);
	}

	@include breakpoint(large) {
		margin: rem-calc(15) 0;
	}

	li {
		padding: 0.1rem 0;
	}
}

.remove-x {
	width: 1.1rem;
	height: 1.1rem;
	vertical-align: middle;
	margin-top: -0.1rem;
}
</style>
