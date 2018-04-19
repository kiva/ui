<template>
	<www-page>
		<the-my-kiva-secondary-menu />
		<div class="row page-content">
			<the-portfolio-tertiary-menu />
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
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';

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
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu
	},
	metaInfo: {
		title: 'Lending Stats'
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
