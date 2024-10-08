import KvSectionModalLoader from '#src/components/Kv/KvSectionModalLoader';

export default {
	title: 'Kv/KvSectionModalLoader',
	component: KvSectionModalLoader,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvSectionModalLoader },
		setup() { return args; },
		template: `
			<div style="height: 200px; width: 200px; background: gray; position: relative;">
				<kv-section-modal-loader
					:loading="true"
					:bg-color="bgColor"
					:rounded="rounded"
					:size="size" />
			</div>
		`,
	})
	return template;
};

export const Default = story();

export const BgColor = story({ bgColor: 'danger' });

export const Rounded = story({ rounded: true });

export const Large = story({ size: 'large' });
