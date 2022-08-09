<template>
	<div
		class="tw-max-w-5xl tw-mx-auto
			tw-py-3 md:tw-py-6 lg:tw-py-8 tw-px-4 lg:tw-px-2"
		id="more-about-kiva"
	>
		<div class="tw-flex tw-justify-center tw-w-full">
			<kiva-logo-mg />
		</div>
		<h2 class="tw-text-h2 tw-py-3 tw-mx-auto tw-text-center">
			<!-- eslint-disable-next-line max-len -->
			Kiva is an international nonprofit that believes in financial access for all.
		</h2>
		<p class="tw-text-subhead tw-text-center">
			<!-- eslint-disable-next-line max-len -->
			We do this by crowdfunding loans, unlocking capital, and addressing the underlying barriers to financial access around the world. With Kiva, a small amount of money makes a big difference in someone's life.
		</p>
	</div>
</template>

<script>
import kivaLogoMg from '@/assets/inline-svgs/logos/kivalogo_credibility_mg.svg';

export default {
	name: 'MoreAboutKiva',
	components: {
		kivaLogoMg
	},
	data() {
		return {
		};
	},

};
</script>
