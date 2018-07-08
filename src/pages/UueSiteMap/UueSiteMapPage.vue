<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1 @click.prevent="triggerLightbox">Available Routes</h1>
				<route-listing/>
				<kv-lightbox :visible="lightboxvisible" :inverted="false" @lightboxClosed="lightboxClosed">
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
import WwwPage from '@/components/WwwFrame/WwwPage';
import RouteListing from './RouteListing';

export default {
	components: { WwwPage, RouteListing },
	metaInfo: {
		title: 'Sitemap'
	},
	data() {
		return {
			lightboxvisible: false,
		};
	},
	methods: {
		triggerLightbox() {
			this.lightboxvisible = !this.lightboxvisible;
		},
		lightboxClosed() {
			this.lightboxvisible = false;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
