<template>
	<div v-show="required">
		<div
			class="tw-flex tw-justify-center"
			ref="captcha"
			data-testid="captcha-container"
		></div>
		<input type="hidden" name="captcha" :value="captchaValue">
	</div>
</template>

<script>
export default {
	name: 'ReCaptchaEnterprise',
	emits: ['update'],
	props: {
		required: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			instanceId: null,
			captchaValue: '',
		};
	},
	head: {
		script: [
			{
				src: 'https://www.google.com/recaptcha/enterprise.js?onload=recaptchaOnloadCallback&render=explicit',
				async: true,
				defer: true,
			},
		],
	},
	methods: {
		async loadRecaptcha() {
			if (typeof window !== 'undefined') {
				await window.recaptchaLoaded;
				const setValue = value => {
					this.captchaValue = value || '';
					this.$emit('update', this.captchaValue);
				};
				this.instanceId = window.grecaptcha?.enterprise?.render(this.$refs.captcha, {
					sitekey: this.$appConfig.grecaptchaSitekey,
					callback: setValue,
					'error-callback': () => setValue(),
					'expired-callback': () => setValue(),
				});
			}
		},
		reset() {
			if (this.instanceId !== null && typeof window !== 'undefined') {
				window.grecaptcha?.enterprise?.reset(this.instanceId);
			}
		},
		getResponse() {
			if (this.instanceId !== null && typeof window !== 'undefined') {
				return window.grecaptcha?.enterprise?.getResponse(this.instanceId);
			}
			return null;
		},
	},
	mounted() {
		if (this.required) {
			this.loadRecaptcha();
		}
	},
	watch: {
		required: {
			handler(value) {
				if (value && this.instanceId === null) {
					this.loadRecaptcha();
				}
			},
		},
	},
};
</script>
