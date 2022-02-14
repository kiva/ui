<template>
	<div>
		<kv-lightbox
			:visible="showLightbox && isLightboxVisible"
			@lightbox-closed="closeLightbox"
			title="Personalized Monthly Good"
		>
			<template #header>
				<h2 v-if="step === 'join'" class="tw-sr-only">
					Personalized monthly lending is coming soon
				</h2>
				<h2 v-if="step === 'thanks'" class="tw-sr-only">
					Thanks!
				</h2>
			</template>

			<div
				v-if="showSignUp"
				class="tw-text-center tw-w-full tw-py-6 tw-px-1 md:tw-px-10 md:tw-pt-4 md:tw-pb-6"
				style="max-width: 500px;"
			>
				<h2 class="tw-mb-2">
					Personalized monthly lending is coming soon
				</h2>
				<p class="tw-mb-2">
					Enter your email to stay up to date with the future of monthly lending.
				</p>
				<form
					name="iterable_optin"
					class="tw-mb-2"
					style="max-width: 350px;"
					@submit.prevent="submitForm"
					novalidate
				>
					<div class="tw-mb-2">
						<label class="tw-sr-only" for="email">Email</label>
						<kv-text-input
							id="email"
							placeholder="Enter your email"
							class="fs-exclude tw-w-full"
							v-model="email"
							:valid="!$v.email.$error"
						>
							<template #error v-if="$v.email.$dirty && $v.email.$error">
								Valid email required
							</template>
						</kv-text-input>
					</div>

					<div class="tw-text-center">
						<kv-button
							type="submit"
							:state="$v.email.$invalid ? 'disabled' : ''"
							class="tw-w-full"
							v-kv-track-event="[
								'MonthlyGood',
								'click-personalized-MG-false-door-cta',
								'Stay up to date'
							]"
						>
							Stay up to date
						</kv-button>
					</div>
				</form>
				<p class="tw-text-h4">
					Coming in 2022!
				</p>
			</div>

			<!-- Thank You -->
			<div
				v-if="!showSignUp"
				class="tw-text-center tw-w-full tw-py-6 tw-px-1 md:tw-px-10 md:tw-pt-4 md:tw-pb-6"
				style="max-width: 500px;"
			>
				<h2 class="tw-mb-2">
					Thanks!
				</h2>
				<p class="tw-mb-2">
					Personalized lending is not available yet, but you can still
					continue signing up for Monthly Good if you’re interested in lending every month.
				</p>
				<!-- to="/monthlygood/setup" -->
				<kv-button
					class="tw-w-full tw-mb-2"
					style="max-width: 350px;"
					@click="continueToMGSetup"
					v-kv-track-event="[
						'MonthlyGood',
						'click-personalized-MG-thanks-cta',
						'Continue to monthly good setup'
					]"
				>
					Continue to Monthly Good setup
				</kv-button>
				<kv-button
					variant="secondary"
					to="/lend-by-category"
					class="tw-w-full tw-mb-2"
					style="max-width: 350px;"
					v-kv-track-event="[
						'MonthlyGood',
						'click-personalized-MG-thanks-cta',
						'Go to lending home'
					]"
				>
					Browse loans
				</kv-button>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	mixins: [validationMixin],
	validations: {
		email: {
			required,
			email,
		},
	},
	components: {
		KvButton,
		KvLightbox,
		KvTextInput,
	},
	props: {
		showLightbox: {
			type: Boolean,
			default: false,
		},
		amount: {
			type: Number,
			default: 25,
		}
	},
	data() {
		return {
			email: null,
			isLightboxVisible: false,
			step: 'join',
		};
	},
	computed: {
		iterableListIdString() {
			const isProd = window.location.hostname === 'www.kiva.org';
			return isProd ? '04809f13-4db5-4caf-8b2c-2dca4bcd78f3' : 'b96c5004-a0e7-40d6-b8c6-3326875cc536';
		},
		showSignUp() {
			return this.step === 'join';
		},
	},
	watch: {
		showLightbox(next, prev) {
			if (next !== prev) {
				this.isLightboxVisible = next;
				if (next === true) {
					this.trackShowLightbox();
				}
			}
		}
	},
	methods: {
		closeLightbox() {
			this.isLightboxVisible = false;
			this.$kvTrackEvent('MonthlyGood', 'click-personalized-MG-false-door-x', 'Close MG Personalized lightbox');
			this.$emit('hide-lightbox');
		},
		async submitForm() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.$kvTrackEvent(
					'MonthlyGood',
					'click-Stay-up-to-date-submit-form',
					'Stay up to date'
				);
				// eslint-disable-next-line max-len
				const response = await fetch(`//links.iterable.com/lists/publicAddSubscriberForm?publicIdString=${this.iterableListIdString}`, {
					method: 'POST',
					body: new URLSearchParams({
						email: this.email,
					})
				});
				if (response.status === 200) {
					this.step = 'thanks';
					this.trackShowLightbox();
				} else {
					this.$showTipMsg('An Error has occurred. Please refresh the page and try again.', 'error');
				}
			}
		},
		trackShowLightbox() {
			if (this.step === 'join') {
				this.$kvTrackEvent(
					'MonthlyGood',
					'show-personalized-MG-false-door-lightbox',
					'view-coming-soon-screen'
				);
			} else {
				this.$kvTrackEvent(
					'MonthlyGood',
					'show-personalized-MG-false-door-lightbox',
					'view-thanks-screen'
				);
			}
		},
		continueToMGSetup() {
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.amount,
				}
			});
		}
	},
};
</script>
