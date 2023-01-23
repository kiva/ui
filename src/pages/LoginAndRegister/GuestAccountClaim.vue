<template>
	<system-page>
		<div class="page-content" style="max-width: 20rem;">
			<h1 class="tw-text-h2 tw-mb-2">
				One last thing!
			</h1>
			<p class="tw-mb-4">
				To finish creating your account, please enter your first and last name below.
			</p>
			<form id="guestAccountClaimForm" action="." @submit.prevent.stop="claimGuestAccount" class="tw-text-left">
				<kv-base-input
					name="firstName"
					class="data-hj-suppress tw-w-full tw-mb-4"
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
					class="data-hj-suppress tw-w-full tw-mb-4"
					type="text"
					v-model.trim="lastName"
					:validation="$v.lastName"
				>
					Last name
					<template #required>
						Enter last name.
					</template>
				</kv-base-input>
				<kv-button
					class="claim-button tw-w-full"
					type="submit"
				>
					Done
				</kv-button>
			</form>
		</div>
	</system-page>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import SystemPage from '@/components/SystemFrame/SystemPage';
import KvBaseInput from '@/components/Kv/KvBaseInput';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'GuestAccountClaim',
	metaInfo() {
		return {
			title: 'Claim account'
		};
	},
	components: {
		SystemPage,
		KvButton,
		KvBaseInput,
	},
	inject: ['apollo'],
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
	data() {
		return {
			firstName: '',
			lastName: '',
		};
	},
	methods: {
		claimGuestAccount() {
			this.$kvTrackEvent('Login', 'click-guest-enter-name-cta', 'Done');
			this.$v.$touch();

			if (!this.$v.$invalid) {
				const params = [
					`firstName=${encodeURIComponent(this.firstName)}`,
					`lastName=${encodeURIComponent(this.lastName)}`,
					`state=${this.$route.query.state}`
				].join('&');
				// eslint-disable-next-line max-len
				this.$kvTrackEvent('Register', 'guest-account-registration-success', undefined, undefined, undefined, () => {
					window.location = `https://${this.$appConfig.auth0.domain}/continue?${params}`;
				});
			} else {
				this.$kvTrackEvent('Login', 'error-guest-enter-name-cta', [this.$v.firstName, this.$v.lastName]);
			}
		}
	},

};
</script>
