<template>
	<www-page>
		<div name="secondary" class="secondary-nav">
			<ul class="row">
				<li><router-link to="/portfolio">Portfolio</router-link></li>
				<li><router-link to="/teams/my-teams">My teams</router-link></li>
				<li><router-link to="/account/messages">Messages</router-link></li>
				<li><router-link to="/settings">Settings</router-link></li>
			</ul>
		</div>
		<div class="row page-content">
			<div name="tertiary" class="tertiary-nav show-for-large large-3 columns">
				<ul>
					<li><router-link to="/portfolio">Portfolio</router-link></li>
					<li><router-link to="/portfolio/lending-stats-vue">Lending stats</router-link></li>
					<li><router-link to="/portfolio/loans">My loans</router-link></li>
					<li><router-link to="/portfolio/estimated-repayments">Estimated repayments</router-link></li>
					<li><router-link to="/portfolio/credit/deposit">Add credit</router-link></li>
					<li><router-link to="/withdraw">Withdraw</router-link></li>
					<li><router-link to="/donate/supportusprocess?donationAmount=10">Donate credit</router-link></li>
					<li><router-link to="/lender/somename999999">Public lender profile</router-link></li>
					<li><router-link to="/portfolio/transactions">Transaction history</router-link></li>
					<li><router-link to="/portfolio/donations">My donations</router-link></li>
					<li><router-link to="/portfolio/kiva-cards">Purchased Kiva Cards</router-link></li>
					<li><router-link to="/portfolio/invites">Invite friends</router-link></li>
					<li><router-link to="/portfolio/credit/bonus-history">Free credit history</router-link></li>
				</ul>
			</div>
			<div class="small-12 large-9 columns">
				<h1>Lending stats</h1>
				<p>This is a snapshot of your lending activity on Kiva.
				Use this page to collect loans and hit milestones along the way.</p>
				<hr>
				<div class="loan-stats lending-stats-section">
					<h2 class="section-header">
						<span class="section-title country-title">Countries*</span>
						<span class="lent-count">0/78</span>
					</h2>
					<div class="lend-link-btn">
						<router-link :to="{ path: 'lend', query: { country: countrySAMPLEQuery } }">
							Lend to a new country
						</router-link>
					</div>
				</div>
				<hr>
				<p>* Please note, Kiva is continually adding and ending partnerships as we deem necessary.
				This means, you may end up supporting a loan in a country or through a Field Partner that
				is no longer active and therefore not included in the total number of countries or partners
				noted on this page. For this reason, it is possible to see discrepancies between the number
				you've supported and the number to go.</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	data() {
		return {
			countrySAMPLEQuery: `AF,AL,AM,BD,BZ,BJ,BT,BO,BR,BF,KH,CM,CA,CO,CD,
				CR,CI,DO,EC,EG,SV,FJ,GE,GH,GU,GT,HT,HN,IN,ID,IL,JO,KE,XK,
				KG,LA,LB,LS,LR,MG,MW,ML,MR,MX,MD,MZ,MM,NA,NP,NI,NG,PK,PS,PA,
				PY,PE,PH,PR,RW,WS,SN,SL,SB,ZA,SS,TJ,TZ,TH,TL,TG,TO,
				TR,UG,UA,US,UY,VN,VI,YE,ZM,ZW`
		};
	},
	components: { WwwPage },
	metaInfo: {
		title: 'Lending Stats'
	}
};
</script>

<style lang="scss">
@import 'settings';

.secondary-nav {
	background-color: $kiva-darkgreen;

	ul {
		display: block;
		list-style: none;
		margin: 0 auto;
		line-height: $lead-lineheight;

		li {
			display: inline-block;

			a {
				display: block;
				color: $white;
				font-weight: normal;
				padding: 0.075rem 0;
				margin: 0.675rem 1rem;
				border-bottom: 2px solid $kiva-darkgreen;
				text-decoration: none;

				&:hover,
				&.router-link-active {
					color: $kiva-accent-green;
					border-bottom: 2px solid $kiva-accent-green;
				}

				&.router-link-active {
					font-weight: bold;
				}
			}
		}
	}
}

.page-content {
	padding: 1.625rem 0;
}

.tertiary-nav {
	ul {
		list-style-type: none;
		margin: 0;

		li {
			margin-bottom: 0.875rem;
			line-height: $small-text-line-height;

			/* stylelint-disable-next-line no-descending-specificity */
			a {
				font-weight: normal;
				color: $kiva-accent-blue;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}

				&:visited {
					color: $kiva-accent-blue;
				}

				&.router-link-exact-active {
					color: $kiva-stroke-gray;
				}
			}
		}
	}
}
</style>
