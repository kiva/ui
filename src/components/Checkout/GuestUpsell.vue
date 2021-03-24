<template>
	<section class="guest-account-upsell hide-for-print">
		<h2 class="guest-account-upsell__headline">
			Before you go!
		</h2>
		<p v-if="borrowerName" class="guest-account-upsell__subhead">
			<template v-if="borrowerName">
				Get updates from {{ borrowerName }} and choose how to re-lend your money when they pay you back.
			</template>
			<template v-else>
				Get updates from the borrowers you support and choose how to re-lend your money when they pay you back.
			</template>
		</p>
		<form id="guestUpsellForm" action="." @submit.prevent.stop="submit">
			<kv-base-input name="firstName"
				class="fs-exclude"
				type="text"
				v-model.trim="firstName"
				:validation="$v.firstName"
			>
				First name
				<template #required>
					Enter first name.
				</template>
			</kv-base-input>
			<kv-base-input name="lastName"
				class="fs-exclude"
				type="text"
				v-model.trim="lastName"
				:validation="$v.lastName"
			>
				Last name
				<template #required>
					Enter last name.
				</template>
			</kv-base-input>
			<p v-if="serverError" class="guest-account-upsell__server-error">
				There was a problem when trying to create your account, please try again later.
			</p>
			<KvButton class="guest-account-upsell__claim-button smaller expanded" type="submit">
				Create my account
			</KvButton>
		</form>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import * as Sentry from '@sentry/browser';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import KvButton from '@/components/Kv/KvButton';
import KvBaseInput from '@/components/Kv/KvBaseInput';

export default {
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
	computed: {
		borrowerName() {
			return this.loans.length === 1 ? this.loans[0].name : '';
		},
	},
	methods: {
		submit() {
			this.serverError = false;
			this.$v.$touch();
			if (!this.$v.$invalid) {
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
					const resetUrl = result?.data?.my?.startGuestAccountClaim;
					if (!resetUrl) {
						throw new Error('Missing reset url');
					}
					window.location = resetUrl;
				}).catch(err => {
					this.serverError = true;
					const errors = Array.isArray(err) ? err : [err];
					errors.forEach(error => {
						console.error(error);
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

<style lang="scss" scoped>
@import 'settings';

.guest-account-upsell {
	padding: rem-calc(24);

	&__headline {
		font-weight: 600;
		@include medium-text();
	}

	&__claim-button {
		margin: 0;
	}

	&__server-error {
		color: $kiva-accent-red;
		font-weight: $global-weight-highlight;
		font-size: $small-text-font-size;
	}
}
</style>
