<template>
	<kv-settings-card title="Password">
		<template #content>
			<p class="tw-mb-4">
				Clicking this button will send you a verification email.
				As a final step in this process, you'll need to click the
				link in that email to successfully update your account password.
			</p>
			<kv-alert
				v-if="isPasswordRequestSuccess"
				class="alert"
				role="alert"
				variant="success"
				:can-close="true"
			>
				<b>
					Email has been sent to
					<span class="data-hj-suppress">{{ userEmail ? userEmail : 'the address on file' }}</span>
				</b>
			</kv-alert>
			<kv-alert
				v-if="isPasswordRequestFailure"
				class="alert"
				role="alert"
				variant="danger"
				:can-close="true"
			>
				There was a problem sending the password reset email
			</kv-alert>
			<kv-button
				@click="onClickRequestPassword"
				:state="isPasswordRequestPending ? 'disabled' : ''"
			>
				Send change password email
			</kv-button>
		</template>
	</kv-settings-card>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import { gql } from '@apollo/client';
import KvAlert from '@/components/Kv/KvAlert';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const userQuery = gql`query getUserEmail {
	my {
		userAccount {
			id
			email
		}
	}
}`;

const passwordResetMutation = gql`mutation passwordReset {
	my {
		sendChangePasswordEmail
	}
}`;

export default {
	name: 'Password',
	components: {
		KvAlert,
		KvButton,
		KvSettingsCard,
	},
	inject: ['apollo'],
	data() {
		return {
			userEmail: null,
			isPasswordRequestPending: false,
			isPasswordRequestSuccess: false,
			isPasswordRequestFailure: false
		};
	},
	mounted() {
		this.loadUserEmail(); // load user email async since it's not crucial
	},
	methods: {
		loadUserEmail() {
			this.apollo.query({
				query: userQuery
			}).then(({ data }) => {
				this.userEmail = data?.my?.userAccount?.email;
			}).catch(err => {
				console.error(err);
			});
		},
		async onClickRequestPassword() {
			this.isPasswordRequestPending = true;
			this.isPasswordRequestSuccess = false;
			this.isPasswordRequestFailure = false;
			try {
				await this.apollo.mutate({
					mutation: passwordResetMutation
				});
				this.isPasswordRequestSuccess = true;
			} catch (err) {
				console.error(err);
				this.isPasswordRequestFailure = true;
			}
			this.isPasswordRequestPending = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.alert {
	margin: 1rem 0 1.5rem;
}
</style>
