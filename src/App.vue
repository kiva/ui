<template>
	<div id="app">
		<router-view/>
		<vue-progress-bar/>
	</div>
</template>

<script>
import 'foundation/foundation.core';
import 'foundation/foundation.util.mediaQuery';

export default {
	name: 'App',
	props: {
		appConfig: { type: Object, default: () => {} }
	},
	metaInfo() {
		return {
			title: 'Loans that change lives',
			titleTemplate: '%s | Kiva',
			meta: [
				{
					vmid: 'keywords',
					name: 'keywords',
					// eslint-disable-next-line max-len
					content: 'kiva, microfinance, microcredit, microloan, microlending, loan, africa, business, philanthropy, international development, projects, corporate giving, corporate philanthropy, donors, donating, donation, charity, social development, economic development, grassroots development, employee giving, poverty alleviation, economic investments, social investment, entrepreneur, entrepreneurs, social entrepreneurship, innovation, giving, give, gift, gifts'
				},
				{
					vmid: 'description',
					name: 'description',
					// eslint-disable-next-line max-len
					content: 'Make a loan to an entrepreneur across the globe for as little as $25. Kiva is the world\'s first online lending platform connecting online lenders to entrepreneurs across the globe.'
				}
			].concat(this.appConfig.enableFB ? [
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: 'Kiva - Loans that change lives'
				},
				{
					vmid: 'fb:app_id',
					property: 'fb:app_id',
					content: this.appConfig.fbApplicationId
				}
			] : [])
		};
	}
};
</script>

<style lang="scss">
// import all the variables
@import 'settings';
@import 'foundation';

// import fonts first to start loading them
@import 'global/fonts';

// import global foundation components
@include foundation-global-styles;
@include foundation-flex-grid;
@include foundation-visibility-classes;
@include foundation-typography;
@include foundation-forms;

// import global styles
@import 'global/page-layout';
@import 'global/line-breaks';
@import 'global/typography';
@import 'global/forms';

#app {
	height: 100%;
}
</style>
