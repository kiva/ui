import MyKivaImpactInsightScreen1 from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightScreen1.vue';

export default {
    title: 'MyKiva/ImpactInsight/MyKivaImpactInsightScreen1',
    component: MyKivaImpactInsightScreen1,
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { MyKivaImpactInsightScreen1 },
        setup() { return { args }; },
        template: `
            <div style="max-width: 888px; max-height:400px">
                <MyKivaImpactInsightScreen1 v-bind="args" />
            </div>
        `,
    });
    template.args = args;
    return template;
};

export const Default = story({
    latestLoan: {
        id: 1975833,
        name: 'Mayram',
        image: {
            hash: '9673d0722a7675b9b8d11f90849d9b44',
        },
		geocode: {
			country: {
				geocode:{
					latitude: -16,
					longitude: 167
				},
				id: 231,
				isoCode: 'VU',
				name: 'Vanuatu',
				ppp: '$89,599'
			}
		}
    },
});
