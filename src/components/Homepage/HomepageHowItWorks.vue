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
		<ol class="row how-it-works__list">
			<li
				v-for="step in stepsText"
				:key="step.key"
				class="how-it-works__li small-12 xxlarge-3 columns"
			>
				<kv-contentful-img
					v-if="step.image.url"
					class="how-it-works__img"
					:contentful-src="step.image.url"
					:alt="step.image.description"
					:height="115"
					loading="lazy"
					fallback-format="png"
				/>
				<p
					v-html="step.headline"
					class="how-it-works__subtitle"
				>
				</p>
				<p v-html="step.subHeadline"></p>
			</li>
		</ol>
	</section>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

export default {
	components: {
		KvContentfulImg
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		howItWorksText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-how-it-works-text') > -1);
		},
		howItWorksHeadline() {
			return this.howItWorksText?.headline ?? '';
		},
		howItWorksSubhead() {
			return this.howItWorksText?.subHeadline ?? '';
		},
		stepsText() {
			const allStepsText = this.content?.contents?.filter(({ key }) => key.indexOf('step-text') > -1);
			return allStepsText?.map((step, index) => ({
				key: step.key || index,
				headline: step.headline ?? '',
				subHeadline: step.subHeadline ?? '',
				image: this.stepImages[index],
			}));
		},
		stepImages() {
			const images = this.content?.media ?? [];
			return images.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		},
	}
};

</script>
<style lang="scss" scoped>
@import 'settings';

.how-it-works {
	padding: 2rem 0;

	&__list {
		list-style: none;

		@include breakpoint(large) {
			margin-top: rem-calc(30);
		}
	}

	&__img {
		margin-bottom: rem-calc(10);
	}

	&__subtitle {
		font-weight: bold;
		font-size: 1.5rem;
		margin-bottom: rem-calc(6);
	}
}

</style>
