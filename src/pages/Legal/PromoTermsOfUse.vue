<template>
	<www-page>
		<div class="row page-content">
			<tertiary-menu class="show-for-large large-2 tertiary-menu-terms">
				<ul>
					<li>
						<router-link to="/legal/terms-of-use-february-2020">
							Terms of Use
						</router-link>
					</li>
					<li>
						<router-link to="/legal/promo-terms-of-use-february-2020">
							Promotional Lending Terms and Conditions
						</router-link>
					</li>
				</ul>
			</tertiary-menu>
			<!-- eslint-disable max-len -->
			<div class="small-12 large-10 columns">
				<h1>
					Promotional Lending Terms and Conditions
				</h1>

				<div class="row">
					<div class="small-12 xlarge-10 columns">
						<p>
							From time to time, Kiva may offer promotions that enable you to make a loan on the Kiva website using credit supplied by Kiva, a Kiva affiliate, or a third-party sponsor (“Promotional Credit”) in lieu of your own personal funds. By participating in a promotion that offers Promotional Credit or otherwise claiming or using Promotional Credit, you agree to be bound by the following terms and conditions:
						</p>
					</div>
				</div>

				<section>
					<h2>
						Claiming Promotional Credit.
					</h2>

					<div class="row">
						<div class="small-12 xlarge-10 columns">
							<p>
								Promotional Credit may be described in various promotions using different names, depending on the respective promotion (for example, but not limited to, “free credit,” “bonus,” “free trial,” “promotional code”). Each respective promotion will describe the specific eligibility requirements and criteria to claim and/or use Promotional Credit. All determinations with respect to eligibility to participate in a promotion (including, but not limited to, the satisfaction of criteria to claim or use Promotional Credits) shall be made by Kiva in its sole discretion, and all Kiva determinations and decisions shall be final. Supplies of Promotional Credit are strictly limited and are available to be claimed only while supplies last on a “first claimed” basis. Receiving an offer to participate in a promotion does not guarantee that any Promotional Credit will be available for you to claim by the time you have satisfied the relevant criteria. If Promotional Credit is available to be claimed, it will be deposited into your Kiva account after you have successfully fulfilled the specified criteria or requirements.
							</p>
						</div>
					</div>
				</section>

				<section>
					<h2>
						Using Promotional Credit.
					</h2>

					<div class="row">
						<div class="small-12 xlarge-10 columns">
							<p>
								Promotional Credit that is successfully claimed by a registered user may be used for the sole purpose of making a loan on Kiva’s website during a strictly limited period of time, as described in the particular program. Promotional Credit has no cash value and may not be substituted or exchanged for cash or other products or services. Claiming Promotional Credit does not guarantee that such Promotional Credit will still be available for your use by the time you attempt to use such Promotional Credit toward a loan. Replacement Promotional Credit will not be offered (and no other compensation will be provided) if Promotional Credit expires, or if a loan made with Promotional Credit is refunded, becomes delinquent or defaults.
							</p>
							<p>
								Kiva, in its sole discretion, may place limits or restrictions on the categories and types of loans that may be made using Promotional Credit (e.g., risk rating of Field Partner, location of borrower, length of loan term). To the extent that you have Promotional Credit in your account when you make a loan (excluding any loans made by auto-lending), your available Promotional Credit will be used first in order of lending allocation priority, followed by your own funds.
							</p>
							<p>
								If you make a loan utilizing Promotional Credit, you understand that any repayments on the portion of such loan funded using Promotional Credit will not be returned to you, but will instead automatically be returned either to Kiva (or a Kiva affiliate) for future use to help further Kiva’s charitable mission or to the then-applicable third-party Kiva supporter sponsoring the respective promotion. Any automatic return of repayments to Kiva (or a Kiva affiliate) from any Loan you make with Promotional Credit does not qualify as a charitable donation to Kiva.
							</p>
						</div>
					</div>
				</section>

				<section>
					<h2>
						Donor Advised Fund.
					</h2>

					<div class="row">
						<div class="small-12 xlarge-10 columns">
							<p>
								Certain promotions may be sponsored by donors who have contributed funds through a donor advised fund operated by Kiva (“DAF Funds”). In particular, Promotional Credits offered in connection with company-sponsored Kiva lending promotions may be funded with DAF Funds. If you participate in such a promotion, you agree not to use Promotional Credits funded by DAF Funds in any manner that benefits you or the sponsor of the promotion (for example, toward a loan for the purpose of purchasing a product sold by the sponsoring company). Certain borrowers on Kiva’s website may not be eligible to receive DAF Funds.
							</p>
						</div>
					</div>
				</section>
				<section>
					<h2>
						Legal Disclaimers.
					</h2>

					<div class="row">
						<div class="small-12 xlarge-10 columns">
							<p>
								Promotions offering Promotional Credit are not valid where prohibited by law, and are subject to all applicable laws and regulations. Any costs incurred by you in claiming Promotional Credits, as well as any applicable federal, state and local taxes with respect to Promotional Credits, are your sole responsibility. Kiva accepts no responsibility or liability in connection with any loss or damages incurred by you in connection with receipt or use of Promotional Credits. By participating in a promotion or by otherwise using Promotional Credits, you agree to release and hold harmless Kiva from any and all liability, for loss, harm, damage, injury, cost or expense whatsoever.
							</p>
							<p>
								Any user determined to be defrauding or attempting to fraudulently participate in a program (such as by using multiple email addresses to claim more Promotional Credit than a user would otherwise be eligible to claim) or otherwise in breach of these terms and conditions, is subject to being disqualified from receiving Promotional Credit and/or forfeiting all received Promotional Credit without notice, in addition to all other remedies available to Kiva under the Kiva Terms of Use and applicable laws. ANY ATTEMPT TO DELIBERATELY DEFRAUD KIVA OR OTHERWISE UNDERMINE THE LEGITIMATE OPERATION AND PROCESS OF A KIVA PROMOTION IS A VIOLATION OF KIVA’S TERMS OF USE AND ANY APPLICABLE LAWS.
							</p>
						</div>
					</div>
				</section>
			</div>
			<!-- eslint-enable max-len -->
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import TertiaryMenu from '@/components/WwwFrame/TertiaryMenu';

export default {
	components: {
		WwwPage,
		TertiaryMenu
	},
	metaInfo: {
		title: 'Promotional Lending Terms and Conditions'
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

h1 { margin-top: 0.5rem; }

.tertiary-menu-terms {
	margin: 1.625rem 0;
}

h1,
h3 { font-weight: bold; }
</style>
