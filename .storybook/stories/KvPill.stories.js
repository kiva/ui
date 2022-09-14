import KvPill from '@/components/Kv/KvPill';
import IconClimate from '@/assets/icons/inline/eco-challenge/globe-leaf.svg';

export default {
	title: 'Kv/KvPill',
	component: KvPill,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvPill,
		IconClimate
	},
	template: `
		<kv-pill>
			<template #icon>
				<icon-climate class="tw-h-3 tw-w-2 tw-mr-0.5" />
			</template>
			<template #text>Climate challenge</template>
		</kv-pill>
	`,
});

