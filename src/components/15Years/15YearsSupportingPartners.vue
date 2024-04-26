<template>
	<section class="supporting-partners tw-text-center">
		<div class="supporting-partners__selected">
			<h4>
				Strategic partners supporting this celebration
			</h4>
			<ul class="supporting-partners__list row align-center">
				<li
					class="supporting-partners__li small-6 large-4 columns"
					v-for="partner in supportingPartners"
					:key="partner.key"
				>
					<img
						:class="`supporting-partners__logo supporting-partners__logo--${partner.key}`"
						:src="partner.logo"
						:alt="partner.alt"
						loading="lazy"
					>
				</li>
			</ul>
			<fifteen-years-button
				href="/about/partner-with-us/"
				v-kv-track-event="[
					'Kiva15',
					'click-strategic-partners-CTA',
					'Partner With Us'
				]"
			>
				Partner with us
			</fifteen-years-button>
		</div>
	</section>
</template>

<script>
import FifteenYearsButton from './15YearsButton';

const imgRequire = require.context('@/assets/images/15-years/partners/', true);

export default {
	name: '15YearsSupportingPartners',
	components: {
		FifteenYearsButton,
	},
	data() {
		return {
			supportingPartners: [
				{
					key: 'chess',
					logo: imgRequire('./Partner-chess24.svg'),
					alt: 'Chess24'
				},
				{
					key: 'cisco',
					logo: imgRequire('./Partner-cisco.svg'),
					alt: 'Cisco'
				},
				{
					key: 'paypal',
					logo: imgRequire('./Partner-paypal-bw.svg'),
					alt: 'PayPal'
				},
				{
					key: 'farfetch',
					logo: imgRequire('./Partner-farfetch.svg'),
					alt: 'Positively Farfetch'
				},
				{
					key: 'women',
					logo: imgRequire('./Partner-women.svg'),
					alt: 'Women and Girls Empowered'
				}
			],
		};
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

.supporting-partners {
	padding-top: 7rem;

	&__selected {
		max-width: 30rem;
		margin: 0 auto;
	}

	&__list {
		list-style: none;
		margin: 5rem 0 3.5rem 0;
	}

	&__li {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 1rem 3rem 1rem;
	}

	&__logo {
		width: 100%;
		height: auto;

		&--women {
			width: rem-calc(112);
		}

		&--cisco {
			width: rem-calc(112);
		}

		&--paypal {
			width: rem-calc(140);
		}

		&--chess {
			width: rem-calc(141);
		}
	}
}
</style>
