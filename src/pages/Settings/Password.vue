<template>
	<div class="row">
		<div class="column small-12 large-8">
			<kv-settings-card title="Password">
				<template v-slot:icon>
					<!-- TODO: THIS ICON IS A PLACEHOLDER
					Get correct icon assest from design, or remove this KvIcon -->
					<kv-icon
						class="icon"
						title="Auto-lending On"
						name="auto-icon-on"
					/>
				</template>
				<template v-slot:content>
					<p>
						Clicking this button will send you a verification email.
						As a final step in this process, you'll need to click the
						link in that email to successfully update your account password.
					</p>
					<kv-button
						class="smaller"
						@click.native="onClickChangePassword"
					>
						Send change password email {{ userEmail }}
					</kv-button>
				</template>
			</kv-settings-card>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import gql from 'graphql-tag';

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
	components: {
		KvButton,
		KvIcon,
		KvSettingsCard,
	},
	inject: ['kvAuth0', 'apollo'],
	data() {
		return {
			userEmail: null
		};
	},
	mounted() {
		this.apollo.query({
			query: userQuery
		}).then(({ data }) => {
			console.log(data);
			this.userEmail = data?.my?.userAccount?.email;
		}).catch(err => {
			console.error(err);
		});
	},
	methods: {
		onClickChangePassword() {
			console.log('change password');
			// console.log(this.kvAuth0);
			// const userEmail = this.kvAuth0.user.email;

			this.apollo.mutate({
				mutation: passwordResetMutation
			}).then(({ data }) => {
				console.log(data);
				this.$showTipMsg(`Password has been sent to ${this.userEmail}`); // TODO: What's the text here?
			}).catch(err => {
				console.error(err);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
