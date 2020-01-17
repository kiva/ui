<template>
	<www-page>
		<kv-hero class="mg-hero">
			<template v-slot:images>
				<kv-responsive-image
					:images="heroImages"
					alt="A woman in a yellow dress with a look of pride and satisfaction on her face "
				/>
			</template>
			<template v-slot:overlayContent>
				<div class="row">
					<div class="large-7 medium-12 columns">
						<p class="mg-headline">
							Invest in people,<br>
							be a force for good
						</p>
						<p class="mg-subhead">
							<!-- eslint-disable-next-line max-len -->
							Join our Monthly Good program — the simplest way to help entrepreneurs around the world achieve their dreams.
						</p>
						<landing-form
							:amount.sync="monthlyGoodAmount"
							:selected-category.sync="selectedCategory"
							:key="1"
							v-if="!isMonthlyGoodSubscriber"
						/>
						<div class="already-subscribed-msg-wrapper" v-if="isMonthlyGoodSubscriber">
							<h4>
								You're already signed up for Monthly Good.
								Changes to this contribution can be made in your
								<a href="https://www.kiva.org/settings/credit">credit settings</a>.
							</h4>
						</div>
					</div>
				</div>
			</template>
		</kv-hero>
		<how-it-works />
		<email-preview />
		<kiva-as-expert>
			<template v-slot:form>
				<landing-form
					:amount.sync="monthlyGoodAmount"
					:selected-category.sync="selectedCategory"
					:key="2"
					v-if="!isMonthlyGoodSubscriber"
				/>
				<div class="already-subscribed-msg-wrapper" v-if="isMonthlyGoodSubscriber">
					<h4>
						You're already signed up for Monthly Good.
						Changes to this contribution can be made in your
						<a href="https://www.kiva.org/settings/credit">credit settings</a>.
					</h4>
				</div>
			</template>
		</kiva-as-expert>
		<more-about-kiva />
		<frequently-asked-questions />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

import LandingForm from './LandingForm';
import HowItWorks from './HowItWorks';
import EmailPreview from './EmailPreview';
import MoreAboutKiva from './MoreAboutKiva';
import KivaAsExpert from './KivaAsExpert';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';

const pageQuery = gql`{
	my {
		autoDeposit {
			isSubscriber
		}
	}
}`;

const heroImagesRequire = require.context('@/assets/images/mg-landing-hero', true);

export default {
	components: {
		WwwPage,
		LandingForm,
		KvHero,
		KvResponsiveImage,
		HowItWorks,
		EmailPreview,
		MoreAboutKiva,
		KivaAsExpert,
		FrequentlyAskedQuestions
	},
	data() {
		return {
			isMonthlyGoodSubscriber: false,
			monthlyGoodAmount: 25,
			selectedCategory: 'default',
			heroImages: [
				['small', heroImagesRequire('./monthlygood-banner-sm-std.jpg')],
				['small retina', heroImagesRequire('./monthlygood-banner-sm-retina.jpg')],
				['medium', heroImagesRequire('./monthlygood-banner-med-std_0.jpg')],
				['medium retina', heroImagesRequire('./monthlygood-banner-med-retina_0.jpg')],
				['large', heroImagesRequire('./monthlygood-banner-lg-std_0.jpg')],
				['large retina', heroImagesRequire('./monthlygood-banner-lg-retina_0.jpg')],
				['xga', heroImagesRequire('./monthlygood-banner-xl-std_0.jpg')],
				['xga retina', heroImagesRequire('./monthlygood-banner-xl-retina_0.jpg')],
				['wxga', heroImagesRequire('./monthlygood-banner-xxl-std.jpg')],
				['wxga retina', heroImagesRequire('./monthlygood-banner-xxl-retina.jpg')],
			],
		};
	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
		},
	},

};

</script>

<style lang="scss" scoped>
@import 'settings';

.already-subscribed-msg-wrapper {
	background-color: $vivid-yellow;
	padding: 0.625rem;
	margin-top: 1.25rem;
}

.mg-hero {
	margin-bottom: 0;

	::v-deep form {
		// overwrite styles for error display over hero image
		.validation-errors {
			border: 1px solid $charcoal;
			background-color: rgba(255, 255, 255, 0.7);
			padding: 0.15rem 0 0 0.45rem;
			line-height: 1.25rem;
			width: 100%;
		}
	}

	//set min height to improve sizing when image has not loaded yet
	min-height: 100px;
	@media only screen and (min-width: 761px) {
		min-height: 355px;
	}
	@media only screen and (min-width: 1025px) {
		min-height: 440px;
	}
}

.page-content {
	padding: 1.625rem 0;
}

.mg-headline,
.mg-subhead {
	color: white;
	text-shadow: 1px 1px 3px #333;
	margin: 0;
}

.mg-headline {
	font-weight: bold;
	font-size: 2rem;
	line-height: 2rem;

	@media only screen and (min-width: 800px) {
		font-size: 2.375rem;
		line-height: 2.375rem;
	}
}

.mg-subhead {
	padding: 0;
	font-size: 1.2rem;
	line-height: 1.35rem;
	margin-bottom: 0.65rem;

	@media only screen and (min-width: 800px) {
		padding-top: 0.875rem;
		font-size: 1.5rem;
		line-height: 1.75rem;
		margin-bottom: 1rem;
	}
}
</style>
