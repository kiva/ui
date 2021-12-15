<template>
	<kv-lightbox
		class="causes-cancel-lightbox"
		:visible="showCancelLightbox"
		:title="lightboxTitle"
		@lightbox-closed="closeLightbox"
	>
		<div class="causes-cancel-lightbox__content">
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
				class="expanded smaller rounded text-left" @click.native.prevent="trackEvent({
					label: `Complete cancellation`,
					property: `${cancelReason}`}); completeCancellation()"
			>
				Complete cancellation
				<kv-icon
					class="causes-cancel-lightbox__chevron causes-cancel-lightbox__chevron--white"
					name="fat-chevron"
					:from-sprite="true"
				/>
			</kv-button>
			<kv-button class="causes-cancel-lightbox__abort text-link"
				@click.native="trackEvent({
					label: `Wait! I don't want to cancel`,
					property: 'exit'}); closeLightbox()"
			>
				Wait! I don't want to cancel
			</kv-button>
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
			type: String,
			default: ''
		},
	},
	data() {
		return {
			cancelReason: '',
		};
	},
	computed: {
		lightboxTitle() {
			return 'We\'re sorry to see you go';
		},
		textAreaPlaceholder() {
			const basePlaceholder = 'Let us know why you’re leaving.';
			return basePlaceholder;
		}
	},
	methods: {
		closeLightbox() {
			// Track this event
			this.$kvTrackEvent('Causes', 'click-close-causes-cancel', 'close cancel causes');
			// Reset
			this.resetCancellationFlow();
			// Emit event
			this.$emit('abort-cancel');
		},
		completeCancellation() {
			this.$emit('confirm-cancel');
		},
		resetCancellationFlow() {
			this.cancelReason = '';
		},
		trackEvent({ label, property }) {
			this.$kvTrackEvent(
				'Causes',
				'cancel-causes-subscription',
				label,
				property,
				this.subscriptionId
			);
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.causes-cancel-lightbox {
	.button.text-left {
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
