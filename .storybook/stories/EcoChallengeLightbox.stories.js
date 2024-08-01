import EcoChallengeLightbox from '#src/components/Lightboxes/EcoChallengeLightbox.vue';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

const ecoChallengeMilestoneValues = {
	'sustainable-agriculture': [
		{
			achievement: 'climate-challenge',
			milestoneName: 'sustainable-agriculture',
			status: 'NO_NEW_PROGRESS',
		},
		{
			achievement: 'climate-challenge',
			milestoneName: 'sustainable-agriculture',
			status: 'COMPLETABLE',
		},
	],
	'recycle-reuse': [
		{
			achievement: 'climate-challenge',
			milestoneName: 'recycle-reuse',
			status: 'NO_NEW_PROGRESS',
		},
		{
			achievement: 'climate-challenge',
			milestoneName: 'recycle-reuse',
			status: 'COMPLETABLE',
		},
	],
	'solar': [
		{
			achievement: 'climate-challenge',
			milestoneName: 'solar',
			status: 'NO_NEW_PROGRESS',
		},
		{
			achievement: 'climate-challenge',
			milestoneName: 'solar',
			status: 'COMPLETABLE',
		},
	],
};

/* This function generates an array of arrays containing every possible combination of the values in the object passed in. */
function allCombinations(obj) {
	let combos = [[]]
	for (const [key, values] of Object.entries(obj)) {
		combos = combos.flatMap((combo) =>
			values.map((value) => ([...combo, value]))
		)
	}
	return combos
}

const allMilestoneCombinations = allCombinations(ecoChallengeMilestoneValues);

export default {
	title: 'Components/Eco Challenge Lightbox',
	component: EcoChallengeLightbox,
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	args: {
		progresses: [],
		visible: true
	}
};

export const EcoChallengeLightboxCombo0 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[0],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

export const EcoChallengeLightboxCombo1 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[1],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

export const EcoChallengeLightboxCombo2 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[2],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

export const EcoChallengeLightboxCombo3 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[3],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

export const EcoChallengeLightboxCombo4 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[4],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

export const EcoChallengeLightboxCombo5 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[5],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

export const EcoChallengeLightboxCombo6 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[6],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

export const EcoChallengeLightboxCombo7 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	setup() {
		return {
			progresses: allMilestoneCombinations[7],
			visible: true
		};
	},
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});
