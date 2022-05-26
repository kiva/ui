<template>
	<www-page>
		<kv-default-wrapper>
			<h1 class="tw-mb-4">
				Available Routes
			</h1>
			<route-listing />
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import RouteListing from './RouteListing';

export default {
	name: 'UiSiteMapPage',
	components: {
		KvDefaultWrapper,
		RouteListing,
		WwwPage,
	},
	metaInfo: {
		title: 'Sitemap'
	},
};
</script>
