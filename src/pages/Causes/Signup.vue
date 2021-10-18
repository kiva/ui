<template>
	<article class="tw-relative">
		<kv-page-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
			<kv-grid class="tw-grid-cols-12">
				<div :class="[
					'tw-px-1',
					'tw-mb-6',
					'tw-col-span-12',
					'md:tw-col-span-8',
					'md:tw-col-start-3',
					'lg:tw-col-span-6',
					'lg:tw-col-start-4'
				]"
				>
					<!-- Sign Up Form -->
					<div v-if="step === 'join'">
						<img
							class="tw-h-16 tw-w-16 tw-mx-auto tw-mb-4"
							:src="causesIconImgRequire(`./heart-icon.svg`)"
						>
						<h1 class="tw-text-center">
							Get on the list!
						</h1>
						<h3 class="tw-text-secondary tw-mt-3 tw-text-center tw-px-2.5">
							We’re still building the app. If it looks exciting, join our waiting list.
						</h3>
						<!-- Iterable Form Code -->
						<form
							name="iterable_optin"
							class="tw-mt-3"
							@submit.prevent="submitForm"
							novalidate
						>
							<label class="tw-sr-only" for="email">Street Address</label>
							<kv-text-input
								id="email"
								placeholder="Enter your email"
								class="tw-w-full"
								v-model="email"
								:valid="!$v.email.$error"
							>
								>
								<template #error v-if="$v.email.$dirty && $v.email.$error">
									Valid email required
								</template>
							</kv-text-input>

							<p class="tw-mt-2 tw-text-small">
								Please send me an email me when the app is available.
							</p>

							<div class="tw-text-center">
								<kv-button
									type="submit"
									:state="$v.email.$invalid ? 'disabled' : ''"
									class="tw-w-full md:tw-w-auto tw-mt-4 tw-mb-4 tw-mx-auto"
									v-kv-track-event="[
										'Causes',
										'Sign Up',
										'Join the waiting list'
									]"
								>
									Join the waiting list
								</kv-button>
							</div>
						</form>
					</div>

					<!-- Thank You -->
					<div v-if="step === 'thanks'">
						<img
							class="tw-h-16 tw-w-16 tw-mx-auto tw-mb-4"
							:src="causesIconImgRequire(`./mail-icon.svg`)"
						>
						<h1 class="tw-text-center">
							We got it!
						</h1>
						<h3 class="tw-text-secondary tw-mt-3 tw-text-center tw-px-2.5">
							You’ll hear from us when the app is ready to use.
						</h3>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</article>
</template>

<script>

import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

const causesIconImgRequire = require.context('@/assets/images/causes-icons/', true);

export default {
	components: {
		KvButton,
		KvGrid,
		KvPageContainer,
		KvTextInput,
	},
	metaInfo: {
		title: 'Get Started',
	},
	mixins: [validationMixin],
	validations: {
		email: {
			required,
			email,
		},
	},
	data() {
		return {
			email: null,
			step: 'join',
			causesIconImgRequire,
		};
	},
	inject: ['apollo'],
	methods: {
		async submitForm() {
			const isProd = window.location.hostname === 'www.kiva.org';
			const iterableListIdString = isProd
				? '1a075918-42c4-49f8-a3e9-e797dcf7c9b4'
				: 'bacb00cb-ae81-4ab6-8981-b4fafb2026ce';

			this.$v.$touch();
			if (!this.$v.$invalid) {
				// Track facebook event
				if (typeof window !== 'undefined' && typeof fbq === 'function') {
					window.fbq('track', 'Contact');
				}

				// eslint-disable-next-line max-len
				const response = await fetch(`//links.iterable.com/lists/publicAddSubscriberForm?publicIdString=${iterableListIdString}`, {
					method: 'POST',
					body: new URLSearchParams({
						email: this.email,
					})
				});
				if (response.status === 200) {
					this.step = 'thanks';
				} else {
					this.$showTipMsg('An Error has occured. Please refresh the page and try again.', 'error');
				}
			}
		}
	},
};
</script>

<style lang="scss">
</style>
