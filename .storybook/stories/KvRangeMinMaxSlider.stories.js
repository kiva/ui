import KvRangeMinMaxSlider from '@/components/Kv/KvRangeMinMaxSlider';

export default {
	title: 'Kv/Form Elements/KvRangeMinMaxSlider',
	component: KvRangeMinMaxSlider,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvRangeMinMaxSlider },
		template: `
			<kv-range-min-max-slider
				:range-min="rangeMin"
				:range-max="rangeMax"
				:step="step"
				:min="min"
				:max="max"
			/>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story();

export const SmallerRange = story({ rangeMin: 0, rangeMax: 5 });

export const LargerStep = story({ step: 10 });

export const Selected = story({ min: 30, max: 50 });
