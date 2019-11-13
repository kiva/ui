<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<div v-for="year in years" :key="year">
					<h3>{{ year }}</h3>
					<!-- eslint-disable vue/no-use-v-if-with-v-for -->
					<div v-if="paper.year === year" v-for="(paper, index) in papers" :key="index">
						<p>
							<a :href="paper.url" target="_blank">{{ paper.author }}. "{{ paper.title }}".
								<i>{{ paper.publication }}</i>
							</a>
						</p>
					</div>
					<!-- eslint-enable -->
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';

export default {
	components: {
		WwwPage,
		DeveloperSecondaryMenu,
	},
	metaInfo: {
		title: 'Research'
	},
	data() {
		return {
			years: [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
			papers: [
				{	year: 2019,
					author: 'Tsai, Jeanne et al',
					title: 'Culturally Valued Facial Expressions Enhance Loan Request Success',
					publication: 'American Psychological Association',
					/* eslint-disable max-len */ 
					url: 'https://culture-emotion-lab.sites.stanford.edu/sites/g/files/sbiybj9351/f/culturallyvaluedfacialloansuccess.pdf',
					/* eslint-enable max-len */			
					},
				{
					year: 2018,
					author: 'Jain, Lalit and Jamieson, Kevin',
					title: 'Firing Bandits: Optimizing Crowdfunding',
					/* eslint-disable max-len */
					publication: 'Proceedings of the 35th International Conference on Machine Learning, Stockholm, Sweden, PMLR 80.',
					/* eslint-enable max-len */
					url: 'http://proceedings.mlr.press/v80/jain18a/jain18a.pdf'
				},
				{
					year: 2018,
					author: 'Rietveld, Joost et al',
					/* eslint-disable max-len */
					title: 'Market Orchestrators: The Effect of Platform Certification on Complementor Performance and Behavior in the Context of Kiva (2010-2013)',
					/* eslint-enable max-len */
					publication: 'Social Science Research Network',
					url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3131553'
				},
				{
					year: 2018,
					author: 'Moss, Todd, et al',
					/* eslint-disable max-len */
					title: 'Funding the Story of hybrid Ventures: Crowdfunder Lending Preferences and Linguistic Hybridity',
					/* eslint-enable max-len */
					publication: 'Journal of Business Venturing',
					url: 'https://whitman.syr.edu/pdfa/fundingthestoryofhybridventures.pdf'
				},
				{
					year: 2018,
					author: 'O’Luing, Mervyn, et al',
					/* eslint-disable max-len */
					title: 'A Grouping Genetic Algorithm for Joint Stratification and Sample Allocation Designs',
					/* eslint-enable max-len */
					publication: 'Insight Centre for Data Analytics',
					url: 'https://arxiv.org/pdf/1709.03076.pdf'
				},
				{
					year: 2018,
					author: 'Burke, Robin et al',
					title: 'Balanced Neighborhoods for Multi-sided Fairness in Recommendation',
					publication: 'Proceedings of Machine Learning Research',
					url: 'http://proceedings.mlr.press/v81/burke18a/burke18a.pdf'
				},
				{
					year: 2017,
					author: 'Thai T. Pham and Yuanyuan Shen',
					/* eslint-disable max-len */
					title: 'A Deep Causal Inference Approach to Measuring the Effects of Forming Group Loans in Online Non-profit Microfinance Platform',
					/* eslint-enable max-len */
					publication: 'Dissertation Graduate School of Business, Stanford University',
					url: 'https://arxiv.org/pdf/1706.02795.pdf'
				},
				{
					year: 2017,
					author: 'Yang, Diyi and Kraut Robert',
					/* eslint-disable max-len */
					title: 'Persuading Teammates to Give: Systematic versus Heuristic Cues for Soliciting Loans',
					/* eslint-enable max-len */
					/* eslint-disable max-len */
					publication: 'Proceedings of the ACM on Human-Computer Interaction Proceedings of the ACM on Human-Computer Interaction. DOI: 0.1145/3134749',
					/* eslint-enable max-len */
					/* eslint-disable max-len */
					url: 'http://kraut.hciresearch.org/sites/kraut.hciresearch.org/files/articles/Yang17-PersuadingTeammatesToGive.pdf'
					/* eslint-enable max-len */
				},
				{
					year: 2016,
					author: 'Chen, Yan et al',
					title: 'Recommending Teams Promotes Prosocial Lending in Online Microfinance',
					publication: 'PNAS: Proceedings of the National Academy of Sciences',
					url: 'http://www.pnas.org/content/113/52/14944.abstract'
				},
				{
					year: 2015,
					author: 'Paruthi, Gaurav et al',
					/* eslint-disable max-len */
					title: 'The Role of Rating and Loan Characteristics in Online Microfunding Behaviors',
					/* eslint-enable max-len */
					publication: 'Data For Good Exchange',
					url: 'https://arxiv.org/pdf/1609.09571.pdf'
				},
				{
					year: 2015,
					author: 'Genevsky, Alexander and Knutson, Brian',
					title: 'Neural Affective Mechanisms Predict Market-Level Microlending',
					publication: 'Psychological Science',
					url: 'http://stanford.edu/group/spanlab/Publications/ag15ps+sup.pdf'
				},
				{
					year: 2014,
					author: 'Choo, Jaegul et al',
					/* eslint-disable max-len */
					title: 'To Gather Together for a Better World: Understanding and Leveraging Communities in Micro-lending Recommendation',
					/* eslint-enable max-len */
					publication: '23rd International World Wide Web Conference',
					url: 'http://davian.korea.ac.kr/filemanager/wl/?id=vHdYQ0qgoktBkmtpdfhY6fIxea3eSNQ3'
				},
				{
					year: 2014,
					author: 'Choo, Jaegul et al',
					title: 'Understanding and Promoting Micro-finance Activities in Kiva.org',
					publication: '7th ACM International Conference on Web Search and Data Mining',
					url: 'http://davian.korea.ac.kr/filemanager/wl/?id=vpPIpVAYZAozQXhJoXvDf1TeVJFLjKkk'
				},
				{
					year: 2013,
					author: 'Meer, Jonathan, and Oren Rigbi',
					/* eslint-disable max-len */
					title: 'The Effects of Transactions Costs and Social Distance: Evidence from a Field Experiment.',
					/* eslint-enable max-len */
					publication: 'The BE Journal of Economic Analysis & Policy',
					url: 'http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.706.1636&rep=rep1&type=pdf'
				},
				{
					year: 2013,
					author: 'Schaff, Pim',
					title: 'Effect of teams on lending behavior on Kiva.org',
					publication: 'Thesis. Erasmus Univeresiteit Rotterdam, 2013',
					url: 'http://thesis.pimschaaf.nl/'
				},
				{
					year: 2012,
					author: 'Liu, Yang, et al',
					title: 'I loan because...: understanding motivations for pro-social lending',
					/* eslint-disable max-len */
					publication: 'Proceedings of the fifth ACM international conference on Web search and data mining. ACM, 2012.',
					/* eslint-enable max-len */
					url: 'http://www-personal.umich.edu/~qmei/pub/wsdm2012-liu.pdf'
				},
				{
					year: 2012,
					author: 'Chen, Roy W',
					title: 'Social Identity and Cooperation',
					publication: 'Doctoral Dissertation. The University of Michigan, 2012',
					/* eslint-disable max-len */
					url: 'https://deepblue.lib.umich.edu/bitstream/handle/2027.42/93941/roywchen_1.pdf?sequence=1'
					/* eslint-enable max-len */
				},
				{
					year: 2011,
					author: 'Galak, Jeff et al',
					title: 'Micro-Finance Decision Making: A Field Study of Prosocial Lending',
					publication: 'Journal of Marketing Research',
					url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1634949'
				},
				{
					year: 2010,
					author: 'Hartley, Scott',
					title: 'Kiva. org: Crowd-Sourced Microfinance & Cooperation in Group Lending',
					publication: 'Havard University Working Paper',
					url: 'http://dash.harvard.edu/bitstream/handle/1/3757699/Hartley_Kiva_DASH.pdf'
				}
			],
		};
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

</style>
