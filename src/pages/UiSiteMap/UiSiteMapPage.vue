<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Available Routes</h1>
				<route-listing/>

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

				<!-- TODO: Cleanup after VUE-97 work is complete -->
				<br>
				<hr>
				<br>
				<h4>Assigned Experiment Version: {{ myExpVersion }}</h4>
				<br>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _find from 'lodash/find';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvLightbox from '@/components/Kv/KvLightbox';
import testUiExpSettings from '@/graphql/query/testUiExpSettings.graphql';
import UiExpMixin from '@/plugins/ui-exp-mixin';
import RouteListing from './RouteListing';

export default {
	components: {
		WwwPage,
		RouteListing,
		KvLightbox
	},
	inject: ['apollo'], // Required by UiExpMixin
	mixins: [UiExpMixin],
	metaInfo: {
		title: 'Sitemap'
	},
	data() {
		return {
			defaultLbVisible: false,
			invertedLbVisible: false,
		};
	},
	apollo: {
		query: testUiExpSettings,
		preFetch: true,
		result({ data }) {
			// Add your targeted experiment Setting Data to experimentData array
			this.experimentSettings = [this.parseExperimentData(_get(data, 'general.setting.value'))];
			// Experiments Stored in State
			// - Only if empty, else the fetch from client state will overwrite values written when setting cookie
			if (this.activeUserExperiments.length === 0) {
				this.activeUserExperiments = _get(data, 'userExperiments');
				console.log(`Active User Experiments, set from State: ${JSON.stringify(this.activeUserExperiments)}`);
			}
		},
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
	},
	computed: {
		myExpVersion() {
			const myExp = _find(this.activeUserExperiments, { key: 'uiexp.test' });
			if (myExp) {
				return myExp.version;
			}
			return null;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
