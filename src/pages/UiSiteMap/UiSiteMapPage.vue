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
				<h1>{{ myExpVersion }}</h1>
				<h2 v-if="myExpVersion == 0">Version 0</h2>
				<h2 v-if="myExpVersion == 1">Version 1</h2>
				<h2 v-if="myExpVersion == 2">Version 2</h2>
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
			experimentTest: {},
			experimentData: () => {},
			activeUserExperiments: () => []
			// myExp: () => {}
		};
	},
	apollo: {
		query: testUiExpSettings,
		preFetch: true,
		result({ data }) {
			this.experimentData = this.$parseExperimentData(_get(data, 'general.setting.value'));
			this.activeUserExperiments = _get(data, 'userExperiments');
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
		// myExp() {
		// 	return _find(this.activeUserExperiments, { key: 'uiexp.test' }) || null;
		// },
		myExpVersion() {
			// get() => {
			console.log('updating myExpVersion');
			const myExp = _find(this.activeUserExperiments, { key: 'uiexp.test' });
			if (myExp) {
				return myExp.version;
			}
			return null;
			// const version = _find(activeExps, { key: 'uiexp.test' });
			// console.log(_find(activeExps, { key: 'uiexp.test' }));
			// console.log(_find(activeExps, { key: 'uiexp.test' }).version);
			// return _find(activeExps, { key: 'uiexp.test' }).version || 0;
			// },
			// set: () => {
			// 	this.activeUserExperiments = [];
			// }
		},
		// experimentVersion() {
		// 	// eslint-disable-next-line
		// 	console.log('computing exp version');
		// 	return this.$getUiExpVersion(this.experimentData);
		// }
	},
	// watch: {
	// 	experimentVersion() {
	// 		// eslint-disable-next-line
	// 		console.log('computing exp version');
	// 		return this.$getUiExpVersion(this.experimentData);
	// 	}
	// },
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
