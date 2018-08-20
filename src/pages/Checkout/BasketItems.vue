<template>
	<div class="basket-items-list">
		<ul>
			<li v-for="loan in loans" :key="loan.id">
				<div class="loan-info-wrapper">
					<img class="small-2 loan-img" :src="loan.loan.image.url" :alt="loan.loan.name">
					<span class="small-10 loan-info">
						<div class="borrower-info featured-text">
							{{ loan.loan.name }} in {{ loan.loan.geocode.country.name }}
						</div>
						<div class="matching-info small-text">Matched by MATCHERSNAME</div>
						<div class="reservation-info small-text">Reserved for ## more minutes</div>
						<input class="loan-price" type="select">{{ loan.price }}
					</span>
				</div>
			</li>
			<li v-for="donation in donations" :key="donation.id">
				<label for="donation">Help Kiva reach more borrowers around the world:</label>
				<input type="input" name="donation" id="donation" value="">{{ donation.price }}
			</li>
		</ul>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import initializeCheckout from '@/graphql/query/initializeCheckout.graphql';


export default {
	inject: ['apollo'],
	metaInfo: {
		title: 'Checkout',
	},
	data() {
		return {
			myBalance: undefined,
			myId: undefined,
			currentStep: 'basket',
			loans: () => {},
			totals: () => {},
			donations: () => {}
		};
	},
	apollo: {
		query: initializeCheckout,
		prefetch: true,
		result({ data }) {
			console.log(data);
			this.myBalance = _get(data, 'my.userAccount.balance');
			this.myId = _get(data, 'my.userAccount.id');
			this.totals = _get(data, 'shop.basket.totals');
			this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
			this.donations = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'Donation' });
		}
	},
	methods: {

	},
	computed: {
		isLoggedIn() {
			return this.myId !== undefined;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.basket-items-list ul {
	list-style-type: none;
}

.loan-img,
.loan-info {
	display: inline-block;
}

.reservation-info {
	color: $kiva-text-light;
}

</style>
