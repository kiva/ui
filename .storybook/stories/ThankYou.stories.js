import ThankYouCard from '#src/components/MyKiva/ThankYouCard.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

export default {
    title: 'MyKiva/ThankYouCard',
    component: ThankYouCard,
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { ThankYouCard },
        mixins: [apolloStoryMixin()],
        setup() { return { args }; },
        template: `
            <div style="width: 336px;">
                <ThankYouCard v-bind="args">
                    <template #header>
                        <h3 class="tw-text-center tw-m-0">You made a difference!</h3>
                    </template>
                    <template #content>
                        <p class="tw-text-center tw-text-base">
                            Your contribution helps create opportunities for borrowers around the world.
                        </p>
                    </template>
                </ThankYouCard>
            </div>
        `,
    });
    template.args = args;
    return template;
};

export const Default = story({});

export const WithCustomHeader = (_args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { ThankYouCard },
	mixins: [apolloStoryMixin()],
	setup() { return { args }; },
	template: `
		<div style="width: 336px;">
			<ThankYouCard>
				<template #header>
					<h3 class="tw-text-center tw-m-0 tw-text-action-highlight">Achievement Unlocked!</h3>
				</template>
				<template #content>
					<p class="tw-text-center tw-text-base">
						You've supported 10 borrowers this year!
					</p>
				</template>
			</ThankYouCard>
		</div>
	`,
});

export const WithLongContent = (_args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { ThankYouCard },
	mixins: [apolloStoryMixin()],
	setup() { return { args }; },
	template: `
            <div style="width: 336px;">
                <ThankYouCard>
                    <template #header>
                        <h3 class="tw-text-center tw-m-0">Amazing work!</h3>
                    </template>
                    <template #content>
                        <p class="tw-text-center tw-text-base">
                            Your generous loan of $25 will help Maria expand her business
                            and provide for her family. Together, we're building a better future.
                        </p>
                    </template>
                </ThankYouCard>
            </div>
        `,
});
