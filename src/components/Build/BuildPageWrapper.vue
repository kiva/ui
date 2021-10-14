<template>
	<kv-default-wrapper>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-span-10 lg:tw-col-span-8 md:tw-col-start-2 lg:tw-col-start-3">
				<slot></slot>
			</div>
		</kv-grid>
	</kv-default-wrapper>
</template>

<script>
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		KvDefaultWrapper,
		KvGrid,
	},
};
</script>
