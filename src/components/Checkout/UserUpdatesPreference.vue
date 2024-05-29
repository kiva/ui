<template>
	<div>
		<fieldset
			@input="event => $emit('update:modelValue', event.target.value)"
			class="tw-flex tw-flex-col tw-gap-2 tw-mt-1 tw-mb-2 tw-text-small"
		>
			<kv-radio
				value="1"
				v-model="selectedComms"
				name="reportComms"
				v-kv-track-event="[
					'basket',
					'click',
					'marketing-updates',
					// eslint-disable-next-line max-len
					'Receive email updates from Kiva (including borrower updates and promos). You can unsubscribe anytime.',
				]"
				:class="{'radio-error': $v.selectedComms.$error}"
			>
				<!-- eslint-disable-next-line max-len -->
				Receive email updates from Kiva (including borrower updates and promos). You can unsubscribe anytime.
			</kv-radio>
			<kv-radio
				value="0"
				name="reportComms"
				v-model="selectedComms"
				:class="{'radio-error': $v.selectedComms.$error}"
				v-kv-track-event="[
					'basket',
					'click',
					'marketing-updates',
					// eslint-disable-next-line max-len
					'Dont receive email updates from Kiva (including borrower updates and promos).',
				]"
			>
				<!-- eslint-disable-next-line max-len -->
				Don't receive email updates from Kiva (including borrower updates and promos).
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
			class="tw-border-brand-200 tw-border tw-bg-brand-100 tw-p-1 tw-rounded tw-text-small"
		>
			Can we ask you to reconsider? This borrower and others like them will need your
			help to change their lives. You can unsubscribe at any time.
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
