<template>
	<div>
		<a
			class="tw-text-action tw-inline-flex tw-cursor-pointer
			tw-whitespace-nowrap tw-font-medium hover:tw-no-underline"
			href="#follow"
			v-kv-track-event="['borrower-profile', 'click', 'follow']"
		>
			<kv-material-icon
				class="tw-text-action tw-w-3 tw-mr-0.5"
				:icon="`${mdiBookmarkOutline}`"
			/>
			Follow
		</a>
	</div>
</template>
<script>
import { mdiBookmarkOutline } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LoanFollow',
	components: {
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			mdiBookmarkOutline,
		};
	},
};
</script>
