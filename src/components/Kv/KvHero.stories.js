import KvHero from './KvHero';
import KvButton from './KvButton';
import KvResponsiveImage from './KvResponsiveImage';

const possibilitiesImageRequire = require.context('@/assets/images/mg-hero-slideshow', true);
const sampleResponsiveImageSet = [
	['small', possibilitiesImageRequire('./mg-hppromo-1-sm-std.jpg')],
	['small retina', possibilitiesImageRequire('./mg-hppromo-1-sm-retina.jpg')],
	['medium', possibilitiesImageRequire('./mg-hppromo-1-med-std.jpg')],
	['medium retina', possibilitiesImageRequire('./mg-hppromo-1-med-retina.jpg')],
	['large', possibilitiesImageRequire('./mg-hppromo-1-lg-std.jpg')],
	['large retina', possibilitiesImageRequire('./mg-hppromo-1-lg-retina.jpg')],
	['xga', possibilitiesImageRequire('./mg-hppromo-1-xga-std.jpg')],
	['xga retina', possibilitiesImageRequire('./mg-hppromo-1-xga-retina.jpg')],
	['wxga', possibilitiesImageRequire('./mg-hppromo-1-wxga-std.jpg')],
	['wxga retina', possibilitiesImageRequire('./mg-hppromo-1-wxga-retina.jpg')],
];

export default { title: 'Kv|KvHero' };

export const headlineBodyAction = () => ({
	components: {
		KvButton,
		KvHero,
		KvResponsiveImage
	},
	data() {
		return {
			images: sampleResponsiveImageSet
		};
	},
	template: `
		<kv-hero headline-bg-color="#0b290c">
			<template v-slot:images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template v-slot:headlineTitle>
				Lorem Ipsum eiusmod est amet aliqua quis eu labore. Culpa cillum
			</template>
			<template v-slot:headlineBody>
				Eiusmod est amet aliqua quis eu labore. Culpa cillum voluptate aliqua in. Cillum ad sunt excepteur
				magna dolor est elit sunt voluptate in commodo.
			</template>
			<template v-slot:action>
				<kv-button
					to="/lend-by-category"
				>
					Lend now
				</kv-button>
			</template>
		</kv-hero>
	`,
});

export const headlineAction = () => ({
	components: {
		KvButton,
		KvHero,
		KvResponsiveImage
	},
	data() {
		return {
			images: sampleResponsiveImageSet
		};
	},
	template: `
		<kv-hero>
			<template v-slot:images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template v-slot:headlineTitle>
				Making opportunity possible<br class="lu"> is a team effort
			</template>
			<template v-slot:action>
				<kv-button
					to="/lend-by-category"
				>
					Lend now
				</kv-button>
			</template>
		</kv-hero>
	`,
});

export const headline = () => ({
	components: {
		KvHero,
		KvResponsiveImage
	},
	data() {
		return {
			images: sampleResponsiveImageSet
		};
	},
	template: `
		<kv-hero>
			<template v-slot:images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template v-slot:headlineTitle>
				Making opportunity possible<br class="lu"> is a team effort
			</template>
		</kv-hero>
	`,
});

export const action = () => ({
	components: {
		KvButton,
		KvHero,
		KvResponsiveImage
	},
	data() {
		return {
			images: sampleResponsiveImageSet
		};
	},
	template: `
		<kv-hero>
			<template v-slot:images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template v-slot:action>
				<kv-button
					to="/lend-by-category"
				>
					Lend now
				</kv-button>
			</template>
		</kv-hero>
	`,
});

export const imageOnly = () => ({
	components: {
		KvHero,
		KvResponsiveImage
	},
	data() {
		return {
			images: sampleResponsiveImageSet
		};
	},
	template: `
		<kv-hero>
			<template v-slot:images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
		</kv-hero>
	`,
});
