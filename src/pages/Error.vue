<template>
	<www-page class="ui-error-page">
		<kv-default-wrapper class="tw-text-center tw-prose">
			<template v-if="errorDescription === 'force_password_reset'">
				<h1>{{ messages.headline }}</h1>
				<p>{{ messages.reason }}</p>
				<p class="message" v-if="loginRedirectUrl">
					{{ messages.please }}
					<a :href="`${loginRedirectUrl}`">{{ messages.login }}</a>
					{{ messages.clickForgot }}
				</p>
			</template>
			<template v-else>
				<h1>Oh no, something went wrong!</h1>
				<h2 v-if="description">
					{{ description }}
				</h2>
				<p class="message" v-if="loginRedirectUrl">
					Please <a :href="`${loginRedirectUrl}`">try again.</a>
				</p>
			</template>
			<p>
				{{ messages.contact }}
				<a class="fs-exclude" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
			</p>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import WwwPage from '@/components/WwwFrame/WwwPage';
import logFormatter from '@/util/logFormatter';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';

export default {
	name: 'Error',
	inject: ['locale'],
	components: {
		WwwPage,
		KvDefaultWrapper,
	},
	metaInfo: {
		title: 'Error'
	},
	data() {
		return {
			errorCode: this.$route.query.error,
			errorDescription: this.$route.query.error_description,
			clientId: this.$route.query.client_id,
			lenderLogin: this.$route.query.lender_login !== '0',
		};
	},
	computed: {
		contactEmail() {
			return this.isPartnerLogin ? 'partnersupport@kiva.org' : 'contactus@kiva.org';
		},
		description() {
			if (this.errorDescription === 'Access expired.') {
				return 'The link emailed to you has expired.';
			}
			return this.errorDescription;
		},
		isPartnerLogin() {
			return /partners/i.test(this.loginRedirectUrl);
		},
		loginRedirectUrl() {
			return this.$appConfig.auth0.loginRedirectUrls[this.clientId];
		},
		messages() {
			const language = this.locale.substring(0, 2).toLowerCase();
			/* eslint-disable max-len */
			switch (language) {
				case 'es':
					return {
						headline: 'Nueva contraseña requerida',
						reason: 'Ha pasado un tiempo desde que lo hemos visto, entonces necesitamos que usted restablezca su contraseña.',
						please: 'Por favor,',
						login: 'vuelva a iniciar la sesión',
						clickForgot: 'y haga clic en "¿Olvidó su contraseña?" para continuar.',
						contact: 'Si nos necesita, siempre estamos disponibles en',
					};
				case 'fr':
					return {
						headline: 'Nouveau mot de passe requis',
						reason: 'Cela fait un moment que nous ne vous avons pas vu. Donc, nous avons besoin de vous pour réinitialiser votre mot de passe.',
						please: 'Veuillez',
						login: 'revenir à la connexion',
						clickForgot: 'et cliquez sur "Mot de passe oublié?" pour continuer.',
						contact: 'Si vous avez besoin de nous, nous sommes toujours disponibles à',
					};
				default:
					return {
						headline: 'New password required',
						reason: 'It\'s been a while since we\'ve seen you, so we need you to reset your password.',
						please: 'Please,',
						login: 'return to login',
						clickForgot: `and click "${this.forgotPasswordText}" to continue.`,
						contact: 'If you need us, we\'re always available at',
					};
			}
			/* eslint-enable max-len */
		},
		forgotPasswordText() {
			return this.lenderLogin ? 'Forgot your password?' : 'Don\'t remember your password?';
		}
	},
	created() {
		logFormatter(
			`Auth0 authentication error: ${this.errorCode}: ${this.errorDescription}`,
			'warn',
			{ ...this.$route.query }
		);
	},
};
</script>
