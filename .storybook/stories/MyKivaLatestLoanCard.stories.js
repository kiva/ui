import MyKivaLatestLoanCard from '#src/components/MyKiva/MyKivaLatestLoanCard.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

export default {
    title: 'MyKiva/MyKivaLatestLoanCard',
    component: MyKivaLatestLoanCard,
};

const loanMock = {
    id: 2722925,
    name: 'Moses',
    image: {
        hash: '093374973a7cfb1f18652d3aac5bbd05',
    },
    geocode: {
        country: {
            isoCode: "EC",
            name: "Ecuador",
            geocode: {
                latitude: -0.9676533,
                longitude: -80.7089101,
            },
        },
    },
    borrowerCount: 1,
    themes: [],
    gender: 'female',
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { MyKivaLatestLoanCard },
        mixins: [apolloStoryMixin()],
        setup() { return { args }; },
        template: `
            <div style="width: 336px;">
                <MyKivaLatestLoanCard v-bind="args" />
            </div>
        `,
    });
    template.args = args;
    return template;
};

export const Default = story({
    loan: loanMock,
});

export const Plural = story({
    loan: {
        ...loanMock,
        name: 'Siara Group',
        borrowerCount: 2,
        geocode: {
            country: {
                isoCode: "US",
                name: "United States",
                geocode: {
                    latitude: 39.76,
                    longitude: -98.5,
                },
            },
        },
    },
});
