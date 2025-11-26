import { mdiEmailOutline } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';

import ThankYouCard from '#src/components/MyKiva/ThankYouCard.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

export default {
    title: 'MyKiva/ThankYouCard',
    component: ThankYouCard,
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { ThankYouCard, KvMaterialIcon, mdiEmailOutline },
        mixins: [apolloStoryMixin()],
        setup() { return { args }; },
		data() {
			return {
				mdiEmailOutline
			};
		},
        template: `
            <div style="width: 336px;">
                <ThankYouCard v-bind="args">
                    <template #header>
						<span
							class="tw-inline-flex tw-items-center tw-gap-1 tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5"
						>
							<KvMaterialIcon
								class="tw-w-2 tw-h-2 tw-shrink-0"
								:icon="mdiEmailOutline"
							/>
							<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
								Email updates
							</span>
						</span>
					</template>
					<template #content>
						<span>We’ll keep you updated. Change your <a
							href="/settings/email"
							target="_blank"
							v-kv-track-event="['portfolio', 'click', 'email-preferences-settings']"
						>email preferences</a> at any time.</span>
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
					<p>
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
                        <p>
                            Your generous loan of $25 will help Maria expand her business
                            and provide for her family. Together, we're building a better future.
                        </p>
                    </template>
                </ThankYouCard>
            </div>
        `,
});
