<template>
	<div class="frequently-asked-questions-section-wrapper row align-center" id="frequently-asked-questions">
		<div class="small-12 columns tw-text-center">
			<h2>
				Frequently asked questions
			</h2>
		</div>
		<div class="small-12 large-10 columns">
			<div class="row collapse">
				<kv-expandable-question
					v-for="(question, index) in faqs"
					:key="index"
					:title="question.title"
					:content="question.content"
					class="small-12 columns"
					:id="question.title | changeCase('paramCase')"
					:analytics-category="`Lending`"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import KvExpandableQuestion from '@/components/Kv/KvExpandableQuestion';

export default {
	components: {
		KvExpandableQuestion
	},
	data() {
		/* eslint-disable max-len */
		return {
			faqs: [
				{
					title: 'Do I need to fund the entire loan?',
					content: '<p>No, Kiva crowdfunds loans so there are many individual lenders who come together to contribute to each successful loan. You can lend $25 or more to a borrower to help them reach their goal, and you can see the other lenders who supported that borrower at the bottom of the loan profile.</p>',
				},
				{
					title: 'Will I get repaid?',
					content: '<p>Kiva loans have a historical repayment rate of about 97% (this number fluctuates slightly so check Kiva\'s homepage for the current rate). Kiva does not guarantee repayment for any loans crowdfunded on the Kiva website.</p><p>Past repayment performance does not guarantee future results, and Kiva lenders should be aware of the different layers of risk (such as borrower risk, country risk and currency risk) that could lead to losing some or all of the lender’s principal. <a href="http://www.kiva.org/about/risk" target="_blank">Learn more about the risks of lending</a>.</p>',
				},
				{
					title: 'Who can get a Kiva loan?',
					content: '<p>Kiva crowdfunds loans for borrowers in more than 80 countries who are often financially excluded and can’t access other fair and affordable sources of credit. In the U.S., Kiva crowdfunds loans for borrowers who are either financially excluded or creating social impact in their communities.</p><p>Kiva borrowers work in many industries. They may be farmers, artisans, students, shopkeepers, builders or restaurant owners. Many Kiva borrowers work multiple jobs to generate enough income to support their families.</p><p>Kiva Field Partners and Trustees help identify and vet borrowers whose loans will be crowdfunded on Kiva. If you’re in the the U.S. and you’re interested in applying for a loan <a href="http://www.kiva.org/borrow" target="_blank">learn more at our borrower portal</a>.</p>',
				},
				{
					title: 'How do borrowers get on the Kiva website?',
					content: '<p>Depending on the type of loan, a local Field Partner or the borrower uploads the details for each loan into the system. Kiva’s worldwide network of volunteers then helps to edit and translate loans before they go live on the website for lenders to crowdfund.</p><p>Learn more about our <a href="http://www.kiva.org/about/due-diligence" target="_blank">due diligence process for Field Partners and borrowers</a>.</p>',
				},
				{
					title: 'Do Kiva and/or Kiva lenders receive interest on Kiva loans?',
					content: '<p>Individual Kiva lenders do not receive interest from loans they support on Kiva. Kiva does not collect interest from borrowers, but does charge select field partners small service fees in connection with the funds they raise on Kiva\'s website. Kiva carefully assesses and monitors each partnership to ensure that lender funding enables partners to serve more borrowers at lower costs everywhere we work.</p>',
				},
				{
					title: 'Do Kiva borrowers pay any interest on their loans?',
					content: '<p>Yes, most borrowers on Kiva do pay interest to Kiva’s local Field Partners in some form.</p><p> Field Partners collect interest from borrowers because there are many expenses associated with providing small loans in developing markets, especially in rural areas. Many of Kiva’s Field Partners also provide additional services with loans, including training, financial literacy classes or health services.</p><p>Kiva will not partner with an organization that charges unreasonable interest rates, and we require Field Partners to fully disclose their rates. Kiva only partners with organizations and microfinance institutions that have a social mission to serve the poor, unbanked and underserved.</p><p>Some borrowers funded through Kiva do receive 0% interest loans, including most direct loans, which are loans that are not made through a Field Partner. Learn more about the difference between Field Partner and direct loans.</p>',
				},
				{
					title: 'How does Kiva cover costs?',
					content: '<p>We cover most of our operating costs through voluntary donations made by Kiva lenders. The remainder of our costs are covered through grants and donations from foundations and supporters. Additionally, select Field Partners contribute small platform fees as we continue building innovative technologies that help create a more financially inclusive world.</p><p>Kiva never takes a fee from lenders. 100% of funds lent on Kiva go to funding loans.</p>',
				},
				{
					title: 'What are Field Partners?',
					content: '<p>Kiva is able to reach more borrowers and some of the most remote places in the world through our global network of Field Partners. These partners are local organizations working in communities to vet borrowers, provide services and administer loans.</p><p>Our Field Partners are nonprofit organizations, microfinance institutions, schools, social enterprises and more. Many provide services with their loans, such as entrepreneurial training and literacy skills.</p><p>Field Partners all share one thing in common: the desire to improve people’s lives through safe, fair access to credit. <a href="http://www.kiva.org/about/where-kiva-works" target="_blank">Check out more about our Field Partners</a>.</p>',
				},
				{
					title: 'What’s the difference between a direct loan and a partner loan?',
					content: '<p>Partner loans are administered by Kiva’s Field Partners and are available to borrowers in more than 80 countries. Direct loans do not involve Field Partners, and instead send loan funds straight to a borrower\'s digital account. Direct loans on Kiva are currently only available to businesses in the US and social enterprises internationally.</p><p>Most partner loans do involve borrowers paying the Field Partner some interest, because of the high cost of providing small loans in rural areas and developing markets. Most direct loans on Kiva are 0% interest, but select social enterprises may contribute small platform service fees to Kiva. Direct loans can reach borrowers that even microfinance institutions can’t or don’t serve, but they can be riskier because there is no Field Partner involved in following up on the loan and collecting repayments.</p>',
				},
				{
					title: 'How does the money for the loan get to each borrower?',
					content: '<p>Loan funds reach borrowers through Kiva’s Field Partners, or through the money transfer platform PayPal.</p><p>For most loans on Kiva, our local Field Partners are responsible for distributing the funds to borrowers. Depending on the Field Partner, the funds may be given to each borrower before, during or after the individual loan is posted on Kiva. Most partners give the funds out before the loan is posted (what we call pre-disbursal) because it allows borrowers to use the funds immediately. So when a lender supports a partner loan on Kiva, the borrower may already have those funds in hand. However, support for that loan is still needed and as the borrower makes repayments, they\'re passed along to the specific Kiva lenders who supported the loan.</p><p>For direct loans, once the loan is fully crowdfunded on Kiva, funds are transmitted to the borrower via PayPal.</p>',
				},
				{
					title: 'What is the due diligence process on Kiva loans?',
					content: '<p>Borrowers on Kiva are vetted or endorsed by either a local Field Partner, Trustee or members of the community.</p><p>For partner loans, Kiva conducts due diligence on the local Field Partners that will be administering the loans.</p><p>All Field Partners must provide leadership information, financial documentation and detailed plans for using Kiva’s capital for loans with high social impact. Partners who post more loans submit additional documentation and a Kiva analyst conducts an on-site visit to conduct interviews with leadership, management and borrowers.</p><p>For direct loans, Kiva staff take several steps to verify the borrower’s identity and borrowers are endorsed by a Trustee organization or members of their community in a process we call social underwriting. A borrower must either have the endorsement of a Kiva Trustee, an organization or individual that works to connect borrowers with Kiva, or successfully invite members of their own social networks to support their loan before the loan is able to fundraise publicly on Kiva. Because their own connections, friends and family are putting their own dollars in, we believe social underwriting increases borrowers’ commitment to repaying their loans.</p><p><a href="http://www.kiva.org/about/due-diligence" target="_blank">More information is available on our due diligence page</a>.</p>',
				},
				{
					title: 'What happens if a loan doesn’t fully fund on Kiva?',
					content: '<p>Usually, loans on Kiva have 30 days to successfully fundraise. But in most cases, if a loan doesn’t fully fund on Kiva the individual borrower is not directly affected. That’s because most of Kiva’s Field Partners give borrowers access to credit before posting their loans on the Kiva website (what we call pre-disbursal), so the borrower can use the funds immediately.</p><p>The crowdfunded money raised on Kiva is used to backfill the loan amount, and when the borrower makes repayments they\'re passed along to the specific Kiva lenders who supported the loan. There are 2 funding models on Kiva:</p><p>Fixed: the total loan amount must be raised in order for funds to be sent to the Field Partner. If the loan is not funded in full within the fundraising period, the loan will expire and any funds raised will be returned to lenders\' Kiva accounts.</p><p> Flexible: any funds raised within 30 days will be passed along to the Field Partner facilitating the loan and they will come up with other sources of funding to cover the rest of the loan amount.</p><p>There are a few situations where borrowers are directly affected and won’t receive their loan if it doesn’t fund on Kiva. This happens with direct loans and partner loans that are not pre-disbursed, which have a fixed funding model.</p><p> We know it can be hard to see some loans miss their funding goals, which is why we\'ve expanded the funding options and are working hard to reach new lenders who can help create more positive impact.</p>',
				},
				{
					title: 'How do repayments get back to lenders?',
					content: '<p>Loan funds are repaid from borrowers to lenders through Kiva’s Field Partners, or by utilizing the money transfer platform PayPal.</p><p>For partner loans, Kiva’s local Field Partners collect repayments from the borrowers, based on each loan repayment schedule and the borrower’s ability to repay. The partner then repays Kiva and repayments are deposited into your individual Kiva lender account. Lenders should be aware that this introduces a layer of risk: repayment of Field Partner loans relies on the borrower repaying the Field Partner, and the Field Partner repaying Kiva.</p><p>For direct loans, borrowers use PayPal to transmit repayments and Kiva deposits repaid funds into your individual Kiva lender account. Lenders should be aware that this model introduces a different kind of risk: there is no Field Partner working on the ground to follow up with the borrower and encourage or collect repayments.</p><p>In either case, as you’re repaid you can withdraw your money, donate it to Kiva, or relend it to another borrower. <a href="http://www.kiva.org/about/risk" target="_blank">Learn more about the risks of lending</a>.</p>',
				},
				{
					title: 'What happens if a borrower can’t repay the loan?',
					content: '<p>If a borrower is behind on paying back a loan, the Field Partner or Kiva (in the case of a direct loan) may try to reschedule repayments on the delinquent loan in order to make it possible for the borrower to eventually repay. This is common practice in microlending.</p><p>But sometimes, even with these efforts to be flexible, borrowers simply can’t repay and loans end in default. When a Kiva loan defaults, we notify all contributing lenders by email and these lenders can consider the remaining amount outstanding as a loss. Field Partners may decide not to lend to a specific individual again if they aren’t able to repay, and in the case of direct loans, borrowers can’t apply for another loan on Kiva unless they’ve repaid previous loans.</p>',
				},
			]
		};
		/* eslint-enable max-len */
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.frequently-asked-questions-section-wrapper {
	margin-bottom: 4rem;

	// Allows the questions to overlap the flourish
	position: relative;
	z-index: 1;

	h2 {
		margin-bottom: 1.85rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}

// The FAQ headers are bold on the other FAQ components
::v-deep h4 {
	font-weight: $global-weight-normal;
}
</style>
