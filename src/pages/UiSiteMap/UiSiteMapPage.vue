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
import WwwPage from '#src/components/WwwFrame/WwwPage';
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';
import useCDNHeaders from '#src/composables/useCDNHeaders';
import RouteListing from './RouteListing';

export default {
	name: 'UiSiteMapPage',
	components: {
		KvDefaultWrapper,
		RouteListing,
		WwwPage,
	},
	head: {
		title: 'Sitemap'
	},
	created() {
		useCDNHeaders(helper => {
			// Cache the page for 10 minutes, but allow stale data for 1 hour
			helper
				.setNumeric('maxAge', 60 * 10) // 10 minutes
				.setNumeric('staleWhileRevalidate', 60 * 60) // 1 hour
				.setNumeric('staleIfError', 60 * 60 * 24); // 24 hours
		});
	},
};
</script>
