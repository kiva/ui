<template>
	<kv-lightbox
		class="mg-cancel-lightbox"
		:visible="showCancelLightbox"
		:title="lightboxTitle"
		@lightbox-closed="closeLightbox"
	>
		<div class="mg-cancel-lightbox__content">
			<transition name="kv-slide-left" mode="out-in">
				<!-- Step 1 -->
				<div v-if="currentStep === '1'" key="1">
					<p class="mg-cancel-lightbox__text tw-mb-4">
						We’d love to know why you are canceling Monthly Good by answering a few questions.
					</p>
					<kv-button
						class="tw-w-full tw-mb-2"
						variant="secondary"
						@click="trackEvent({
								label: `monthly good cancel ; It's too expensive`,
								property: 'cancel reason ; start_amount'});
							goToStep('2-expensive')"
					>
						It's too expensive
					</kv-button>
					<kv-button
						class="tw-w-full tw-mb-2"
						variant="secondary"
						@click="trackEvent({
							label: `monthly good cancel ; I want to choose each loan`,
							property: 'cancel reason ; start_category'}); goToStep('2-choose')"
					>
						I want to choose each loan
					</kv-button>
					<kv-button
						class="tw-w-full tw-mb-2"
						variant="secondary"
						@click="trackEvent({
							label: `monthly good cancel ; There's another reason`,
							property: 'cancel reason ; start_other'}); goToStep('3-reason')"
					>
						There's another reason
					</kv-button>
					<button
						class="mg-cancel-lightbox__abort tw-text-link tw-font-medium"
						@click="trackEvent({
							label: `monthly good cancel ; Wait! I don't want to cancel`,
							property: 'exit'}); closeLightbox()"
					>
						Wait! I don't want to cancel
					</button>
				</div>
				<!-- Step 2 -->
				<div v-if="currentStep === '2-expensive'" key="2-expensive">
					<p class="mg-cancel-lightbox__text tw-mb-4">
						You can change your monthly contribution to as little as $5 a month at any time.
					</p>
					<kv-button
						class="tw-w-full tw-mb-2"
						@click="trackEvent({
							label: `monthly good cancel ; Change contribution`,
							property: 'cancel reason ; amount_change'}); changeContribution()"
					>
						Change contribution
					</kv-button>
					<kv-button
						class="tw-w-full"
						variant="secondary"
						@click.native.prevent="trackEvent({
							label: `monthly good cancel ; Continue cancellation`,
							property: 'cancel reason ; amount_other'}); goToStep('3-expensive')"
					>
						Continue cancellation
					</kv-button>
				</div>
				<div v-if="currentStep === '2-choose'" key="2-choose">
					<p class="mg-cancel-lightbox__text tw-mb-4">
						You can change lending categories at any time to better fit the causes you support.
					</p>
					<kv-button
						class="tw-w-full tw-mb-2"
						@click="trackEvent({
							label: `monthly good cancel ; Edit my category`,
							property: 'cancel reason ; category_change'}); changeContribution()"
					>
						Edit my category
					</kv-button>
					<kv-button
						class="tw-w-full tw-mb-2"
						variant="secondary"
						@click="trackEvent({
							label: `monthly good cancel ; These aren't causes I want to support`,
							property: 'cancel reason ; category_alignment'}); changeContribution()"
					>
						These aren't causes I want to support
					</kv-button>
					<kv-button
						class="tw-w-full tw-mb-2"
						variant="secondary"
						@click="trackEvent({
							label: `monthly good cancel ; Continue cancellation`,
							property: 'cancel reason ; category_other'}); goToStep('3-choose-b')"
					>
						Continue cancellation
					</kv-button>
				</div>
				<!-- Step 3 -->
				<!-- eslint-disable-next-line max-len -->
				<div v-if="currentStep === '3-reason' || currentStep === '3-expensive' || currentStep === '3-choose-a' || currentStep === '3-choose-b'" key="3">
					<label>
						<textarea
							class="
								tw-w-full
								tw-p-2
								tw-mb-4
								tw-border tw-border-tertiary
								tw-rounded-sm
								tw-appearance-none
								tw-text-base
								tw-bg-primary
								tw-ring-inset
								focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-action focus:tw-border-transparent
							"
							name="reasonTextArea"
							rows="8"
							:placeholder="textAreaPlaceholder"
							maxlength="2500"
							v-model="cancelReason"
						></textarea>
					</label>
					<kv-button
						class="tw-w-full"
						@click="trackEvent({
							label: `monthly good cancel ; Continue cancellation`,
							property: `cancel submit ; ${cancelReason}`}); goToStep('4-confirm')"
					>
						Continue cancellation
					</kv-button>
				</div>
				<!-- Step 3 -->
				<!-- eslint-disable-next-line max-len -->
				<div v-if="currentStep === '4-confirm'" key="4">
					<p class="tw-mb-3">
						Are you sure?
						<span>
							<span v-if="subMonthsCount">
								In the <span class="tw-font-medium">{{ numberOfMonths }}</span>
							</span>
							<span v-else>
								Since
							</span>
							you’ve been a subscriber, you’ve made
							<span class="tw-font-medium"> {{ numberOfLoans }}</span> and have changed lives!
						</span>
					</p>
					<div class="tw-flex tw-justify-end tw-gap-2">
						<kv-button
							@click="trackEvent({
								label: `monthly good cancel ; cancel`,
								property: 'confirm cancellation'
							}); closeLightbox()"
							variant="secondary"
						>
							Cancel
						</kv-button>
						<kv-button
							@click="trackEvent({
								label: `monthly good cancel ; Complete cancellation`,
								property: `cancel submit ; ${cancelReason}`
							}); completeCancellation()"
						>
							Confirm
						</kv-button>
					</div>
				</div>
			</transition>
		</div>
	</kv-lightbox>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	name: 'SubscriptionsMonthlyGoodCancellationFlow',
	inject: ['apollo'],
	components: {
		KvButton,
		KvLightbox,
	},
	props: {
		showCancelLightbox: {
			type: Boolean,
			default: false
		},
		subscriptionId: {
			type: Number,
			default: null
		},
		subMonthsCount: {
			type: Number,
			default: 0
		},
		subsLoans: {
			type: Number,
			default: 0
		},
	},
	data() {
		return {
			currentStep: '1',
			cancelReason: '',
		};
	},
	computed: {
		numberOfMonths() {
			return `${this.subMonthsCount} month${this.subMonthsCount > 1 ? 's' : ''}`;
		},
		numberOfLoans() {
			return `${this.subsLoans} loan${this.subsLoans > 1 ? 's' : ''}`;
		},
		lightboxTitle() {
			if (this.currentStep.includes('expensive')) {
				return 'It\'s too expensive';
			}
			if (this.currentStep.includes('choose')) {
				return 'I want to choose each loan';
			}
			if (this.currentStep.includes('reason')) {
				return 'Sorry to see you go';
			}
			if (this.currentStep.includes('confirm')) {
				return 'Confirm cancellation';
			}
			return 'We\'re sorry to see you go';
		},
		textAreaPlaceholder() {
			const basePlaceholder = 'Let us know why you’re leaving.\n\n';
			if (this.currentStep.includes('expensive')) {
				return `${basePlaceholder}Ex: I would rather contribute bi-monthly or less frequently.`;
			}
			if (this.currentStep.includes('choose-a')) {
				return `${basePlaceholder}Ex: I want to be able to refine the categories.`;
			}
			if (this.currentStep.includes('choose-b')) {
				// eslint-disable-next-line max-len
				return `${basePlaceholder}Ex: I’d like to contribute automatically but have the option to target a specific loan.`;
			}
			if (this.currentStep.includes('reason')) {
				return `${basePlaceholder}`;
			}
			return basePlaceholder;
		}
	},
	methods: {
		changeContribution() {
			this.$emit('modify-cancel');
		},
		goToStep(step) {
			this.currentStep = step;
		},
		closeLightbox() {
			// Track this event
			this.$kvTrackEvent('monthlyGood', 'click-close-monthly-good', 'close cancel monthly good');
			// Reset
			this.resetCancellationFlow();
			// Emit event
			this.$emit('abort-cancel');
		},
		completeCancellation() {
			this.$emit('confirm-cancel');
		},
		resetCancellationFlow() {
			this.currentStep = '1';
			this.cancelReason = '';
		},
		trackEvent({ label, property }) {
			// check for and use snowplow directly where the 4th param is a property
			// snowplow API: snowplow('trackStructEvent', category, action, label, property, value);
			if (typeof window !== 'undefined' && typeof snowplow === 'function') {
				window.snowplow(
					'trackStructEvent',
					'monthlyGood',
					'select_action',
					label,
					property,
					this.subscriptionId
				);
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.mg-cancel-lightbox {
	&__content {
		overflow: hidden;
		max-width: 100%;

		@include breakpoint('large') {
			width: rem-calc(530);
		}

		@include breakpoint('xxlarge') {
			width: rem-calc(620);
		}
	}

	&__text {
		@include breakpoint('medium') {
			width: 80%;
		}
	}

	&__chevron {
		width: 1rem;
		height: 1rem;
		transform: rotate(-90deg);
		float: right;
		margin-top: 0.15rem;
		fill: $black;

		&--white {
			fill: $white;
		}
	}

	&__abort {
		margin: 0 auto;
		display: block;
		padding: 0.65rem;
		margin-top: 0.5rem;
	}

	textarea {
		border-radius: rem-calc(10);
		border: 1px solid $black;
	}
}
</style>
