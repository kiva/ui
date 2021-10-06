<template>
	<kv-page-container class="tw-py-4 md:tw-py-6 lg:tw-py-8">
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-span-8 md:tw-col-start-3">
				<slot></slot>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'App',
	components: {
		KvPageContainer,
		KvGrid,
	},
};
</script>
