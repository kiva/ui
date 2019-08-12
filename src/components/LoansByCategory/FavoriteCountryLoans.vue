<template>
	<div v-if="isLoggedIn" class="most-lent-country-holder" :class="{ 'favorite-country-loans-loaded': isLoaded }">
		<div v-if="showFavoriteCountry">
			<div v-if="isLoaded">
				<category-row
					class="loan-category-row"
					:key="favoriteCountryCategory.id"
					:loan-channel="favoriteCountryCategory"
					:items-in-basket="itemsInBasket"
					:row-number="-1"
					set-id="CASH-794-favorite-country"
					:is-logged-in="isLoggedIn"
					:show-category-description="showCategoryDescription"
					:show-expandable-loan-cards="showExpandableLoanCards"
					@scrolling-row="handleScrollingRow"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import favoriteCountryQuery from '@/graphql/query/lendByCategory/favoriteCountry.graphql';
import basicLoanData from '@/graphql/query/basicLoanData.graphql';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import cookieStore from '@/util/cookieStore';
import logReadQueryError from '@/util/logReadQueryError';

export default {
	components: {
		CategoryRow,
	},
	inject: ['apollo'],
	props: {
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		showCategoryDescription: {
			type: Boolean,
			default: false,
		},
		showExpandableLoanCards: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			favoriteCountryLoans: [],
			isLoaded: false
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: favoriteCountryQuery
			}).then(data => {
				const favoriteCountry = _get(data, 'data.my.recommendations.topCountry');
				// skip if no favorite country
				if (favoriteCountry === undefined) return null;

				return client.query({
					query: basicLoanData,
					variables: {
						filters: { country: favoriteCountry },
						limit: 12
					},
				});
			}).then(loanData => {
				// skip if no loan data
				if (loanData === null) return null;
				return _get(loanData, 'data.lend.loans.values');
			});
		}
	},
	computed: {
		showFavoriteCountry() {
			if (this.favoriteCountryLoans.length > 0) {
				return true;
			}
			return false;
		},
		favoriteCountryCategory() {
			const loans = this.favoriteCountryLoans || [];
			const countryName = _get(this.favoriteCountryLoans, '[0].geocode.country.name');
			const countryRegion = _get(this.favoriteCountryLoans, '[0].geocode.country.region');
			const countryTitle = countryName || 'your favorite country';
			let countryTitleAugmented = countryTitle;
			if (countryName === 'United States') {
				countryTitleAugmented = `the ${countryTitle}`;
			}
			const countryQuery = `${countryRegion} > ${countryName}`;
			const filterQuery = `?countries=${encodeURIComponent(countryQuery)}`;
			return {
				id: 99,
				name: `Support more borrowers in ${countryTitleAugmented}`,
				// sample algolia location query location=North%20America~United%20States
				url: `favorite-countries-link/lend/filter${countryName !== undefined ? filterQuery : ''}`,
				loans: {
					values: loans,
				},
			};
		},
	},
	created() {
		const basketId = cookieStore.get('kvbskt');

		let favoriteCountryData;

		try {
			const favoriteCountryCodeData = this.apollo.readQuery({
				query: favoriteCountryQuery,
				variables: { basketId },
			});
			const favoriteCountry = _get(favoriteCountryCodeData, 'my.recommendations.topCountry') || 'us';
			favoriteCountryData = this.apollo.readQuery({
				query: basicLoanData,
				variables: {
					filters: { country: favoriteCountry },
					limit: 12,
					basketId,
				},
			});
		} catch (e) {
			logReadQueryError(e, 'FavoriteCountryLoans favoriteCountryQueryOrData');
		}

		const favoriteCountryLoans = _get(favoriteCountryData, 'lend.loans.values');
		if (favoriteCountryLoans !== undefined && favoriteCountryLoans.length > 0) {
			this.isLoaded = true;
			this.favoriteCountryLoans = favoriteCountryLoans;
		}
	},
	methods: {
		handleScrollingRow() {
			this.$emit('scrolling-row');
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

</style>
