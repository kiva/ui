<template>
	<kv-page-container
		class="
			tw-pt-4 tw-pb-8
			md:tw-pt-6 md:tw-pb-12
			lg:tw-pt-8 lg:tw-pb-16"
	>
		<slot></slot>
	</kv-page-container>
</template>

<script>
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'KvDefaultWrapper',
	components: {
		KvPageContainer,
	},
};
</script>
