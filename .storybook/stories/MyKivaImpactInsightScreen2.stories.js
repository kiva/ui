import MyKivaImpactInsightScreen2 from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightScreen2.vue';

export default {
    title: 'MyKiva/ImpactInsight/MyKivaImpactInsightScreen2',
    component: MyKivaImpactInsightScreen2,
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { MyKivaImpactInsightScreen2 },
        setup() { return { args }; },
        template: `
            <div style="max-width: 888px; max-height:400px">
                <MyKivaImpactInsightScreen2 v-bind="args" />
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
        whySpecial: 'it will allow Fundación Paraguaya to improve the conditions of the Instituto Belén and provide high-quality education and employment opportunities for low-income young populations in remote areas of Paraguay.'
    },
});
