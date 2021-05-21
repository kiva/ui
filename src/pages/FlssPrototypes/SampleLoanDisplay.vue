<template>
	<www-page :header-theme="headerTheme" :footer-theme="footerTheme">
		<div class="simple-campaign-landing">
			<section
				class="loan-categories section"
				id="simpleLoanSection"
				ref="simpleLoanSection"
			>
				<div class="row">
					<div class="columns">
						<h2 class="loan-categories__header text-center">
							{{ pageTitle }}
						</h2>
						<h2 class="loan-categories__header text-center">
							Fundraising Loan Search Service Loans
						</h2>
						<hr>
						<section
							class="dropDownMenuWrapper"
							:class="{
								'dropDownMenuWrapper--noTitle': !menuTitle,
							}"
						>
							<button class="dropDownMenuButton" ref="menu" @click="openClose">
								{{ menuTitle }}
							</button>

							<div
								class="iconWrapper"
								:class="{ 'iconWrapper--noTitle': !menuTitle }"
							>
								<FilterIcon />
							</div>
							<section class="dropdownMenu" v-if="isOpen">
								<div class="menuArrow"></div>
								<slot></slot>

								<section class="option">
									<button @click="chooseFavCountry">
										Favorite Countries
									</button>
									<span class="desc">Western Samoa and US</span>
								</section>

								<section class="option">
									<button @click="chooseFavSector">
										Favorite Sectors
									</button>
									<span class="desc">Education and Arts</span>
								</section>

								<section class="option">
									<button @click="chooseKenya">
										Kenya exclude agriculture and retail
									</button>
									<span class="desc">All loans in Kenya with exclusions</span>
								</section>

								<section class="option">
									<button @click="chooseAll">
										All Fundraising
									</button>
									<span class="desc">All loans currently fundraising</span>
								</section>
							</section>
						</section>

						<div class="loan-container">
							<flss-loans
								id="flssLoanRowDisplay"
								:filters="filters"
								:is-visitor="true"
								:items-in-basket="null"
								:is-logged-in="null"
								:is-visible="showLoanRows"
								:key="'one-category'"
								:row-number="1"
								:show-loans="true"
								sort-by="popularity"
								@sending-count="receiveCount"
							/>
						</div>
					</div>
				</div>
				<div class="row">
					<h2>
						Number of available loans:
						{{ numLoans }}
					</h2>
				</div>
				<div class="row">
					<h2>
						The filters being passed through to graphql:<br>
						{{ filterReveal }}
					</h2>
				</div>
			</section>
		</div>
	</www-page>
</template>
<script>
import gql from 'graphql-tag';
import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import FlssLoans from '@/pages/FlssPrototypes/FlssLoanRow';
import FilterIcon from '@/assets/icons/inline/filters.svg';

export const favoriteCountries = {
	countryIsoCode: { any: ['WS', 'US'] },
};
export const favoriteSectors = { sector: { any: ['education', 'arts'] } };

export const favoriteKenya = {
	countryIsoCode: { eq: 'KE' }, sector: { none: ['agriculture', 'retail'] }
};

const pageQuery = gql`
	query pageContent($basketId: String!) {
		shop(basketId: $basketId) {
			id
			basket {
				id
				items {
					totalCount
					values {
						id
						basketItemType
					}
				}
			}
		}
		my {
			userAccount {
				id
			}
		}
	}
`;

export default {
	inject: ['apollo', 'cookieStore', 'kvAuth0'],
	components: {
		WwwPage,
		FlssLoans,
		FilterIcon
	},
	mixins: [],
	props: {
		dynamicRoute: {
			type: String,
			default: '',
		},
		formComplete: {
			type: String,
			default: '',
		},
		menuTitle: {
			type: String,
			default: 'FLSS Filters',
		},
	},
	data() {
		return {
			active: false,
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			rawPageData: null,
			pageData: null,
			showLoans: false,
			showLoanRows: true,
			filters: {},
			isOpen: false,
			numLoans: 0
		};
	},
	metaInfo() {
		return {
			title: `${this.pageTitle}`,
		};
	},
	apollo: {
		preFetch: true,
		query: pageQuery,
	},
	created() {},
	mounted() {},
	watch: {},
	computed: {
		filterReveal() {
			const filterReveal = JSON.stringify(this.filters, null, '   ');
			return filterReveal;
		},
		pageSettingData() {
			const settings = this.pageData?.page?.settings ?? [];
			const jsonDataArray = settings.map(setting => setting.dataObject || {});
			/* eslint-disable-next-line no-unused-vars, no-empty-pattern */
			const allJsonData = jsonDataArray.reduce(
				(accumulator, settingDataObject) => {
					return { ...accumulator, ...settingDataObject };
				},
				{}
			);
			return allJsonData;
		},
		pageTitle() {
			const layoutTitle = this.pageData?.page?.pageLayout?.pageTitle;
			const pageTitle = this.pageData?.page?.pageTitle ?? 'Loans that change lives';
			return layoutTitle || pageTitle;
		},
		initialSortBy() {
			return (
				this.promoData?.managedAccount?.loanSearchCriteria?.sortBy
				?? 'popularity'
			);
		},
	},
	methods: {
		showLoanDetails(loan) {
			this.detailedLoan = loan;
			this.loanDetailsVisible = true;
		},
		openClose() {
			const menuButton = this;
			const closeListerner = e => {
				if (menuButton.catchOutsideClick(e, menuButton.$refs.menu)) {
					window.removeEventListener(
						'click',
						closeListerner
					)((menuButton.isOpen = false));
				}
			};
			window.addEventListener('click', closeListerner);
			this.isOpen = !this.isOpen;
		},
		chooseFavCountry() {
			this.filters = favoriteCountries;
		},
		chooseFavSector() {
			this.filters = favoriteSectors;
		},
		chooseKenya() {
			this.filters = favoriteKenya;
		},
		chooseAll() {
			this.filters = {};
		},
		catchOutsideClick(event, dropdown) {
			// When user clicks menu — do nothing
			if (dropdown === event.target) return false;

			// When user clicks outside of the menu — close the menu
			if (this.isOpen && dropdown !== event.target) return true;
		},
		receiveCount(totalCount) {
			this.numLoans = totalCount;
		},
	},
	destroyed() {
		clearInterval(this.currentTimeInterval);
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.simple-campaign-landing {
	&__status {
		$header-height: rem-calc(45); // same as TheHeader.vue
		$header-height-large: rem-calc(64); // same as TheHeader.vue

		position: sticky;
		top: $header-height;
		z-index: 2;

		@include breakpoint(large) {
			top: $header-height-large;
		}
	}

	&__loading-page {
		z-index: 1;
	}
}

.loan-categories {
	margin-top: 2rem;

	& .row {
		max-width: 69.15rem;
	}

	&__header {
		font-weight: bold;
		margin-bottom: 2rem;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}

.loan-details-lightbox {
	::v-deep .kv-lightbox__header {
		button.kv-lightbox__close-btn {
			background: $white;
			border-radius: 1.25rem;
		}
	}
}

.loan-details {
	// Style overrides for the loan details lightbox content
	// Note, styles inside DetailedLoanCard.vue are not scoped
	border: 0;

	&.detailed-loan-card.row {
		max-width: 100%;
		border: 0;

		@include breakpoint(xlarge) {
			width: 58.75rem;
		}

		::v-deep {
			.full-details-link,
			.close-button-wrapper,
			.info-panel a,
			.borrower-info-body.loan-use a {
				display: none;
			}

			.name-location-sector .name {
				text-decoration: none;
				color: $body-font-color;
				cursor: text;
			}
		}
	}

	.overview-column {
		margin-bottom: 1.5rem;
	}
}

.loan-view-controls {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	flex-direction: column;

	@include breakpoint(medium) {
		flex-direction: row;
		margin: 0 1rem;
	}
	@include breakpoint(large) {
		margin: 0 3rem;
	}

	&__filters {
		margin-bottom: 1rem;

		@include breakpoint(medium) {
			margin-bottom: 0;
		}
	}
}

.dropDownMenuWrapper {
	position: relative;
	width: 500px;
	height: 80px;
	border-radius: 8px;
	background: white;
	border: 1px solid #eee;
	box-shadow: 10px 10px 0 0 rgba(black, 0.03);
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);

	* {
		box-sizing: border-box;
		text-align: left;
	}

	.dropDownMenuButton {
		border: none;
		font-size: inherit;
		background: none;
		outline: none;
		border-radius: 4px;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		padding: 0 70px 0 20px;
		margin: 0;
		line-height: 1;
		width: 100%;
		height: 100%;
		z-index: 4;
		cursor: pointer;
	}

	.iconWrapper {
		width: 25px;
		height: 25px;
		position: absolute;
		right: 30px;
		top: 50%;
		transform: translate(0, -50%);
		z-index: 1;
	}

	.iconWrapper--noTitle {
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		width: auto;
		height: auto;
		transform: none;
	}

	.dropdownMenu {
		position: absolute;
		top: 100%;
		width: 100%;
		min-width: 300px;
		min-height: 10px;
		border-radius: 8px;
		border: 1px solid #eee;
		box-shadow: 10px 10px 0 0 rgba(black, 0.03);
		background: white;
		padding: 10px 30px;
		animation: menu 0.3s ease forwards;
		z-index: 4;

		.menuArrow {
			width: 20px;
			height: 20px;
			position: absolute;
			top: -10px;
			left: 20px;
			border-left: 1px solid #eee;
			border-top: 1px solid #eee;
			background: white;
			transform: rotate(45deg);
			border-radius: 4px 0 0 0;
		}

		.option {
			width: 100%;
			border-bottom: 1px solid #eee;
			padding: 20px 0;
			cursor: pointer;
			position: relative;
			z-index: 2;

			&:last-child {
				border-bottom: 0;
			}

			* {
				color: inherit;
				text-decoration: none;
				background: none;
				border: 0;
				padding: 0;
				outline: none;
				cursor: pointer;
			}
		}

		.desc {
			opacity: 0.5;
			display: block;
			width: 100%;
			font-size: 14px;
			margin: 3px 0 0 0;
			cursor: default;
		}
	}

	@keyframes menu {
		from {
			transform: translate3d(0, 30px, 0);
		}

		to {
			transform: translate3d(0, 20px, 0);
		}
	}
}

.dropDownMenuWrapper--noTitle {
	padding: 0;
	width: 60px;
	height: 60px;
}
</style>
