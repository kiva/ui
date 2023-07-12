<template>
	<form
		id="guestUpsellForm"
		@submit.prevent.stop="submit"
	>
		<kv-base-input
			name="firstName"
			class="data-hj-suppress tw-mb-2"
			type="text"
			v-model.trim="firstName"
			:validation="$v.firstName"
		>
			First name
			<template #required>
				Enter first name.
			</template>
		</kv-base-input>
		<kv-base-input
			name="lastName"
			class="data-hj-suppress tw-mb-2"
			type="text"
			v-model.trim="lastName"
			:validation="$v.lastName"
		>
			Last name
			<template #required>
				Enter last name.
			</template>
		</kv-base-input>
		<p
			v-if="serverError"
			class="tw-text-danger tw-text-small tw-font-medium tw-mb-2"
		>
			There was a problem when trying to create your account, please try again later.
		</p>
		<kv-button class="tw-w-full" type="submit">
			Create my account
		</kv-button>
	</form>
</template>

<script>
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/vue';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import KvBaseInput from '@/components/Kv/KvBaseInput';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'GuestAccountCreation',
	components: {
		KvButton,
		KvBaseInput,
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [
		validationMixin,
	],
	validations: {
		firstName: {
			required,
		},
		lastName: {
			required,
		},
	},
	props: {
		loans: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			firstName: '',
			lastName: '',
			serverError: false,
		};
	},
	methods: {
		submit() {
			this.serverError = false;
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.$kvTrackEvent('post-checkout', 'click', 'create-guest-account');

				// will end up redirecting to password reset page.
				this.apollo.mutate({
					mutation: gql`mutation startGuestAccountClaim(
						$firstName: String!,
						$lastName: String!,
						$visitorId: String!
					) {
						general {
							startGuestAccountClaim(firstName: $firstName, lastName: $lastName, visitorId: $visitorId)
						}
					}`,
					variables: {
						firstName: this.firstName,
						lastName: this.lastName,
						visitorId: this.cookieStore.get('uiv') || ''
					},
				}).then(result => {
					if (result?.errors?.length > 0) {
						throw result.errors;
					}
					const resetUrl = result?.data?.general?.startGuestAccountClaim;
					if (!resetUrl) {
						throw new Error('Missing reset url');
					}
					window.location = resetUrl;
				}).catch(err => {
					this.serverError = true;
					const errors = Array.isArray(err) ? err : [err];
					this.$kvTrackEvent('post-checkout', 'fail', 'guest-account-claim', errors.toString());
					errors.forEach(error => {
						try {
							Sentry.withScope(scope => {
								scope.setTag('guest_checkout', true);
								scope.setTag('visitor_id', this.cookieStore.get('uiv') || 'none');
								Sentry.captureException(error);
							});
						} catch (e) {
							// no-op
						}
					});
				});
			}
		}
	},
};
</script>
