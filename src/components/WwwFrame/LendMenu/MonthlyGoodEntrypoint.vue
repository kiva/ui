<template>
	<div class="tw-mt-2 tw-mb-4 tw-inline-flex-col lg:tw-inline-flex tw-items-center">
		<div class="tw-flex-col">
			<div class="tw-inline-flex">
				<img class="tw-w-4.5 lg:tw-w-5" src="@/assets/images/jill.svg">
				<img class="tw-w-4.5 lg:tw-w-5" src="@/assets/images/lara.svg">
				<img class="tw-w-4.5 lg:tw-w-5" src="@/assets/images/zawa.svg">
			</div>
			<h3 class="tw-text-h3 tw-text-primary">
				Join our community of monthly lenders
			</h3>
			<p class="tw-text-base tw-text-secondary">
				Personalized, automatic lending for you
			</p>
		</div>
		<!-- eslint-disable-next-line max-len -->
		<span class="tw-inline-flex tw-items-center tw-font-medium tw-gap-0.5 tw-mt-2 lg:tw-ml-8 tw-text-brand hover:tw-underline">
			Become a member
			<kv-material-icon :icon="mdiArrowRight" class="tw-w-3 tw-h-3" />
		</span>
	</div>
</template>

<script>
import { mdiArrowRight } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'MonthlyGoodEntrypoint',
	data() {
		return {
			mdiArrowRight,
		};
	},
	components: {
		KvMaterialIcon,
	}
};
</script>
