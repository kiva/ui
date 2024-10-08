<template>
	<div class="tw-relative tw-block tw-w-full" :style="mapDimensions">
		<div
			:id="`kv-map-holder-${mapId}`"
			:ref="refString"
			class="tw-w-full tw-h-full tw-bg-black"
			:style="{ position: 'absolute' }"
		></div>
	</div>
</template>

<script>
import { createIntersectionObserver } from '#src/util/observerUtils';
import testDelayedGlobalLibrary from '#src/util/timeoutUtils';

export default {
	name: 'KvMap',
	head() {
		return {
			script: [].concat(!this.hasWebGL ? [
				// leaflet - uses raster tiles for additional browser coverage
				{
					vmid: `leafletjs${this.mapId}`,
					src: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
					async: true,
					defer: true,
				},
			] : []).concat(this.hasWebGL ? [
				// maplibregl - uses vector tiles and webgl for rendering
				{
					vmid: `maplibregljs${this.mapId}`,
					src: 'https://cdn.maptiler.com/maplibre-gl-js/v1.14.0/maplibre-gl.js',
					async: true,
					defer: true,
				},
			] : []),
			link: [
			].concat(!this.hasWebGL ? [
				// leaflet - uses raster tiles for additional browser coverage
				{
					vmid: `leafletcss${this.mapId}`,
					rel: 'stylesheet',
					href: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
				},
			] : []).concat(this.hasWebGL ? [
				// maplibregl - uses vector tiles and webgl for rendering
				{
					vmid: `maplibreglcss${this.mapId}`,
					rel: 'stylesheet',
					href: 'https://cdn.maptiler.com/maplibre-gl-js/v1.14.0/maplibre-gl.css'
				},
			] : []),
		};
	},
	props: {
		/**
		 * Aspect Ration for computed map dimensions
		 * We'll divide the container width by this to determine the height
		 */
		aspectRatio: {
			type: Number,
			default: 1
		},
		/**
		 * Control how quickly the autoZoom occurs
		 */
		autoZoomDelay: {
			type: Number,
			default: 1500
		},
		/**
		 * Set the height to override aspect ratio driven and/or default dimensions
		 */
		height: {
			type: Number,
			default: null,
		},
		/**
		 * Setting this initialZoom will zoom the map from initialZoom to zoom when the map enters the viewport
		 */
		initialZoom: {
			type: Number,
			default: null
		},
		/**
		 * Set the center point latitude
		 */
		lat: {
			type: Number,
			default: null
		},
		/**
		 * Set the center point longitude
		 */
		long: {
			type: Number,
			default: null
		},
		/**
		 * Set this if there are more than one map on the page
		 */
		mapId: {
			type: Number,
			default: 0
		},
		/**
		 * Force use of Leaflet
		 */
		useLeaflet: {
			type: Boolean,
			default: false
		},
		/**
		 * Set the width to override aspect ratio driven and/or default dimensions
		 */
		width: {
			type: Number,
			default: null,
		},
		/**
		 * Default zoom level
		 */
		zoomLevel: {
			type: Number,
			default: 4
		},
	},
	data() {
		return {
			hasWebGL: false,
			leafletReady: false,
			mapInstance: null,
			mapLibreReady: false,
			mapLoaded: false,
			zoomActive: false,
		};
	},
	computed: {
		mapDimensions() {
			// Use container to derive height based on aspect ration + width
			const container = this.$el?.getBoundingClientRect();
			const height = container ? `${container.width / this.aspectRatio}px` : '300px';
			const width = container ? `${container.width}px` : '100%';
			// Override values if deliberate height or width are provided
			return {
				height: this.height ? `${this.height}px` : height,
				width: this.width ? `${this.width}px` : width,
				paddingBottom: this.height ? `${this.height}px` : `${100 / this.aspectRatio}%`,
			};
		},
		refString() {
			return `mapholder${this.mapId}`;
		},
	},
	watch: {
		lat(next, prev) {
			if (prev === null && this.long && !this.mapLibreReady && !this.leafletReady) {
				this.initializeMap();
			}
		},
		long(next, prev) {
			if (prev === null && this.lat && !this.mapLibreReady && !this.leafletReady) {
				this.initializeMap();
			}
		}
	},
	mounted() {
		if (!this.mapLibreReady && !this.leafletReady) {
			this.initializeMap();
		}
	},
	methods: {
		activateZoom(zoomOut = false) {
			const { mapInstance, hasWebGL, mapLibreReady } = this;
			const currentZoomLevel = mapInstance.getZoom();
			// exit if already zoomed in (getZoom() works for both leaflet + maplibregl)
			if ((!zoomOut && currentZoomLevel === this.zoomLevel)
				|| (zoomOut && currentZoomLevel === this.initialZoom)) return false;

			this.zoomActive = true;
			// establish delayed zoom duration
			const timedZoom = window.setTimeout(() => {
				if (hasWebGL && mapLibreReady) {
					// maplibregl specific zoom method
					mapInstance.zoomTo(
						zoomOut ? this.initialZoom : this.zoomLevel,
						{ duration: 1200 }
					);
				} else {
					// leaflet specific zoom method
					mapInstance.setZoom(zoomOut ? this.initialZoom : this.zoomLevel);
				}

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
		checkWebGL() {
			// exit and use leaflet if specified or document isn't present
			if (this.useLeaflet || typeof document === 'undefined') return false;
			// via. https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Detect_WebGL
			// Create canvas element. The canvas is not added to the document itself,
			// so it is never displayed in the browser window.
			const canvas = document.createElement('canvas');
			// Get WebGLRenderingContext from canvas element.
			const gl = canvas.getContext('webgl')
			|| canvas.getContext('experimental-webgl');
			// Report the result.
			if (gl && gl instanceof WebGLRenderingContext) {
				this.hasWebGL = true;
				return true;
			}
			return false;
		},
		initializeMap() {
			/**
			 * This initial checkWebGL() call kicks off the vue-meta asset inclusion
			 * We then start polling for the readiness of our selected map library and initialize it once ready
			 */
			if (this.checkWebGL()) {
				testDelayedGlobalLibrary('maplibregl').then(response => {
					if (response.loaded && !this.mapLoaded && !this.useLeaflet && this.lat && this.long) {
						this.initializeMapLibre();
						this.mapLibreReady = true;
					}
				});
			} else {
				testDelayedGlobalLibrary('L').then(leafletTest => {
					if (leafletTest.loaded && !this.mapLoaded && this.lat && this.long) {
						this.initializeLeaflet();
						this.leafletReady = true;
					}
				});
			}
		},
		initializeLeaflet() {
			/* eslint-disable no-undef */
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

			// Add our tileset to the mapInstance
			L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=n1Mz5ziX3k6JfdjFe7mx', {
				tileSize: 512,
				zoomOffset: -1,
				minZoom: 1,
				crossOrigin: true
			}).addTo(this.mapInstance);

			/* eslint-enable no-undef */

			// signify map has loaded
			this.mapLoaded = true;
			// only activate autoZoom if we have an initialZoom set
			if (this.initialZoom !== null) {
				this.createWrapperObserver();
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
				attributionControl: false,
				dragPan: false,
				scrollZoom: false,
				doubleClickZoom: false,
				dragRotate: false,
			});

			// signify map has loaded
			this.mapLoaded = true;

			// only activate autoZoom if we have an initialZoom set
			if (this.initialZoom !== null) {
				this.createWrapperObserver();
			}
		},
	},
	beforeUnmount() {
		if (this.mapInstance) {
			if (!this.hasWebGL && !this.leafletReady) {
				// turn off the leaflet instance
				this.mapInstance.off();
			}
			// remove either leaflet or maplibregl
			this.mapInstance.remove();
		}
		this.destroyWrapperObserver();
	},
};
</script>
