<template>
	<div class="globe-component">
		<div class="globe-container">
			<canvas class="gk-canvas"></canvas>
			<div class="gk-callout-manager"></div>
		</div>
	</div>
</template>

<script>
import {
	GlobeKitView,
	Lowpoly,
	GKUtils,
	DataStore,
	CalloutManager,
	CalloutDefinition
} from '@/lib/globekit/globekit.esm';
import DotCallout from './15YearsGlobeDotCallout';
import PinCallout from './15YearsGlobePinCallout';
import geojson from '../../assets/data/components/15-years/geojson.json';

export default {
	name: 'FifteenYearsGlobe',
	mounted() {
		const canvas = this.$el.getElementsByClassName('gk-canvas')[0];
		const textures = {
			surface: '/images/texture-kiva.png'
		};

		this.gkview = new GlobeKitView(canvas, {
			wasmPath: '/wasm/gkweb_bg.wasm',
			attributes: {
				alpha: true, antialias: true,
			}
		}, () => {});
		this.gkview.renderer.clearColor = GKUtils.hexToRGBA('#000000', 0.0);
		// this.gkview.renderer.clearColor = GKUtils.hexToRGBA('#ff0000', 1.0);
		this.gkview.setMovementModelTo(0, 0, 3.4);
		this.gkview.userDefinedSelection = () => {};
		this.gkview.interactionController.movementModel.setAmbient(true);

		this.calloutManager = new CalloutManager(this.$el.getElementsByClassName('gk-callout-manager')[0]);
		this.calloutManager.autoRemoveThreshholdSimilarity = 0.5;
		this.calloutManager.shouldAutoRemoveCallout = def => {
			if (def.calloutClass === DotCallout) {
				return false;
			}
			if (this.automatedSelection && this.automatedSelection.iso3 === def.data.iso3) {
				return false;
			}
			return true;
		};
		this.gkview.registerCalloutManager(this.calloutManager);

		this.callouts = geojson.features.map(feature => {
			const latlng = feature.geometry.coordinates;
			const country = feature.properties;
			const callout = new CalloutDefinition(latlng[1], latlng[0], DotCallout, country);
			callout.altitude = 0.035;
			return callout;
		});

		fetch('/geo/35-10.bin')
			.then(res => res.arrayBuffer())
			.then(data => {
				this.lowpoly = new Lowpoly(textures, data);
				this.lowpoly.setInteractive(true, true, true);
			})
			.then(() => {
				this.gkview.addDrawable(this.lowpoly, () => {
					this.gkview.startDrawing();
					this.calloutManager.replaceCallouts(this.callouts);
				});
			});

		this.datastore = new DataStore();
		this.datastore.addGeojson(geojson);

		this.gkview.onTap = (screen, world) => {
			if (!world) return;
			console.log(screen, world);
			const results = this.datastore.getNearest(world.lat, world.lon, 500, 1);
			if (results) {
				const result = results[0][0];
				console.log(result);
				this.gkview.animateToLatLon(result.lat, result.lon);
				const callout = new CalloutDefinition(result.lat, result.lon, PinCallout, result.properties);
				callout.altitude = 0.035;
				this.calloutManager.replaceCallouts([...this.callouts, callout]);
				this.$emit('selectcountry', result.properties);
			} else {
				this.calloutManager.replaceCallouts(this.callouts);
				this.$emit('selectcountry', null);
				this.gkview.interactionController.movementModel.setAmbientAnimated(true, 1000);
				this.gkview.interactionController.movementModel.interacting = false;
			}
		};

		this.calloutManager.onAutoRemove = () => {
			this.$emit('selectcountry', null);
		};
	},
	methods: {
		selectCountry(country) {
			console.log(country);
			this.automatedSelection = country;
			setTimeout(() => {
				if (this.automatedSelection === country) {
					this.automatedSelection = null;
				}
			}, 1000);

			const { centroid } = country;
			this.gkview.animateToLatLon(centroid.lat, centroid.lng);
			const callout = new CalloutDefinition(centroid.lat, centroid.lng, PinCallout, country);
			callout.altitude = 0.035;
			this.calloutManager.replaceCallouts([...this.callouts, callout]);
		},
		nextClosest(country, exclude) {
			console.log(country, exclude);
			const excludeCodes = exclude.map(c => c.iso3);
			const { centroid } = country;
			const results = this.datastore.getNearest(centroid.lat, centroid.lng, 999999999, 100);
			console.log(results.sort((a, b) => a[1] - b[1]));
			return results
				.sort((a, b) => a[1] - b[1])
				.map(result => result[0].properties)
				.filter(c => !excludeCodes.includes(c.iso3))[0];
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.globe-component {
	pointer-events: none;
}

.globe-container {
	pointer-events: all;
	position: absolute;
	width: calc(100vw - 48px);
	height: calc(100vw - 48px);
	left: calc(50% - 50vw + 24px);
	top: 383px;

	@include breakpoint(large) {
		width: 610px;
		height: 610px;
		left: calc(90.048% - 305px);
		top: 242px;
	}

	@include breakpoint(xxlarge) {
		width: 540px;
		height: 540px;
		left: calc(69.3056% - 270px);
		top: 147px;
	}

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: white;
		box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
	}
}

.globe-component,
.gk-canvas,
.gk-callout-manager {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.gk-callout-manager {
	pointer-events: none;
}
</style>

<style lang="scss">
@import 'settings';

.callout {
	display: inline-block;
	box-sizing: border-box;
	position: absolute;
}

.dot-callout {
	background: white;
	width: calc(4 / 320 * 100vw);
	height: calc(4 / 320 * 100vw);
	border-radius: 50%;
	box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);

	@include breakpoint(large) {
		width: 7px;
		height: 7px;
	}
}

@keyframes pin-wiggle {
	from { transform: translateY(3%); }
	to { transform: translateY(-3%); }
}

.pin-callout {
	width: 20px;
	height: 27px;
	@include breakpoint(large) {
		width: 27px;
		height: 37px;
	}

	div {
		width: 100%;
		height: 100%;
		transition: transform 0.5s cubic-bezier(0.265, 1.850, 0.420, 0.750);
		transform-origin: 50% 89.1892%;
	}

	div::after {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		background: url('~@/assets/images/15-years/globe/pin@2x.png') top left no-repeat;
		background-size: 100% 100%;

		animation: pin-wiggle 1.5s infinite alternate cubic-bezier(0.5, 0, 0.5, 1)
	}
}

.pin-callout.hidden {
	div {
		transform: scale(0, 0);
	}
}

.pin-callout.animate-out {
	div {
		transition: transform 0.2s linear;
		transform: scale(0, 0);
	}
}
</style>
