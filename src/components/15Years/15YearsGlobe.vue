<template>
	<div class="globe-container">
		<canvas class="gk-canvas"></canvas>
		<div class="gk-callout-manager"></div>
	</div>
</template>

<script>
import {
	GlobeKitView,
	Lowpoly,
	GKUtils,
} from '@/lib/globekit/globekit.esm';

// class DotCallout extends Callout {
// 	createElement() {
// 		const div = document.createElement('div');
// 		div.className = 'dot-callout';
// 		div.dataset.code = this.definition.data.code;
// 		return div;
// 	}

// 	setPosition(position) {
// 		const nx = position.screen.x - ((this.size.left + this.size.right) / 2);
// 		const ny = position.screen.y - ((this.size.left + this.size.right) / 2);
// 		this.element.style.transform = `translate(${nx}px, ${ny}px)`;
// 		this.element.style.zIndex = Math.round(10000 * position.world.similarityToCameraVector);
// 		if (position.world.similarityToCameraVector < 0.7) {
// 			const scale = Math.max((position.world.similarityToCameraVector - 0.4) / 0.3, 0);
// 			this.element.style.transform += ` scale(${scale}, ${scale})`;
// 		}
// 	}
// }

export default {
	name: 'FifteenYearsGlobe',
	mounted() {
		console.log(this.$el);

		const canvas = this.$el.getElementsByClassName('gk-canvas')[0];
		const textures = {
			surface: '/images/texture-kiva.png'
		};

		this.gkview = new GlobeKitView(canvas, { wasmPath: '/wasm/gkweb_bg.wasm' }, () => {});
		this.gkview.renderer.clearColor = GKUtils.hexToRGBA('#F8F8F8', 1.0);
		// this.gkview.renderer.clearColor = GKUtils.hexToRGBA('#ff0000', 1.0);
		this.gkview.setMovementModelTo(0, 0, 3.4);
		this.gkview.userDefinedSelection = () => {};

		fetch('/geo/19-15.bin')
			.then(res => res.arrayBuffer())
			.then(data => {
				this.lowpoly = new Lowpoly(textures, data);
				this.lowpoly.setInteractive(true, true, true);
			})
			.then(() => {
				this.gkview.addDrawable(this.lowpoly);
				// this.lowpoly.shouldDraw = true;
			});
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.globe-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.gk-canvas,
.gk-callout-manager {
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
}

.gk-callout-manager {
	pointer-events: none;
}
</style>
