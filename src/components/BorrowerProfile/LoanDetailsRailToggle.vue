<template>
	<div class="tw-hidden lg:tw-flex tw-justify-end tw-pt-4">
		<kv-toggle
			id="bp-show-loan-details-in-sidebar"
			:checked="checked"
			@change="onChange"
		>
			Show loan details in the sidebar
		</kv-toggle>
	</div>
</template>

<script>
import KvToggle from '#src/components/Kv/KvToggle';

export default {
	name: 'LoanDetailsRailToggle',
	components: {
		KvToggle,
	},
	emits: ['change'],
	props: {
		checked: {
			type: Boolean,
			default: false,
		},
		loanId: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		onChange(value) {
			this.$kvTrackEvent(
				'borrower-profile',
				'toggle',
				'loan-details-sidebar',
				value ? 'on' : 'off',
				this.loanId,
			);
			this.$emit('change', value);
		},
	},
};
</script>
