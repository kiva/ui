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
					<p class="mg-cancel-lightbox__text">
						We’d love to know why you are canceling Monthly Good by answering a few questions.
					</p>
					<kv-button
						class="expanded secondary rounded tw-text-left"
						@click.native.prevent="trackEvent({
								label: `monthly good cancel ; It's too expensive`,
								property: 'cancel reason ; start_amount'});
							goToStep('2-expensive')"
					>
						It's too expensive
						<kv-icon
							class="mg-cancel-lightbox__chevron"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
					<kv-button
						class="expanded secondary rounded tw-text-left"
						@click.native.prevent="trackEvent({
							label: `monthly good cancel ; I want to choose each loan`,
							property: 'cancel reason ; start_category'}); goToStep('2-choose')"
					>
						I want to choose each loan
						<kv-icon
							class="mg-cancel-lightbox__chevron"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
					<kv-button
						class="expanded secondary rounded tw-text-left"
						@click.native.prevent="trackEvent({
							label: `monthly good cancel ; There's another reason`,
							property: 'cancel reason ; start_other'}); goToStep('3-reason')"
					>
						There's another reason
						<kv-icon
							class="mg-cancel-lightbox__chevron"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
					<kv-button class="mg-cancel-lightbox__abort text-link"
						@click.native="trackEvent({
							label: `monthly good cancel ; Wait! I don't want to cancel`,
							property: 'exit'}); closeLightbox()"
					>
						Wait! I don't want to cancel
					</kv-button>
				</div>
				<!-- Step 2 -->
				<div v-if="currentStep === '2-expensive'" key="2-expensive">
					<p class="mg-cancel-lightbox__text">
						You can change your monthly contribution to as little as $5 a month at any time.
					</p>
					<kv-button
						class="expanded smaller rounded tw-text-left" @click.native.prevent="trackEvent({
							label: `monthly good cancel ; Change contribution`,
							property: 'cancel reason ; amount_change'}); changeContribution()"
					>
						Change contribution
						<kv-icon
							class="mg-cancel-lightbox__chevron mg-cancel-lightbox__chevron--white"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
					<kv-button
						class="expanded secondary rounded tw-text-left" @click.native.prevent="trackEvent({
							label: `monthly good cancel ; Continue cancellation`,
							property: 'cancel reason ; amount_other'}); goToStep('3-expensive')"
					>
						Continue cancellation
						<kv-icon
							class="mg-cancel-lightbox__chevron"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
				</div>
				<div v-if="currentStep === '2-choose'" key="2-choose">
					<p class="mg-cancel-lightbox__text">
						You can change lending categories at any time to better fit the causes you support.
					</p>
					<kv-button
						class="expanded smaller rounded tw-text-left" @click.native.prevent="trackEvent({
							label: `monthly good cancel ; Edit my category`,
							property: 'cancel reason ; category_change'}); changeContribution()"
					>
						Edit my category
						<kv-icon
							class="mg-cancel-lightbox__chevron mg-cancel-lightbox__chevron--white"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
					<kv-button
						class="expanded secondary rounded tw-text-left" @click.native.prevent="trackEvent({
							label: `monthly good cancel ; These aren't causes I want to support`,
							property: 'cancel reason ; category_alignment'}); goToStep('3-choose-a')"
					>
						These aren't causes I want to support
						<kv-icon
							class="mg-cancel-lightbox__chevron"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
					<kv-button
						class="expanded secondary rounded tw-text-left" @click.native.prevent="trackEvent({
							label: `monthly good cancel ; Continue cancellation`,
							property: 'cancel reason ; category_other'}); goToStep('3-choose-b')"
					>
						Continue cancellation
						<kv-icon
							class="mg-cancel-lightbox__chevron"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
				</div>
				<!-- Step 3 -->
				<!-- eslint-disable-next-line max-len -->
				<div v-if="currentStep === '3-reason' || currentStep === '3-expensive' || currentStep === '3-choose-a' || currentStep === '3-choose-b'" key="3">
					<label>
						<textarea
							name="reasonTextArea"
							rows="8"
							:placeholder="textAreaPlaceholder"
							maxlength="2500"
							v-model="cancelReason"
						></textarea>
					</label>
					<kv-button
						class="expanded smaller rounded tw-text-left" @click.native.prevent="trackEvent({
							label: `monthly good cancel ; Complete cancellation`,
							property: `cancel submit ; ${cancelReason}`}); completeCancellation()"
					>
						Complete cancellation
						<kv-icon
							class="mg-cancel-lightbox__chevron mg-cancel-lightbox__chevron--white"
							name="fat-chevron"
							:from-sprite="true"
						/>
					</kv-button>
				</div>
			</transition>
		</div>
	</kv-lightbox>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		KvIcon,
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
	},
	data() {
		return {
			currentStep: '1',
			cancelReason: '',
		};
	},
	computed: {
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
	.button.tw-text-left {
		text-align: left;
	}

	&__content {
		overflow: hidden;
		max-width: 100%;
		margin: 1.5rem 0 0;

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
