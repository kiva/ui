<template>
	<component :is="activeHomepage" />
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import gql from 'graphql-tag';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';
import numeral from 'numeral';

const ContentfulPage = () => import('@/pages/ContentfulPage');

const homePageQuery = gql`query homepageFrame {
	hasEverLoggedIn @client
	general {
		newHomeLayoutExp: uiExperimentSetting(key: "new_home_layout") {
			key
			value
		}
	}
}`;

export default {
	name: 'Homepage',
	inject: ['apollo', 'cookieStore'],
	metaInfo() {
		/* eslint-disable global-require */
		// Remove once New Yeah Share Campaign ends
		const imageUrl = this.loadNYShare
			? 'https://via.placeholder.com/1200x630'
			: 'https://www-kiva-org.freetls.fastly.net/cms/kiva-og-image.jpg';
		const description = this.loadNYShare
			? this.nyShareCopy
			: 'Kiva is the world\'s first online lending platform. '
			+ 'For as little as $25 you can lend to an entrepreneur around the world. Learn more here.';
		return {
			title: 'Make a loan, change a life',
			meta: [
				{
					name: 'google-site-verification', // for Google Search Console
					content: 'vpxnq5XBGa1PgE4hhyEollJr4uEzN7mrC30iJxzuW_M'
				},
				{
					vmid: 'description',
					name: 'description',
					content: description
				},
				// Remove once New Yeah Share Campaign ends
				{
					property: 'og:image',
					vmid: 'og:image',
					content: imageUrl
				},
				{
					name: 'twitter:image',
					vmid: 'twitter:image',
					content: imageUrl
				},
			],
			script: [
				// Organization schema. This is defined in here in the Homepage instead of App.vue or
				// somewhere else because the schema should be defined on only one page.
				{
					type: 'application/ld+json',
					json: {
						'@context': 'https://schema.org',
						'@type': 'NGO',
						name: 'Kiva',
						alternateName: 'Kiva Loans',
						legalName: 'Kiva Microfunds',
						url: 'https://www.kiva.org/',
						logo: require('@/assets/images/kiva_logo_filled.png'),
						address: {
							'@type': 'PostalAddress',
							streetAddress: '986 Mission Street, 4th Floor',
							addressLocality: 'San Francisco',
							addressRegion: 'CA',
							postalCode: '94103',
							addressCountry: 'USA',
						},
						nonprofitStatus: 'Nonprofit501c3',
						foundingDate: '2005-10-01',
						telephone: '828-479-5482',
						sameAs: [
							'https://www.facebook.com/kiva',
							'https://twitter.com/Kiva',
							'https://www.instagram.com/kiva.org/',
							'https://www.youtube.com/channel/UCr304RURWaQUnDha9hDvW3g',
							'https://www.linkedin.com/company/kiva-org/',
							'https://en.wikipedia.org/wiki/Kiva_(organization)',
							'https://www.pinterest.com/kivaorg/',
							'https://www.kiva.global/',
							'https://apps.apple.com/app/id1453093374',
							'https://play.google.com/store/apps/details?id=org.kiva.lending'
						]
					},
				},
			],
		};
	},
	created() {
		// Remove once New Yeah Share Campaign ends
		if (this.$route?.query?.nyshare) {
			this.loadNYShare = true;
		}
	},
	data() {
		return {
			activeHomepage: ContentfulPage,
			hasEverLoggedIn: false,
			// Remove once New Yeah Share Campaign ends
			loadNYShare: false
		};
	},
	apollo: {
		query: homePageQuery,
		preFetch(config, client, args) {
			return client.query({
				query: homePageQuery
			}).then(() => {
				return client.query({ query: experimentAssignmentQuery, variables: { id: 'new_home_layout' } });
			}).then(async result => {
				// Call preFetch for the active homepage
				const expVersion = result?.data?.experiment?.version;

				if (expVersion === 'c') {
					return Promise.reject({	path: '/pgtmp/home' });
				}

				const component = await ContentfulPage();
				return preFetchAll([component?.default], client, args);
			});
		}
	},
	computed: {
		nyShareCopy() {
			const loans = numeral(this.$route?.query?.nyl);
			const loanString = `${loans.format('0,0')} ${loans.value() === 1 ? 'loan' : 'loans'}`;
			const borrowers = numeral(this.$route?.query?.nyb);
			const borrowerString = `${borrowers.format('0,0')} ${borrowers.value() === 1 ? 'borrower' : 'borrowers'}`;
			const countries = numeral(this.$route?.query?.nyc);
			const countryString = `${countries.format('0,0')} ${countries.value() === 1 ? 'country' : 'countries'}`;
			return `In 2022 I lent to ${loanString}, and helped ${borrowerString} in ${countryString} succeed.`;
		}
	},
	mounted() {
		const homePageExp = this.apollo.readFragment({
			id: 'Experiment:new_home_layout',
			fragment: experimentVersionFragment,
		}) || {};

		if (homePageExp?.version === 'a' || homePageExp?.version === 'b') {
			this.$kvTrackEvent(
				'Homepage',
				'EXP-MARS-222-Oct2022',
				homePageExp.version,
			);
		}
	},
};
</script>
