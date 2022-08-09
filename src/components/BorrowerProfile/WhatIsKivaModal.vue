<template>
	<section>
		<transition
			name="slide-out-bottom"
		>
			<kv-lightbox
				v-if="isLightboxVisible"
				:visible="isLightboxVisible"
				:data-testid="`bp-what-is-kiva-lightbox`"
				:title="title"
				@lightbox-closed="hideLightbox"
				class="tw-px-8"
			>
				<template #header>
					<h2 class="tw-text-h2 md:tw-text-center tw-mb-1">
						{{ title }}
					</h2>
					<div class="tw-mb-3">
						<p
							:data-testid="`bp-what-is-kiva-lightbox-description`"
							class="md:tw-text-center tw-text-subhead"
						>
							{{ description }}
						</p>
					</div>
					<h3 class="md:tw-hidden tw-text-action tw-mb-1">
						How it works
					</h3>
					<div class="tw-block md:tw-flex md:tw-gap-3 md:tw-px-2.5 md:tw-mx-4">
						<div class="section-container">
							<div class="tw-basis-1/3">
								<icon-lend
									class="section-container__icon"
								/>
							</div>
							<div class="section-container__info">
								<h3>Lend</h3>
								<p>100% of your money goes to the borrower</p>
							</div>
						</div>
						<div class="section-container">
							<div class="tw-basis-1/3">
								<icon-get-repaid
									class="section-container__icon"
								/>
							</div>
							<div class="section-container__info">
								<h3>Get repaid</h3>
								<p>As borrowers thrive they pay back your loan</p>
							</div>
						</div>
						<div class="section-container">
							<div class="tw-basis-1/3">
								<icon-auto-deposit
									class="section-container__icon"
								/>
							</div>
							<div class="section-container__info">
								<h3>Repeat</h3>
								<p>Relend to change even more lives</p>
							</div>
						</div>
					</div>
				</template>
				<kv-button
					@click="isLightboxVisible = false"
					v-kv-track-event="[
						'Borrower Profile',
						'click-modal-close',
						'Let\'s get started'
					]"
					class="tw-w-full md:tw-flex md:tw-justify-center md:tw-max-w-sm tw-mx-auto tw-mt-1 md:tw-mt-4 "
				>
					Let's get started
				</kv-button>
			</kv-lightbox>
		</transition>
	</section>
</template>

<script>

import IconAutoDeposit from '@/assets/icons/inline/auto-deposit.svg';
import IconLend from '@/assets/icons/inline/lend-modal.svg';
import IconGetRepaid from '@/assets/icons/inline/get-repaid.svg';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'WhatIsKivaModal',
	components: {
		KvLightbox,
		KvButton,
		IconAutoDeposit,
		IconLend,
		IconGetRepaid
	},
	data() {
		return {
			title: 'Welcome to Kiva! 💚',
			description: 'Lend as little as $25 to make a big differences in someone\'s life.',
			isLightboxVisible: true
		};
	},
	methods: {
		hideLightbox({ type }) {
			this.isLightboxVisible = false;
			if (type === 'close-x') {
				this.$kvTrackEvent('Borrower Profile', 'click-modal-close', 'close');
			} else if (type === 'background-click') {
				this.$kvTrackEvent('Borrower Profile', 'click-modal-outside', 'outside');
			}
			this.cookieStore.set('what-is-kiva-shown', true);
		}
	}
};
</script>

<style lang="postcss" scoped>
	@media only screen and (max-width: 600px) {
		.slide-out-bottom-leave-active {
			transition: all 0.5s ease-out;
		}

		.slide-out-bottom-leave-to {
			transform: translateY(70%);
		}
	}

	.section-container {
		@apply tw-flex tw-gap-1 tw-items-center md:tw-block md:tw-flex-1;
	}

	.section-container__icon {
		@apply tw-w-12 tw-h-12 tw-block tw-mx-auto tw-text-brand tw-bg-transparent;
	}

	.section-container__info {
		@apply tw-basis-2/3 md:tw-text-center;
	}

</style>
