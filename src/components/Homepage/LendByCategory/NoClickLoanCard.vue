<template>
	<div class="no-click-loan"
		v-kv-track-event="[
			'Home',
			'click-hero-loan-card',
			loanId,
			loanId
		]"
	>
		<h3 class="no-click-loan__headline">
			{{ categoryName }}
		</h3>
		<div class="no-click-loan__card">
			<div class="no-click-loan__image-wrapper">
				<img class="no-click-loan__image"
					v-if="imageUrl"
					:srcset="imageRetinaUrl + ' 2x'"
					:src="imageUrl"
					:alt="'photo of ' + borrowerName"
					loading="lazy"
				>
			</div>
			<div class="no-click-loan__summary">
				<div class="no-click-loan__name-row">
					{{ borrowerName }}
					<kv-flag class="no-click-loan__country-flag"
						v-if="countryISO"
						:country="countryISO"
						aspect-ratio="1x1"
					/>
				</div>
				<fundraising-status
					class="no-click-loan__progress"
					:percent-raised="percentRaised"
					:expiring-soon-message="timeLeftString"
					:amount-left="amountLeft"
					:is-funded="isFunded"
					:left-and-to-go-on-top="true"
					:short-meter="true"
				/>
				<p class="no-click-loan__use">
					{{ loanUse }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import gql from 'graphql-tag';

import logReadQueryError from '@/util/logReadQueryError';
import { readJSONSetting } from '@/util/settingsUtils';

import loanUseMixin from '@/plugins/loan/loan-use-mixin';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';

import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import KvFlag from '@/components/Kv/KvFlag';

const channelQuery = gql`query featuredCategory {
	general {
		homepage_category_rows: uiConfigSetting(key: "homepage_category_rows") {
			key
			value
		}
	}
}`;

const loanQuery = gql`query noClickLoanCard($channelId: Int!) {
	lend {
		loanChannelsById(ids: [$channelId]) {
			id
			name
			loans(limit: 1) {
				values {
					id
					geocode {
						country {
							isoCode
						}
					}
					image {
						id
						default: url(customSize: "w480h300")
						retina: url(customSize: "w960h600")
					}
					name

					# for loan-use-mixin
					use
					status
					loanAmount
					borrowerCount

					# for percent-raised-mixin
					loanFundraisingInfo {
						fundedAmount
						reservedAmount
					}

					# for time-left-mixin
					plannedExpirationDate
				}
			}
		}
	}
}`;

export default {
	inject: ['apollo', 'cookieStore'],
	mixins: [
		loanUseMixin,
		percentRaisedMixin,
		timeLeftMixin,
	],
	components: {
		FundraisingStatus,
		KvFlag,
	},
	data() {
		return {
			category: null,
			loan: null,
			loanUseMaxLength: 200,
		};
	},
	computed: {
		borrowerName() {
			return this.loan?.name || '';
		},
		categoryName() {
			if (!this.category) {
				return '';
			}
			switch (this.category.id) {
				case 52:
					return 'Loans to women';
				case 96:
					return 'COVID-19 loans';
				case 93:
					return 'Shelter loans';
				case 89:
					return 'Arts loans';
				case 87:
					return 'Agriculture loans';
				default:
					// remove any text contained within square brackets, including the brackets
					return String(this.category.name).replace(/\s\[.*\]/g, '');
			}
		},
		countryISO() {
			return this.loan?.geocode?.country?.isoCode || '';
		},
		imageRetinaUrl() {
			return this.loan?.image?.retina || '';
		},
		imageUrl() {
			return this.loan?.image?.default || '';
		},
		isFunded() {
			return this.loan?.status === 'funded';
		},
		loanId() {
			return this.loan?.id || 0;
		},
		timeLeftString() {
			return this.isFunded ? '' : this.timeLeftMessage;
		},
	},
	apollo: {
		preFetch(config, client) {
			return client.query({ query: channelQuery })
				.then(({ data }) => {
					// Get the array of channel objects from settings,
					const categorySettingsArray = readJSONSetting(data, 'general.homepage_category_rows.value');
					if (categorySettingsArray) {
						const channelId = categorySettingsArray[0].id;
						return client.query({
							query: loanQuery,
							variables: { channelId },
						});
					}
				});
		},
	},
	created() {
		// Read the page data from the cache
		let channelId;
		try {
			const channelSettingData = this.apollo.readQuery({ query: channelQuery });
			const categorySettingsArray = readJSONSetting(channelSettingData, 'general.homepage_category_rows.value');
			if (categorySettingsArray) {
				// if successful get id of first channel
				channelId = categorySettingsArray[0].id;
			}
		} catch (e) {
			logReadQueryError(e, 'NoClickLoanCard channelQuery');
		}

		if (channelId) {
			// Read channel data from cache
			let channelData = {};
			try {
				channelData = this.apollo.readQuery({
					query: loanQuery,
					variables: { channelId },
				}) || {};
			} catch (e) {
				logReadQueryError(e, 'NoClickLoanCard loanQuery');
			}

			// Set category info
			this.category = {
				id: channelData.lend?.loanChannelsById?.[0]?.id || 0,
				name: channelData.lend?.loanChannelsById?.[0]?.name || '',
			};

			// Set loan from first loan in channel loans
			this.loan = channelData.lend?.loanChannelsById?.[0]?.loans?.values?.[0] || null;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.no-click-loan {
	width: 100%;
	max-width: rem-calc(320);
	margin: 0 auto;

	&__headline {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	&__card {
		width: 100%;
		border-radius: 2rem;
		overflow: hidden;
		box-shadow: 0 4px 3px 0 rgba(0, 0, 0, 0.15);
	}

	&__image-wrapper {
		position: relative;
		width: 100%;
		padding-bottom: 300 / 480 * 100%;
		background-color: $kiva-bg-darkgray;
	}

	&__image {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}

	&__summary {
		padding: 0.75rem 1.5rem 0.5rem;
	}

	&__name-row {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		font-size: rem-calc(22);
		font-weight: $global-weight-highlight;
		line-height: 1.35;
		padding-bottom: 0.5rem;
	}

	&__country-flag {
		flex-shrink: 0;
		overflow: hidden;
		border: none;
		border-radius: 50%;
		width: 1rem;
		height: 1rem;
		margin-left: 0.5rem;
	}

	&__progress {
		::v-deep .left-and-to-go-line {
			font-size: $normal-text-font-size;

			span:last-of-type {
				float: right;
			}
		}

		::v-deep .fundraising-status-meter {
			margin: 1rem 0;
		}

		::v-deep .meter {
			background-color: $kiva-text-medium;
		}
	}

	&__use {
		line-height: 1.42;
	}
}
</style>
