<template>
	<kv-page-container>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-7">
				<slot></slot>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>
import { KvGrid, KvPageContainer } from '@kiva/kv-components';

export default {
	name: 'ContentContainer',
	components: {
		KvGrid,
		KvPageContainer,
	},
};
</script>
