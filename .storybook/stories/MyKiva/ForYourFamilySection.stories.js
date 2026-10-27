import ForYourFamilySection from '#src/components/MyKiva/ForYourFamilySection';

export default {
	title: 'MyKiva/ForYourFamilySection',
	component: ForYourFamilySection,
	parameters: {
		layout: 'fullscreen',
		chromatic: { viewports: [414, 834, 1440] },
	},
};

const Template = args => ({
	components: { ForYourFamilySection },
	setup() { return { args }; },
	template: `
		<div class="tw-bg-eco-green-1 tw-p-2 md:tw-p-4">
			<div class="tw-mx-auto" style="max-width: 1073px;">
				<ForYourFamilySection v-bind="args" />
			</div>
		</div>
	`,
});

export const Default = Template.bind({});

export const WithName = Template.bind({});
WithName.args = { bdayCardName: 'Tanya' };

export const WithoutBirthdayCard = Template.bind({});
WithoutBirthdayCard.args = { hideBdayCard: true };

export const Mobile = Template.bind({});
Mobile.parameters = {
	viewport: { defaultViewport: 'mobile1' },
};
