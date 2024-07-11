<template>
	<div>
		<fieldset
			@input="event => $emit('update:modelValue', event.target.value)"
			class="tw-flex tw-flex-col tw-gap-2 tw-mt-1 tw-mb-2 tw-text-small"
		>
			<kv-radio
				value="on"
				v-model="selectedComms"
				name="newsConsent"
				v-kv-track-event="[
					trackingCategory,
					'click',
					'marketing-updates',
					// eslint-disable-next-line max-len
					'Send me updates from people I\'ve funded, my impact, and other ways I can help.',
				]"
				:class="{'radio-error': $v.selectedComms.$error}"
			>
				<!-- eslint-disable-next-line max-len -->
				Send me updates from people I've funded, my impact, and other ways I can help.
			</kv-radio>
			<kv-radio
				value="off"
				name="newsConsent"
				v-model="selectedComms"
				:class="{'radio-error': $v.selectedComms.$error}"
				v-kv-track-event="[
					trackingCategory,
					'click',
					'marketing-updates',
					// eslint-disable-next-line max-len
					'No, I don\'t want updates about my borrower(s) progress or other relevant loans.',
				]"
			>
				<!-- eslint-disable-next-line max-len -->
				No, I don't want updates about my borrower(s) progress or other relevant loans.
			</kv-radio>
		</fieldset>
		<p
			v-if="$v.selectedComms.$error"
			class="input-error tw-text-danger tw-text-base tw-mb-2 tw-text-small"
		>
			Choose your communication preferences.
		</p>
		<p
			v-if="selectedComms === '0'"
			class="tw-border-brand-200 tw-border tw-bg-brand-100 tw-p-1 tw-rounded tw-text-small tw-mb-2"
		>
			Can we ask you to reconsider? This borrower and others like them will need your
			help to change their lives. You can unsubscribe at any time.
		</p>
		<p class="tw-text-small">
			By completing your {{ isCheckout ? 'loan' : 'account' }}, you agree to Kiva’s <a
				:href="`https://${this.$appConfig.host}/legal/terms`"
				target="_blank"
				class="tw-underline"
				title="Open Terms of Use in a new window"
			>Terms of Use</a>
			and
			<a
				:href="`https://${this.$appConfig.host}/legal/privacy`"
				target="_blank"
				class="tw-underline"
				title="Open Privacy Policy in a new window"
			>Privacy Policy</a>.
		</p>
	</div>
</template>

<script>
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';

export default {
	name: 'UserUpdatesPreference',
	components: {
		KvRadio,
	},
	props: {
		trackingCategory: {
			type: String,
			required: true,
		},
		isCheckout: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			selectedComms: '',
		};
	},
	emits: ['update:modelValue'],
	inject: ['$v'],
};
</script>

<style lang="postcss" scoped>

.radio-error >>> label > div {
	@apply tw-border-danger-highlight;
}

</style>
