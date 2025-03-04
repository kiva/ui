<template>
	<form
		id="guestUpsellForm"
		@submit.prevent.stop="submit"
	>
		<div class="data-hj-suppress tw-mb-2">
			<kv-base-input
				name="firstName"
				type="text"
				v-model.trim="firstName"
				:validation="v$.firstName"
			>
				First name
				<template #required>
					Enter first name.
				</template>
			</kv-base-input>
		</div>
		<div class="data-hj-suppress tw-mb-2">
			<kv-base-input
				name="lastName"
				type="text"
				v-model.trim="lastName"
				:validation="v$.lastName"
			>
				Last name
				<template #required>
					Enter last name.
				</template>
			</kv-base-input>
		</div>
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
import { gql } from 'graphql-tag';
import * as Sentry from '@sentry/vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import KvBaseInput from '#src/components/Kv/KvBaseInput';
import { KvButton } from '@kiva/kv-components';

export default {
	name: 'GuestAccountCreation',
	components: {
		KvButton,
		KvBaseInput,
	},
	inject: ['apollo', 'cookieStore'],
	validations() {
		return {
			firstName: {
				required,
			},
			lastName: {
				required,
			},
		};
	},
	props: {
		loans: {
			type: Array,
			default: () => [],
		},
		eventCategory: {
			type: String,
			default: 'post-checkout'
		},
		eventLabel: {
			type: String,
			default: 'create-guest-account'
		},
		eventProperty: {
			type: String,
			default: ''
		},
		eventValue: {
			type: Number,
			default: 0
		},
		guestUsername: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			firstName: '',
			lastName: '',
			serverError: false,
		};
	},
	setup() { return { v$: useVuelidate() }; },
	methods: {
		submit() {
			this.serverError = false;
			this.v$.$touch();
			if (!this.v$.$invalid) {
				this.$kvTrackEvent(
					this.eventCategory,
					'click',
					this.eventLabel,
					this.eventProperty,
					this.eventValue ? this.eventValue : null
				);

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
					let resetUrl = result?.data?.general?.startGuestAccountClaim;
					if (!resetUrl) {
						throw new Error('Missing reset url');
					}
					if (this.guestUsername) {
						resetUrl += `&username=${encodeURIComponent(this.guestUsername)}`;
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
