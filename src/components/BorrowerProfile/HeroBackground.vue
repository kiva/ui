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
			isoCode: null,
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
		contentKey() {
			if (this.isoCode) {
				return `bp-hero-country-${this.isoCode.toLowerCase()}`;
			}
			return this.placeholderKey;
		},
	},
	apollo: {
		query: gql`
			query bpHeroBackgroundCountry($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						geocode {
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
			this.isoCode = loan?.geocode?.country?.isoCode ?? null;
		},
	},
	mounted() {
		this.apollo.query({
			query: gql`
				query bpHeroBackgroundImage($countryKey: String, $placeholderKey: String) {
					contentful {
						country: entries(contentType: "background", contentKey: $countryKey)
						placeholder: entries(contentType: "background", contentKey: $placeholderKey)
					}
				}
			`,
			variables: {
				countryKey: this.contentKey,
				placeholderKey: this.placeholderKey,
			},
		}).then(result => {
			const countryMedia = result?.data?.contentful?.country?.items?.[0]?.fields?.backgroundMedia ?? null;
			const placeholderMedia = result?.data?.contentful?.placeholder?.items?.[0]?.fields?.backgroundMedia ?? {};
			this.contentfulSrc = (countryMedia ?? placeholderMedia)?.fields?.file?.url ?? '';
			this.contentfulAlt = (countryMedia ?? placeholderMedia)?.fields?.description ?? '';
		});
	},
};
</script>
