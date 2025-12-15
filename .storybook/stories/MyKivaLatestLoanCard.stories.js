import MyKivaLatestLoanCard from '#src/components/MyKiva/MyKivaLatestLoanCard.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

export default {
    title: 'MyKiva/MyKivaLatestLoanCard',
    component: MyKivaLatestLoanCard,
};

const mockEmailUpdatesLoans = [
    {
        id: 2722925,
        name: 'Moses',
        image: {
            hash: '093374973a7cfb1f18652d3aac5bbd05',
        },
    },
    {
        id: 1975833,
        name: 'Alan',
        image: {
            hash: '9673d0722a7675b9b8d11f90849d9b44',
        },
    },
];

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
    loans: [mockEmailUpdatesLoans[0]],
});
