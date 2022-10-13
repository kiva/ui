import EcoChallengeLightbox from '@/components/Lightboxes/EcoChallengeLightbox.vue';

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
		values.map((value) => ([...combo, value ]))
	  )
	}
	return combos
  }

const allMilestoneCombinations = allCombinations(ecoChallengeMilestoneValues);

export default {
	title: 'Components/Eco Challenge Lightbox',
	component: EcoChallengeLightbox,
	args: {
		progresses: [],
		visible: true
	}
};

export const EcoChallengeLightboxCombo0 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo0.args = {
	progresses: allMilestoneCombinations[0],
};

export const EcoChallengeLightboxCombo1 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo1.args = {
	progresses: allMilestoneCombinations[1],
};

export const EcoChallengeLightboxCombo2 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo2.args = {
	progresses: allMilestoneCombinations[2],
};

export const EcoChallengeLightboxCombo3 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo3.args = {
	progresses: allMilestoneCombinations[3],
};


export const EcoChallengeLightboxCombo4 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo4.args = {
	progresses: allMilestoneCombinations[4],
};

export const EcoChallengeLightboxCombo5 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo5.args = {
	progresses: allMilestoneCombinations[5],
};

export const EcoChallengeLightboxCombo6 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo6.args = {
	progresses: allMilestoneCombinations[6],
};

export const EcoChallengeLightboxCombo7 = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { EcoChallengeLightbox },
	template: `
		<eco-challenge-lightbox
			:visible="visible"
			:progresses="progresses"
		 />
		`,
});

EcoChallengeLightboxCombo7.args = {
	progresses: allMilestoneCombinations[7],
};




