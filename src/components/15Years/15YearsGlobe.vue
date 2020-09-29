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
	CalloutManager,
	CalloutDefinition,
	Callout
} from '@/lib/globekit/globekit.esm';
import geojson from '../../assets/data/components/15-years/geojson.json';

class DotCallout extends Callout {
	createElement() {
		const div = document.createElement('div');
		div.className = 'dot-callout';
		div.style.display = 'inline-block';
		div.style.boxSizing = 'border-box';
		div.style.position = 'absolute';
		div.style.background = 'white';
		div.style.width = '9px';
		div.style.height = '9px';
		div.style.borderRadius = '50%';
		div.style.boxShadow = '4px 4px 8px rgba(0, 0, 0, 0.25)';
		div.dataset.code = this.definition.data.code;
		return div;
	}

	setPosition(position) {
		const nx = position.screen.x - ((this.size.left + this.size.right) / 2);
		const ny = position.screen.y - ((this.size.left + this.size.right) / 2);
		this.element.style.transform = `translate(${nx}px, ${ny}px)`;
		this.element.style.zIndex = Math.round(10000 * position.world.similarityToCameraVector);
		if (position.world.similarityToCameraVector < 0.7) {
			const scale = Math.max((position.world.similarityToCameraVector - 0.4) / 0.3, 0);
			this.element.style.transform += ` scale(${scale}, ${scale})`;
		}
	}
}

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
		this.gkview.renderer.clearColor = GKUtils.hexToRGBA('#F8F8F8', 0.0);
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

		fetch('/geo/35-10.bin')
			.then(res => res.arrayBuffer())
			.then(data => {
				this.lowpoly = new Lowpoly(textures, data);
				this.lowpoly.setInteractive(true, true, true);
			})
			.then(() => {
				this.gkview.addDrawable(this.lowpoly);
				// this.lowpoly.shouldDraw = true;
			});

		const callouts = [];
		geojson.features.forEach((feature, index) => {
			const latlng = feature.geometry.coordinates;
			const country = feature.properties;
			const callout = new CalloutDefinition(latlng[1], latlng[0], DotCallout, country);
			callout.altitude = 0.035;
			callouts.push(callout);
		});
		this.calloutManager.replaceCallouts(callouts);

		this.gkview.onTap = (screen, world) => {
			console.log(screen, world);

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

	.dot-callout {
		display: inline-block;
		box-sizing: border-box;
		position: absolute;
		background: red;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
	}
}
</style>
