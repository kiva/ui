<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5">
		<div class="content-box tw-mx-auto">
			<div
				v-if="!isGuest"
			>
				<LoanComment
					v-for="loan in loans"
					:key="loan.id"
					:loan="loan"
					class="tw-mb-2.5"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import LoanComment from '#src/components/Thanks/SingleVersion/LoanComment';

defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
});
</script>

<style lang="postcss" scoped>
.content-box {
	max-width: 620px;
}
</style>
