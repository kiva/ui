<template>
	<div class="tw-w-full tw-relative">
		<div :id="`kv-map-holder-${this.mapId}`" :ref="refString" style="min-height: 320px; min-width: 320px;">
			<h1>a map</h1>
		</div>
	</div>
</template>

<script>
import { createIntersectionObserver } from '@/util/observerUtils';
import testDelayedGlobalLibrary from '@/util/timeoutUtils';

export default {
	metaInfo: {
		script: [
			// maplibregl - uses vector tiles and webgl for rendering
			{ src: 'https://cdn.maptiler.com/maplibre-gl-js/v1.14.0/maplibre-gl.js', async: true, defer: true },
		],
		link: [
			// maplibregl - uses vector tiles and webgl for rendering
			{ rel: 'stylesheet', href: 'https://cdn.maptiler.com/maplibre-gl-js/v1.14.0/maplibre-gl.css' },
		],
	},
	props: {
		lat: {
			type: Number,
			default: 37.700091
		},
		long: {
			type: Number,
			default: -123.013243
		},
		/**
		 * Setting this initialZoom will zoom the map from initialZoom to zoom when the map enters the viewport
		 */
		initialZoom: {
			type: Number,
			default: null
		},
		/**
		 * Default zoom level
		 */
		zoomLevel: {
			type: Number,
			default: 4
		},
		/**
		 * Set this if there are more than one map on the page
		 */
		mapId: {
			type: Number,
			default: 0
		},
		/**
		 * Control how quickly the autoZoom occurs
		 */
		autoZoomDelay: {
			type: Number,
			default: 1500
		}
	},
	data() {
		return {
			mapInstance: null,
			mapLoaded: false,
			zoomActive: false,
		};
	},
	computed: {
		refString() {
			return `mapholder${this.mapId}`;
		},
	},
	mounted() {
		testDelayedGlobalLibrary('maplibregl').then(response => {
			if (response.loaded && !this.mapLoaded) {
				this.initializeMapLibre();
			} else {
				console.error('MapLibreGL failed to load');
			}
		});
	},
	beforeDestroy() {
		this.mapInstance.remove();
		this.destroyWrapperObserver();
	},
	methods: {
		activateZoom(zoomOut) {
			const { mapInstance } = this;
			// exit if already zoomed out
			if (zoomOut && mapInstance.getZoom() === this.initialZoom) return false;

			this.zoomActive = true;
			// establish delayed zoom duration
			const timedZoom = window.setTimeout(() => {
				// maplibregl specific zoom method
				mapInstance.zoomTo(
					zoomOut ? this.initialZoom : this.zoomLevel,
					{ duration: 1200 }
				);
				clearTimeout(timedZoom);
				this.zoomActive = false;
			}, this.autoZoomDelay);
		},
		createWrapperObserver() {
			// Watch for the wrapper element moving in and out of the viewport
			this.wrapperObserver = createIntersectionObserver({
				targets: [this.$refs?.[this.refString]],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$refs?.[this.refString] && !this.zoomActive) {
							if (entry.intersectionRatio > 0) {
								this.activateZoom();
							} else {
								this.activateZoom(true);
							}
						}
					});
				},
			});
		},
		destroyWrapperObserver() {
			if (this.wrapperObserver) {
				this.wrapperObserver.disconnect();
			}
		},
		initializeMapLibre() {
			// Initialize primary mapInstance
			// eslint-disable-next-line no-undef
			this.mapInstance = new maplibregl.Map({
				container: `kv-map-holder-${this.mapId}`,
				style: 'https://api.maptiler.com/maps/bright/style.json?key=n1Mz5ziX3k6JfdjFe7mx',
				center: [this.long, this.lat],
				zoom: this.initialZoom || this.zoomLevel,
				attributionControl: false
			});
			this.mapInstance.scrollZoom.disable();
			this.mapInstance.doubleClickZoom.disable();

			// signify map has loaded
			this.mapLoaded = true;

			// only activate autoZoom if we have an initialZoom set
			if (this.initialZoom !== null) {
				this.createWrapperObserver();
			}
		},
	},
};
</script>
