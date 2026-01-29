import MyKivaImpactInsightScreen4 from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightScreen4.vue';

export default {
    title: 'MyKiva/ImpactInsight/MyKivaImpactInsightScreen4',
    component: MyKivaImpactInsightScreen4,
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { MyKivaImpactInsightScreen4 },
        setup() { return { args }; },
        template: `
            <div style="max-width: 888px; max-height:400px">
                <MyKivaImpactInsightScreen4 v-bind="args" />
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
		gender: 'female',
    },
});


export const NoFemaleLoan = story({
    latestLoan: {
		amount: '-75.00',
        id: 1975833,
        name: 'Mayram',
		gender: 'male',
    },
});
