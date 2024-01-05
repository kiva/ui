<template>
	<kv-page-container>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-pt-2 tw-mb-4 hide-for-print">
				<div class="container">
					<div
						class="tw-flex tw-justify-between tw-w-full"
					>
						<p class="tw-text-left tw-font-medium">
							5/12 loans funded
						</p>
						<div class="tw-flex tw-items-center tw-justify-center tw-relative">
							<kv-progress-circle
								class="tw-w-10 tw-z-2 tw-h-10"
								:stroke-width="20"
								:value="goalPercent"
								:arc-scale=".8"
								:rotate="36"
								:show-number="false"
							/>
							<div class="tw-absolute">
								<mail-icon class="tw-h-4.5 tw-w-4" />
							</div>
						</div>
						<p class="tw-text-right tw-font-medium">
							16 days remaining
						</p>
					</div>
					<div class="tw-mt-2 tw-mb-6">
						<h3>Challenge <span class="tw-text-eco-green-3">{{ goalPercent }}% complete</span></h3>
					</div>
					<div class="tw-flex tw-flex-col tw-items-center">
						<h2 class="tw-text-center tw-mb-2">
							We’ve got some fun rewards
							<span class="tw-text-brand">for teams who complete their challenges!</span>
							Would you like to be notified of these rewards?
						</h2>
						<kv-button
							:class="['notify-button',
								{'tw-pointer-events-none': addedToIterable }]"
							:state="buttonState"
							:variant="variant"
							@click="notify"
						>
							<check-mark v-if="addedToIterable" class="tw-text-white tw-mr-1" />
							<!-- <kv-icon class="tw-w-4 tw-h-4" name="checkmark" /> -->
							<span>{{ buttonCta }}</span>
						</kv-button>
					</div>
				</div>
			</div>
		</kv-grid>
	</kv-page-container>
</template>
<script>
import KvProgressCircle from '@/components/Kv/KvProgressCircle';
import MailIcon from '@/assets/icons/inline/thanks-mail.svg';
import KvIcon from '@/components/Kv/KvIcon';
import CheckMark from '@/assets/icons/inline/check-circle.svg';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'NotifyMe',
	inject: ['apollo'],
	components: {
		KvProgressCircle,
		MailIcon,
		KvIcon,
		CheckMark,
		KvButton,
		KvPageContainer,
		KvGrid
	},
	props: {
		email: {
			type: String,
			default: '',
		}
	},
	data() {
		return {
			goalPercent: 50,
			iterableListIdString: 'testing',
			addedToIterable: false,
			loading: false,
		};
	},
	computed: {
		buttonCta() {
			return this.addedToIterable ? 'You\'re all set' : 'Yes, notify me';
		},
		buttonState() {
			if (this.loading) return 'loading';
			if (this.addedToIterable) return 'success';
			return '';
		},
		variant() {
			return this.addedToIterable ? 'secondary' : 'primary';
		},
	},
	methods: {
		async notify() {
			this.loading = true;
			// eslint-disable-next-line max-len
			const response = await fetch(`//links.iterable.com/lists/publicAddGoalServiceForm?publicIdString=${this.iterableListIdString}`, {
				method: 'POST',
				body: new URLSearchParams({
					email: this.email,
				})
			});
			if (response.status === 200) {
				this.addedToIterable = true;
				this.$showTipMsg(`We will notify ${this.email} when the challenge is announced!`);
			} else {
				this.addedToIterable = true;
				this.loading = false;
				this.$showTipMsg('There was a problem. Please try again.', 'error');
			}
		}
	}
};
</script>

<style lang="postcss" scoped>
.notify-button >>> span {
  @apply tw-flex;
}

.container {
  @apply tw-flex tw-flex-col tw-items-center tw-w-full tw-bg-white tw-rounded tw-px-1.5 tw-pt-1.5 tw-pb-2.5;
}

</style>
