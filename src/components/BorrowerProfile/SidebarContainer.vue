<template>
	<kv-page-container>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-start-8 lg:tw-col-span-5">
				<slot></slot>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>
import KvGrid from '#kv-components/KvGrid';
import KvPageContainer from '#kv-components/KvPageContainer';

export default {
	name: 'SidebarContainer',
	components: {
		KvGrid,
		KvPageContainer,
	},
};
</script>
