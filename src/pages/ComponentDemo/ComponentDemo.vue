<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Component Demos</h1>
				<p>Components placed here are for demo only and may not represent the final use case.</p>
				<br>
				<router-link to="kiva-app-components">Kiva App Dependent Components</router-link>

				<hr>
				<h4>Sample Tip Messages</h4>
				<a @click.prevent="$showTipMsg('Default Tip Message')">Default Tip Message</a> -
				<a @click.prevent="$showTipMsg('Warning Tip Message', 'warning')">Warning Tip Message</a> -
				<a @click.prevent="$showTipMsg('Persisted Error Tip Message', 'error', true)">Error Tip Message</a> -
				<a @click.prevent="$closeTipMsg()">Close Tip Message</a>
				<br>

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

				<br>

				<hr>
				<h4>Sample ToolTips</h4>
				<p>What is an Experimental Field <span
					class="tooltip"
					id="tooltip-demo-1">Partner?</span></p>
				<kv-tooltip controller="tooltip-demo-1">
					<h2 slot="title">What is an Experimental Field Partner?</h2>
					<p>If a Field Partner is labeled as Experimental, this means that Kiva has
					required only a comparatively light level of due diligence and
					monitoring, in exchange for only allowing this Field Partner access to a
					small amount of funding through Kiva at any given time.</p>
				</kv-tooltip>
				<br>

				<hr>
				<br>
				<router-link to="/ui-site-map">Return to Ui Site Map</router-link>
				<br>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvTooltip from '@/components/Kv/KvTooltip';

export default {
	components: {
		WwwPage,
		KvLightbox,
		KvTooltip
	},
	inject: ['apollo'], // TipMsg Global Mixin requires apollo
	metaInfo: {
		title: 'Component Demo'
	},
	data() {
		return {
			defaultLbVisible: false,
			invertedLbVisible: false,
		};
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


.tooltip {
	border-bottom: 2px solid palevioletred;
}
</style>

