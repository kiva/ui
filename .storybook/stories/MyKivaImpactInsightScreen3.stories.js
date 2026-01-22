import MyKivaImpactInsightScreen3 from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightScreen3.vue';

export default {
    title: 'MyKiva/ImpactInsight/MyKivaImpactInsightScreen3',
    component: MyKivaImpactInsightScreen3,
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { MyKivaImpactInsightScreen3 },
        setup() { return { args }; },
        template: `
            <div style="max-width: 888px; max-height:400px">
                <MyKivaImpactInsightScreen3 v-bind="args" />
            </div>
        `,
    });
    template.args = args;
    return template;
};

export const Default = story({
    latestLoan: {
		amount: '-75.00',
        id: 1975833,
        name: 'Mayram',
		geocode: {
			country: { }
		}
    },
});
