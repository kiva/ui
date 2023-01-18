<template>
	<div
		class="
			tw-hidden md:tw-block
			tw-w-full tw-h-40 lg:tw-h-57.5
			tw-bg-gradient-to-r tw-from-brand tw-to-brand-300
		"
	>
		<kv-contentful-img
			class="tw-w-full tw-h-full tw-object-cover"
			:contentful-src="contentfulSrc"
			fallback-format="jpg"
			fit="fill"
			:alt="contentfulAlt"
			:width="1024"
			:height="320"
			:source-sizes="sourceSizes"
		/>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';

export default {
	name: 'HeroBackground',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvContentfulImg,
	},
	data() {
		return {
			contentfulAlt: '',
			contentfulSrc: '',
			isoCode: '',
			stateCode: '',
			city: '',
			placeholderKey: 'bp-hero-country-placeholder',
			sourceSizes: [
				{
					width: 1920,
					height: 460,
					media: 'min-width: 1024px' // large
				},
				{
					width: 1024,
					height: 320,
					media: 'min-width: 734px' // medium
				},
			],
		};
	},
	computed: {
		cityKey() {
			return `${this.stateKey}-${this.city.toLowerCase()}`;
		},
		stateKey() {
			return `${this.countryKey}-${this.stateCode.toLowerCase()}`;
		},
		countryKey() {
			return `bp-hero-country-${this.isoCode.toLowerCase()}`;
		},
	},
	apollo: {
		query: gql`
			query bpHeroBackgroundCountry($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						geocode {
							city
							state
							country {
								isoCode
							}
						}
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loanId: Number(route?.params?.id ?? 0),
			};
		},
		variables() {
			return {
				loanId: Number(this.$route?.params?.id ?? 0),
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan ?? {};
			this.isoCode = loan?.geocode?.country?.isoCode ?? '';
			this.stateCode = loan?.geocode?.state ?? '';
			this.city = loan?.geocode?.city ?? '';
		},
	},
	mounted() {
		this.apollo.query({
			query: gql`
				query bpHeroBackgroundImage(
					$stateKey: String,
					$cityKey: String,
					$countryKey: String,
					$placeholderKey: String
					) {
					contentful {
						city: entries(contentType: "background", contentKey: $cityKey)
						state: entries(contentType: "background", contentKey: $stateKey)
						country: entries(contentType: "background", contentKey: $countryKey)
						placeholder: entries(contentType: "background", contentKey: $placeholderKey)
					}
				}
			`,
			variables: {
				cityKey: this.cityKey,
				stateKey: this.stateKey,
				countryKey: this.countryKey,
				placeholderKey: this.placeholderKey,
			},
		}).then(result => {
			const cityMedia = result?.data?.contentful?.city?.items?.[0]?.fields?.backgroundMedia ?? null;
			const stateMedia = result?.data?.contentful?.state?.items?.[0]?.fields?.backgroundMedia ?? null;
			const countryMedia = result?.data?.contentful?.country?.items?.[0]?.fields?.backgroundMedia ?? null;
			const placeholderMedia = result?.data?.contentful?.placeholder?.items?.[0]?.fields?.backgroundMedia ?? null;
			if (cityMedia) {
				this.contentfulSrc = cityMedia?.fields?.file?.url ?? null;
				this.contentfulAlt = cityMedia?.fields?.description ?? null;
			} else if (stateMedia) {
				this.contentfulSrc = stateMedia?.fields?.file?.url ?? null;
				this.contentfulAlt = stateMedia?.fields?.description ?? null;
			} else if (countryMedia) {
				this.contentfulSrc = countryMedia?.fields?.file?.url ?? null;
				this.contentfulAlt = countryMedia?.fields?.description ?? null;
			} else if (placeholderMedia) {
				this.contentfulSrc = placeholderMedia?.fields?.file?.url ?? null;
				this.contentfulAlt = placeholderMedia?.fields?.description ?? null;
			}
		});
	},
};
</script>
