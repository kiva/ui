import KvHero from '#src/components/Kv/KvHero';
import KvButton from '#src/components/Kv/KvButton';
import KvResponsiveImage from '#src/components/Kv/KvResponsiveImage';
import { metaGlobReader } from '#src/util/importHelpers';

const imageGlob = import.meta.glob('/src/assets/images/mg-hero-slideshow/*.*', { eager: true });
const imagesRequire = metaGlobReader(imageGlob, '/src/assets/images/mg-hero-slideshow/');
const sampleResponsiveImageSet = [
	['small', imagesRequire('mg-hppromo-1-sm-std.jpg')],
	['small retina', imagesRequire('mg-hppromo-1-sm-retina.jpg')],
	['medium', imagesRequire('mg-hppromo-1-med-std.jpg')],
	['medium retina', imagesRequire('mg-hppromo-1-med-retina.jpg')],
	['large', imagesRequire('mg-hppromo-1-lg-std.jpg')],
	['large retina', imagesRequire('mg-hppromo-1-lg-retina.jpg')],
	['xga', imagesRequire('mg-hppromo-1-xga-std.jpg')],
	['xga retina', imagesRequire('mg-hppromo-1-xga-retina.jpg')],
	['wxga', imagesRequire('mg-hppromo-1-wxga-std.jpg')],
	['wxga retina', imagesRequire('mg-hppromo-1-wxga-retina.jpg')],
];

export default {
	title: 'Kv/KvHero',
	component: KvHero,
};

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
			<template #images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template #headlineTitle>
				Lorem Ipsum eiusmod est amet aliqua quis eu labore. Culpa cillum
			</template>
			<template #headlineBody>
				Eiusmod est amet aliqua quis eu labore. Culpa cillum voluptate aliqua in. Cillum ad sunt excepteur
				magna dolor est elit sunt voluptate in commodo.
			</template>
			<template #action>
				<kv-button
					href="/lend-by-category"
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
			<template #images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template #headlineTitle>
				Making opportunity possible<br class="lu"> is a team effort
			</template>
			<template #action>
				<kv-button
					href="/lend-by-category"
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
			<template #images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template #headlineTitle>
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
			<template #images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
			<template #action>
				<kv-button
					href="/lend-by-category"
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
			<template #images>
				<kv-responsive-image :images="images" alt="A woman in a yellow dress with a look of pride and satisfaction on her face " />
			</template>
		</kv-hero>
	`,
});
