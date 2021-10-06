<template>
	<www-page>
		<kv-page-container class="tw-py-8">
			<h1 class="tw-mb-4">
				Available Routes
			</h1>
			<route-listing />
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import RouteListing from './RouteListing';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		KvPageContainer,
		RouteListing,
		WwwPage,
	},
	metaInfo: {
		title: 'Sitemap'
	},
};
</script>
