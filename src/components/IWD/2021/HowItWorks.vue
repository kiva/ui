<template>
	<section class="how-it-works section text-center">
		<div class="row">
			<p
				v-html="howItWorksHeadline"
				class="how-it-works__header large-text small-12 columns"
			>
			</p>
			<p
				v-html="howItWorksSubhead"
				class="large-6 large-offset-3 columns"
			>
			</p>
		</div>
		<ol class="how-it-works__list row">
			<li class="how-it-works__li small-12 xxlarge-3 columns">
				<img
					v-if="step1Image.url"
					class="how-it-works__img"
					:src="step1Image.url"
					:alt="step1Image.description"
				>
				<p
					v-html="step1Text[0]"
					class="how-it-works__subtitle"
				>
				</p>
				<p v-html="step1Text[1]"></p>
			</li>
			<li class="how-it-works__li small-12 xxlarge-3 columns">
				<img
					v-if="step2Image.url"
					class="how-it-works__img"
					:src="step2Image.url"
					:alt="step2Image.description"
				>
				<p
					v-html="step2Text[0]"
					class="how-it-works__subtitle"
				>
				</p>
				<p v-html="step2Text[1]"></p>
			</li>
			<li class="how-it-works__li small-12 xxlarge-3 columns">
				<img
					v-if="step3Image.url"
					class="how-it-works__img"
					:src="step3Image.url"
					:alt="step3Image.description"
				>
				<p
					v-html="step3Text[0]"
					class="how-it-works__subtitle"
				>
				</p>
				<p v-html="step3Text[1]"></p>
			</li>
			<li class="how-it-works__li small-12 xxlarge-3 columns">
				<img
					v-if="step4Image.url"
					class="how-it-works__img"
					:src="step4Image.url"
					:alt="step4Image.description"
				>
				<p
					v-html="step4Text[0]"
					class="how-it-works__subtitle"
				>
				</p>
				<p v-html="step4Text[1]"></p>
			</li>
		</ol>
	</section>
</template>

<script>
export default {
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		howItworksText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('iwd-2021-homepage-how-it-works-text') > -1);
		},
		howItWorksHeadline() {
			return this.howItworksText?.headline ?? '';
		},
		howItWorksSubhead() {
			return this.howItworksText?.subHeadline ?? '';
		},
		step1Text() {
			const stepOneText = this.content?.contents?.find(({ key }) => key.indexOf('step-1-text') > -1);
			const stepOneTitle = stepOneText.richText?.content[0]?.content[0].value;
			const stepOneSubheading = stepOneText.richText?.content[1]?.content[0].value;
			const stepOneTextGroup = [];
			stepOneTextGroup.push(stepOneTitle, stepOneSubheading);
			return stepOneTextGroup;
		},
		step2Text() {
			const stepTwoText = this.content?.contents?.find(({ key }) => key.indexOf('step-2-text') > -1);
			const stepTwoTitle = stepTwoText.richText?.content[0]?.content[0].value;
			const stepTwoSubheading = stepTwoText.richText?.content[1]?.content[0].value;
			const stepTwoTextGroup = [];
			stepTwoTextGroup.push(stepTwoTitle, stepTwoSubheading);
			return stepTwoTextGroup;
		},
		step3Text() {
			const stepThreeText = this.content?.contents?.find(({ key }) => key.indexOf('step-3-text') > -1);
			const stepThreeTitle = stepThreeText.richText?.content[0]?.content[0].value;
			const stepThreeSubheading = stepThreeText.richText?.content[1]?.content[0].value;
			const stepThreeTextGroup = [];
			stepThreeTextGroup.push(stepThreeTitle, stepThreeSubheading);
			return stepThreeTextGroup;
		},
		step4Text() {
			const stepFourText = this.content?.contents?.find(({ key }) => key.indexOf('step-4-text') > -1);
			const stepFourTitle = stepFourText.richText?.content[0]?.content[0].value;
			const stepFourSubheading = stepFourText.richText?.content[1]?.content[0].value;
			const stepFourTextGroup = [];
			stepFourTextGroup.push(stepFourTitle, stepFourSubheading);
			return stepFourTextGroup;
		},
		step1Image() {
			const mediaObject = this.content?.media?.[0];
			return {
				description: mediaObject?.description ?? '',
				title: mediaObject?.title ?? '',
				url: mediaObject?.file?.url ?? ''
			};
		},
		step2Image() {
			const mediaObject = this.content?.media?.[1];
			return {
				description: mediaObject?.description ?? '',
				title: mediaObject?.title ?? '',
				url: mediaObject?.file?.url ?? ''
			};
		},
		step3Image() {
			const mediaObject = this.content?.media?.[2];
			return {
				description: mediaObject?.description ?? '',
				title: mediaObject?.title ?? '',
				url: mediaObject?.file?.url ?? ''
			};
		},
		step4Image() {
			const mediaObject = this.content?.media?.[3];
			return {
				description: mediaObject?.description ?? '',
				title: mediaObject?.title ?? '',
				url: mediaObject?.file?.url ?? ''
			};
		},
	}
};

</script>
<style lang="scss" scoped>
@import 'settings';

.how-it-works {
	&__list {
		list-style: none;
	}

	&__subtitle {
		font-weight: bold;
		font-size: 1.5rem;
		margin-bottom: rem-calc(6);
	}
}

</style>
