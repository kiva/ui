<template>
	<div class="basket-add-interstitial">
		<kv-lightbox
			:visible="showInterstitial"
			:no-padding-top="true"
			:no-padding-sides="true"
			:no-padding-bottom="true"
			@lightbox-closed="closeLightbox">
			Hi Wrapper.
		</kv-lightbox>
	</div>
</template>

<script>
import _get from 'lodash/get';
import basketAddInterstitial from '@/graphql/query/basketAddInterstitialClient.graphql';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvLightbox
	},
	inject: ['apollo'],
	data() {
		return {
			showInterstitial: false,
		};
	},
	mounted() {
		this.apollo.watchQuery({ query: basketAddInterstitial }).subscribe({
			next: ({ data }) => {
				console.log(data);
				const interstitialState = _get(data, 'basketAddInterstitial');
				this.showInterstitial = interstitialState.active ? interstitialState.visible : false;
			},
		});
	},
	methods: {
		closeLightbox() {
			console.log('lightbox closed');
		}
	}
};
</script>

<style>

</style>
