import MyKivaSurveyCard from '#src/components/MyKiva/MyKivaSurveyCard.vue';

export default {
    title: 'MyKiva/MyKivaSurveyCard',
    component: MyKivaSurveyCard,
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { MyKivaSurveyCard },
        setup() { return { args }; },
        template: `
            <div style="width: 336px;">
                <MyKivaSurveyCard v-bind="args" />
            </div>
        `,
    });
    template.args = args;
    return template;
};

export const Default = story({});
