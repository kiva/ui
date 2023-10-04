<template>
	<div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
		<div class="tw-flex tw-flex-col tw-gap-y-2" style="max-width: 186px;">
			<img class="tw-w-4 tw-h-4 tw-mx-auto" alt="View More Glass" src="@/assets/images/view_more_glass.svg">
			<p class="tw-text-subhead tw-text-center">
				View more loans that match your filters on our search page
			</p>
			<kv-button to="/lend/filter">
				<span class="tw-flex tw-items-center">
					View more
					<kv-material-icon class="tw-ml-1" :icon="mdiArrowRight" />
				</span>
			</kv-button>
		</div>
	</div>
</template>

<script>
import { mdiArrowRight } from '@mdi/js';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'ViewMoreCard',
	components: {
		KvButton,
		KvMaterialIcon,
	},
	data() {
		return {
			mdiArrowRight
		};
	},
};
</script>
