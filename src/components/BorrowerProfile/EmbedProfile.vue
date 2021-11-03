<template>
	<div>
		<label for="image-embed-input" class="tw-block tw-mb-1">
			Copy and paste this code into your website.
		</label>
		<div class="tw-flex tw-gap-2 tw-mb-4">
			<kv-text-input
				id="image-embed-input"
				:value="imageEmbed"
			/>
			<kv-button @click="copyEmbedCode">
				Copy
			</kv-button>
		</div>
		<div class="tw-p-4 tw-bg-secondary">
			<h3 class="tw-mb-4">
				Preview
			</h3>
			<div v-html="imageEmbed"></div>
		</div>
	</div>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	components: {
		KvButton,
		KvTextInput,
	},
	inject: ['apollo'],
	computed: {
		imageEmbed() {
			/* eslint-disable max-len */
			return `<a href="https://dev-vm-01.kiva.org/lend/${this.loanId}">
				<img src="https://dev-vm-01.kiva.org/live-loan/p/${this.loanId}/img/1" alt="Loan Card" width="450" height="787" />
			</a>`;
			/* eslint-enable max-len */
		}
	},
	methods: {
		async copyEmbedCode() {
			await navigator.clipboard.writeText(this.imageEmbed);
			this.$showTipMsg('Embed code copied');
		}
	}
};
</script>
