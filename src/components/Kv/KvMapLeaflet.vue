<template>
	<div class="tw-w-full tw-relative">
		<div :id="`kv-map-holder-${mapId}`" :ref="refString" style="min-height: 320px; min-width: 320px;">
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
			// leaflet - uses raster tiles for additional browser coverage
			{ src: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', async: true, defer: true },
		],
		link: [
			// leaflet - uses raster tiles for additional browser coverage
			{ rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' },
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
		testDelayedGlobalLibrary('L').then(response => {
			if (response.loaded && !this.mapLoaded) {
				this.initializeLeaflet();
			} else {
				console.error('Leaflet failed to load');
			}
		});
	},
	beforeDestroy() {
		this.mapInstance.off();
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
				// leaflet specific zoom method
				mapInstance.setZoom(zoomOut ? this.initialZoom : this.zoomLevel);
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
		initializeLeaflet() {
			/* eslint-disable no-undef, max-len */
			// Initialize primary mapInstance
			this.mapInstance = L.map(`kv-map-holder-${this.mapId}`, {
				center: [this.lat, this.long],
				zoom: this.initialZoom || this.zoomLevel,
				// todo make props for the following options
				dragging: false,
				zoomControl: false,
				animate: true,
				scrollWheelZoom: false,
				doubleClickZoom: false,
				attributionControl: false
			});
			/* eslint-disable quotes */
			// Add our tileset to the mapInstance
			L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=n1Mz5ziX3k6JfdjFe7mx', {
				tileSize: 512,
				zoomOffset: -1,
				minZoom: 1,
				crossOrigin: true
			}).addTo(this.mapInstance);
			/* eslint-enable quotes */
			/* eslint-enable no-undef, max-len */

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
