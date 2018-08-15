<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Available Routes</h1>
				<route-listing/>

				<br>
				<!-- TODO: Remove after testing VUE-97/LC-41 -->
				<hr>
				<p>Assigned: {{ assignedVersion }}</p>

				<br>
				<!-- TODO: Remove after testing VUE-37 -->
				<hr>
				<h4>Sample Tip Messages</h4>
				<a @click.prevent="$showTipMsg('Default Tip Message')">Default Tip Message</a> -
				<a @click.prevent="$showTipMsg('Warning Tip Message', 'warning')">Warning Tip Message</a> -
				<a @click.prevent="$showTipMsg('Persisted Error Tip Message', 'error', true)">Error Tip Message</a> -
				<a @click.prevent="$closeTipMsg()">Close Tip Message</a>
				<br>

				<!-- TODO: Remove after testing VUE-38 -->
				<hr>
				<h4>Sample Lightboxes</h4>
				<a @click.prevent="triggerDefaultLightbox">Show Default Light Box</a> -
				<a @click.prevent="triggerInvertedLightbox">Show Inverted Light Box with Button</a>
				<br>

				<kv-lightbox
					:visible="defaultLbVisible"
					@lightbox-closed="lightboxClosed">
					<h2 slot="title">What is an Experimental Field Partner?</h2>
					<p>If a Field Partner is labeled as Experimental, this means that Kiva has required
					only a comparatively light level of due diligence and monitoring, in exchange for
					only allowing this Field Partner access to a small amount of funding through
					Kiva at any given time.</p>
					<p>The Experimental Field Partner program was created to facilitate access to
					Kiva for small social enterprises and innovative pilot credit programs.
					Frequently, Kiva will conduct further due diligence on these Field Partners
					after an initial testing period, potentially graduating the Field Partner
					out of Experimental status. Since Kiva does not conduct a full risk analysis
					of Experimental Field Partners, they are not assigned a formal risk rating
					on our website.</p>
					<p>Lenders should always assume that these partners represent the highest level
					of repayment risk on Kiva.</p>
				</kv-lightbox>

				<kv-lightbox
					:visible="invertedLbVisible"
					:inverted="true"
					:show-close-button="true"
					@lightbox-closed="lightboxClosed">
					<h2 slot="title">What is an Experimental Field Partner?</h2>
					<p>If a Field Partner is labeled as Experimental, this means that Kiva has required
					only a comparatively light level of due diligence and monitoring, in exchange for
					only allowing this Field Partner access to a small amount of funding through
					Kiva at any given time.</p>
					<p>The Experimental Field Partner program was created to facilitate access to
					Kiva for small social enterprises and innovative pilot credit programs.
					Frequently, Kiva will conduct further due diligence on these Field Partners
					after an initial testing period, potentially graduating the Field Partner
					out of Experimental status. Since Kiva does not conduct a full risk analysis
					of Experimental Field Partners, they are not assigned a formal risk rating
					on our website.</p>
					<p>Lenders should always assume that these partners represent the highest level
					of repayment risk on Kiva.</p>
				</kv-lightbox>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import expQuery from '@/graphql/query/experimentSetting.graphql';
import verQuery from '@/graphql/query/experimentAssignment.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvLightbox from '@/components/Kv/KvLightbox';
import RouteListing from './RouteListing';

export default {
	components: {
		WwwPage,
		RouteListing,
		KvLightbox
	},
	inject: ['apollo'], // TODO: Remove after testing VUE-37
	metaInfo: {
		title: 'Sitemap'
	},
	data() {
		return {
			defaultLbVisible: false,
			invertedLbVisible: false,
			assignedVersion: null,
		};
	},
	apollo: {
		// example prefetch function to get an experiment setting and then an assigned version
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// first query the setting
				client.query({
					query: expQuery,
					variables: { key: 'uiexp.test' },
				}).then(() => {
					// with the cache now primed, query for a version assignment
					client.query({
						query: verQuery,
						variables: { id: 'test' },
					}).then(resolve).catch(reject);
				}).catch(reject);
			});
		},
	},
	created() {
		// read the experiment version assignment from the cache for ssr
		const data = this.apollo.readQuery({
			query: verQuery,
			variables: { id: 'test' },
		});
		this.assignedVersion = _get(data, 'experiment.version');

		// alternatively, comment out the above and the preFetch function and uncomment this
		// section to only do the experiment assignment from the client.
		// this.apollo.query({
		// 	query: expQuery,
		// 	variables: { key: 'uiexp.test' },
		// }).then(() => {
		// 	this.apollo.query({
		// 		query: verQuery,
		// 		variables: { id: 'test' },
		// 	}).then(({ data }) => {
		// 		this.assignedVersion = _get(data, 'experiment.version');
		// 	});
		// });
	},
	methods: {
		triggerDefaultLightbox() {
			this.defaultLbVisible = !this.defaultLbVisible;
		},
		triggerInvertedLightbox() {
			this.invertedLbVisible = !this.invertedLbVisible;
		},
		lightboxClosed() {
			this.defaultLbVisible = false;
			this.invertedLbVisible = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
