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
		this.gkview.interactionController.movementModel.hasAmbient = true;

		this.calloutManager = new CalloutManager(this.$el.getElementsByClassName('gk-callout-manager')[0]);
		this.calloutManager.autoRemoveThreshholdSimilarity = 0.25;
		this.calloutManager.shouldAutoRemoveCallout = def => {
			if (def.calloutClass === DotCallout) {
				return false;
			}
			return true;
		};
		this.gkview.registerCalloutManager(this.calloutManager);

		const callouts = [];
		geojson.features.forEach(feature => {
			const latlng = feature.geometry.coordinates;
			const country = feature.properties;
			const callout = new CalloutDefinition(latlng[1], latlng[0], DotCallout, country);
			callout.altitude = 0.035;
			callouts.push(callout);
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
					this.calloutManager.replaceCallouts(callouts);
				});
			});

		this.datastore = new DataStore();
		this.datastore.addGeojson(geojson);

		this.gkview.onTap = (screen, world) => {
			console.log(screen, world);
			console.log();
			const results = this.datastore.getNearest(world.lat, world.lon, 500, 1);
			if (results) {
				const result = results[0][0];
				console.log(result);
				const callout = new CalloutDefinition(result.lat, result.lon, PinCallout, result.properties);
				callout.altitude = 0.035;
				this.calloutManager.replaceCallouts([...callouts, callout]);
				this.$emit('selectcountry', result.properties);
			} else {
				this.calloutManager.replaceCallouts(callouts);
				this.$emit('selectcountry', null);
			}
		};

		// this.points = new Points({ maxDataPoints: 100 });
		// this.gkview.addDrawable(this.points);
		// const pointColor = GKUtils.hexToRGBA('#F8F8F8', 0.0);
		// this.points.applyTransform = (element, p) => {
		// 	const point = p;
		// 	point.alt = 1;
		// 	point.size = 48;

		// 	// console.log(GKUtils.hexToRGBA);
		// 	// point.color = GKUtils.hexToRGBA('#F8F8F8', 0.0);
		// 	point.color = pointColor;

		// 	return point;
		// };

		// this.points.addGeojson(geojson);
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.globe-container {
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

.pin-callout {
	width: 27px;
	height: 37px;
	background: url('~@/assets/images/15-years/globe/pin@2x.png') top left no-repeat;
	background-size: 100% 100%;
}
</style>
