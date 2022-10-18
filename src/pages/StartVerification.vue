<template>
	<www-page class="start-verification-page">
		<kv-page-container>
			<kv-default-wrapper>
				<div class="tw-prose tw-text-center" data-testid="withdraw-verification-text">
					<template v-if="!sent">
						<h1>Email verification required</h1>
						<p>To ensure your safety, we added an extra layer of security.</p>
						<p>Once we verify your account, you can continue {{ process }}!</p>
						<kv-button
							data-testid="withdraw-send-verification"
							:state="sending ? 'loading' : ''"
							@click="send"
						>
							Send verification link
						</kv-button>
					</template>
					<template v-else>
						<h1>Email verification pending</h1>
						<p>
							We sent a validation link
							<span v-if="email" class="email fs-exclude">to {{ email }}</span>.
						</p>
						<p>After receiving the email, follow the link provided to continue {{ process }}.</p>
						<kv-button
							data-testid="withdraw-resend-verification"
							:state="sending ? 'loading' : ''"
							@click="send"
						>
							Resend email
						</kv-button>
						<p>
							<router-link to="/help/contact-us">
								Need help? Contact us
							</router-link>
						</p>
					</template>
				</div>
			</kv-default-wrapper>
		</kv-page-container>
	</www-page>
</template>

<script>
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/vue';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

function getFullPath(url = '/') {
	if (url.startsWith('/')) {
		return url;
	}
	const { pathname, search, hash } = new URL(url);
	return `${pathname}${search}${hash}`;
}

const getVerificationState = gql`
	query emailVerificationState {
		my {
			emailVerifiedRecently
			userAccount {
				id
				email
			}
		}
	}
`;

const startEmailVerification = gql`
	mutation startEmailVerification($doneUrl: String) {
		my {
			startEmailVerification(doneUrl: $doneUrl)
		}
	}
`;

export default {
	name: 'StartVerification',
	metaInfo: {
		title: 'Email Verification'
	},
	components: {
		KvButton,
		KvDefaultWrapper,
		KvPageContainer,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			doneUrl: '',
			email: '',
			process: '',
			sent: false,
			sending: false,
		};
	},
	apollo: {
		preFetch(config, client, { route, kvAuth0 }) {
			return client.query({ query: getVerificationState, fetchPolicy: 'network-only' })
				.then(result => {
					// Redirect to doneUrl if email has already been verified recently
					if (kvAuth0.isMfaAuthenticated() || result?.data?.my?.emailVerifiedRecently) {
						return Promise.reject({
							path: getFullPath(route.query.doneUrl || '/')
						});
					}
					return result;
				});
		},
		query: getVerificationState,
		result({ data }) {
			this.email = data?.my?.userAccount?.email || this.email || '';
		},
	},
	created() {
		const { doneUrl, process = '' } = this.$route.query;

		// Get the full path of the doneUrl if it is set
		if (doneUrl) {
			this.doneUrl = getFullPath(doneUrl);
		}

		// Get process from query params, stripping out everything except letters, numbers, whitespace, and quotes
		this.process = process.replace(/[^a-zA-Z0-9\s'"]+/g, '');
	},
	methods: {
		send() {
			this.sending = true;
			this.apollo.mutate({
				mutation: startEmailVerification,
				variables: {
					doneUrl: this.doneUrl || null,
				},
				awaitRefetchQueries: true,
				refetchQueries: [
					{ query: getVerificationState },
				],
			}).then(result => {
				this.sending = false;
				this.sent = true;
				if (result.error) {
					this.handleError(result.error);
				}
			}).catch(error => {
				this.sending = false;
				this.handleError(error);
			});
		},
		handleError(err) {
			console.error(err);
			this.$showTipMsg('There was a problem sending the verification email.', 'error');
			try {
				Sentry.captureException(err);
			} catch (e) {
				// no-op
			}
		},
	},
};
</script>
