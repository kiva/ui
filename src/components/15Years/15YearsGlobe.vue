<template>
	<div class="globe-component">
		<div class="globe-container">
			<canvas class="gk-canvas"></canvas>
			<div class="gk-callout-manager"></div>
		</div>
		<fifteen-years-globe-c-t-a v-if="ctaVisible" />
	</div>
</template>

<script>
import { gsap } from 'gsap';
import geojson from '@/assets/data/components/15-years/geojson.json';
import geoData from '@/assets/binary/geo/35-10.bin';
import gkWasm from '@/assets/wasm/gkweb_bg.wasm';
import textureKiva from '@/assets/images/15-years/texture-kiva.png';
import FifteenYearsGlobeCTA from '@/components/15Years/15YearsGlobeCTA';

export default {
	name: '15YearsGlobe',
	components: {
		FifteenYearsGlobeCTA,
	},
	data() {
		return {
			ctaVisible: false,
		};
	},
	async mounted() {
		if (!this.checkSupport()) {
			this.$el.classList.add('fallback');
			return;
		}
		this.ctaVisible = true;

		const {
			GlobeKitView,
			Lowpoly,
			GKUtils,
			DataStore,
			CalloutManager,
			CalloutDefinition
		} = await import('@/lib/globekit/globekit.esm');
		const { default: DotCallout } = await import('./15YearsGlobeDotCallout');
		const { default: PinCallout } = await import('./15YearsGlobePinCallout');

		const canvas = this.$el.getElementsByClassName('gk-canvas')[0];
		const textures = {
			surface: textureKiva
		};

		this.gkview = new GlobeKitView(canvas, {
			wasmPath: gkWasm,
			attributes: {
				alpha: true, antialias: true,
			}
		}, () => {});
		this.gkview.renderer.clearColor = GKUtils.hexToRGBA('#000000', 0.0);
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

		fetch(geoData)
			.then(res => res.arrayBuffer())
			.then(data => {
				this.lowpoly = new Lowpoly(textures, data);
				this.lowpoly.setInteractive(true, true, true);
			})
			.then(() => {
				this.gkview.addDrawable(this.lowpoly, () => {
					const obj = { scale: 0.001 };
					this.lowpoly.scale = [obj.scale, obj.scale, obj.scale];
					gsap.to(obj, 0.5, {
						scale: 1,
						delay: 0.05,
						ease: 'power3.out',
						onUpdate: () => {
							this.lowpoly.scale = [obj.scale, obj.scale, obj.scale];
						},
						onComplete: () => {
							this.calloutManager.replaceCallouts(this.callouts);
						}
					});
					this.gkview.startDrawing();
				});
			});

		this.datastore = new DataStore();
		this.datastore.addGeojson(geojson);

		this.gkview.onTap = (screen, world) => {
			// TODO: maybe - analytics event. Triggered when clicking on the globe.
			if (!world) return;
			this.ctaVisible = false;
			const results = this.datastore.getNearest(world.lat, world.lon, 500, 1);
			if (results) {
				const result = results[0][0];
				const isMobileLayout = window.innerWidth < 681;
				const offset = isMobileLayout ? -20 : 0;
				this.gkview.animateToLatLon(result.lat + offset, result.lon);
				const callout = new CalloutDefinition(result.lat, result.lon, PinCallout, result.properties);
				callout.altitude = 0.035;
				this.calloutManager.replaceCallouts([...this.callouts, callout]);
				this.$emit('selectcountry', result.properties);
				this.currentCallout = callout;

				if (isMobileLayout) {
					console.log(window.scrollY, window.innerHeight);
					if (window.scrollY > window.innerHeight * 0.45) {
						this.$el.scrollIntoView({ behavior: 'smooth' });
					}
				}
			} else {
				this.calloutManager.replaceCallouts(this.callouts);
				this.$emit('selectcountry', null);
				this.gkview.interactionController.movementModel.setAmbientAnimated(true, 1000);
				this.gkview.interactionController.movementModel.interacting = false;
				this.currentCallout = null;
			}
		};

		this.gkview.interactionController.onPan = () => {
			this.$emit('pan', null);
			this.ctaVisible = false;
		};

		// fired when a pin is removed by going around edge of globe. probably not valuable
		// to track in analytics
		this.calloutManager.onAutoRemove = callout => {
			if (callout === this.currentCallout) {
				this.$emit('selectcountry', null);
				this.gkview.interactionController.movementModel.setAmbient(true);
				this.currentCallout = null;
			}
		};
	},
	beforeDestroy() {
		if (this.gkview) {
			this.gkview.release();
		}
	},
	methods: {
		checkSupport() {
			try {
				if (typeof WebAssembly === 'object'
					&& typeof WebAssembly.instantiate === 'function') {
					const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
					if (module instanceof WebAssembly.Module) {
						return true;
					}
				}
			// eslint-disable-next-line no-empty
			} catch (e) {
			}
			return false;
		},
		async selectCountry(country) {
			const { CalloutDefinition } = await import('@/lib/globekit/globekit.esm');
			const { default: PinCallout } = await import('./15YearsGlobePinCallout');

			this.automatedSelection = country;
			setTimeout(() => {
				if (this.automatedSelection === country) {
					this.automatedSelection = null;
				}
			}, 2000);

			const { centroid } = country;
			const isMobileLayout = window.innerWidth < 681;
			const offset = isMobileLayout ? -20 : 0;
			this.gkview.animateToLatLon(centroid.lat + offset, centroid.lng);
			const callout = new CalloutDefinition(centroid.lat, centroid.lng, PinCallout, country);
			callout.altitude = 0.035;
			this.calloutManager.replaceCallouts([...this.callouts, callout]);
			this.currentCallout = callout;
		},
		nextClosest(country, exclude) {
			const excludeCodes = exclude.map(c => c.iso3);
			const { centroid } = country;
			const results = this.datastore.getNearest(centroid.lat, centroid.lng, 999999999, 100);
			return results
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
	width: calc(100vw - #{rem-calc(48)});
	height: calc(100vw - #{rem-calc(48)});
	left: calc(50% - 50vw + #{rem-calc(24)});
	top: rem-calc(432);
	z-index: 3;

	@include breakpoint(large) {
		width: rem-calc(610);
		height: rem-calc(610);
		left: calc(90.048% - #{rem-calc(305)});
		top: rem-calc(242);
	}

	@include breakpoint(xxlarge) {
		width: rem-calc(540);
		height: rem-calc(540);
		left: calc(69.3056% - #{rem-calc(270)});
		top: rem-calc(147);
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
		box-shadow: rem-calc(4) rem-calc(4) rem-calc(8) rgba(0, 0, 0, 0.25);
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

.globe-component.fallback {
	.globe-container::before {
		background: white url('~@/assets/images/15-years/globe/fallback.jpg') top left no-repeat;
		background-size: 100% 100%;
	}

	.gk-canvas,
	.gk-callout-manager {
		display: none;
	}
}
</style>

<style lang="scss">
@import 'settings';
@import 'components/15-years/15-years';

.callout {
	display: inline-block;
	box-sizing: border-box;
	position: absolute;
}

.dot-callout {
	transition: opacity 0.25s linear;
	background: $tomato;
	border: rem-calc(2) solid white;
	border-radius: 50%;
	box-shadow: rem-calc(4) rem-calc(4) rem-calc(8) rgba(0, 0, 0, 0.25);
	width: rem-calc(16);
	height: rem-calc(16);
}

.dot-callout.hidden {
	opacity: 0;
}

@keyframes pin-wiggle {
	from { transform: translateY(-3.5%); }
	to { transform: translateY(3.5%); }
}

.pin-callout {
	width: rem-calc(40);
	height: rem-calc(40);
}

.pin-callout-flag {
	width: 100%;
	height: 100%;
	transform-origin: 50% 100%;
	transform: scale(1) translateY(rem-calc(20)); // centered vertically. Half the height.
	border-radius: 50%;
	border: rem-calc(3) solid white;
	overflow: hidden;
	background-color: #fff;
	background-image: url('~flag-icon-css/flags/sprite/1x1/flag-sprite-32_2x.png');
	background-size: 100%;
	background-repeat: no-repeat;
	box-shadow: rem-calc(4) rem-calc(4) rem-calc(8) rgba(0, 0, 0, 0.25);
}

.pin-callout.hidden {
	.pin-callout-flag {
		transform: scale(0) translateY(0);
	}
}

.pin-callout.animate-in {
	.pin-callout-flag {
		transition: transform 0.2s linear;
		transform: scale(1) translateY(rem-calc(20));
	}
}

.pin-callout.animate-out {
	.pin-callout-flag {
		transition: transform 0.2s linear;
		transform: scale(0) translateY(0);
	}
}
</style>
