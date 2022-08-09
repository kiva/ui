<template>
	<www-page>
		<template #secondary>
			<developer-secondary-menu />
		</template>
		<build-page-wrapper class="tw-prose">
			<h1>Research</h1>
			<p>
				Kiva is proud to have worked with the academic and research community for over 10 years.
				Some of Kiva's research and education partners include: Stanford University,
				University of Michigan, UC Berkeley, University of Washington, University of San Francisco.
			</p>
			<p>
				If your group is interested in a research collaboration with Kiva, Kiva's current
				research interests include:
			</p>
			<div v-for="topic in topics" :key="topic">
				<ul>
					<li>{{ topic }}</li>
				</ul>
			</div>
			<p>
				Please find below selected publications featuring Kiva data that are available on
				the open web.
			</p>
			<div v-for="year in years" :key="year">
				<h2>{{ year }}</h2>
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
		</build-page-wrapper>
	</www-page>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import BuildPageWrapper from '@/components/Build/BuildPageWrapper';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	name: 'Research',
	components: {
		DeveloperSecondaryMenu,
		BuildPageWrapper,
		WwwPage,
	},
	metaInfo: {
		title: 'Research'
	},
	data() {
		return {
			topics: ['Creation of Synthetic Datasets', 'Recommendation systems', 'Social Good ML Applications',
				'Pro-Social Behaviorial Psychology', 'Fairness Research', 'Social Impact Assessments'],
			years: [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010],
			/* eslint-disable max-len */
			papers: [
				{
					year: 2020,
					author: 'Burke, Robin, Voida, Amy, et al.',
					title: 'Algorithmic Fairness, Institutional Logics, and Social Choice',
					publication: 'Harvard Center for Research on Computation and Society: AI for Social Good workshop.',

					url: 'https://crcs.seas.harvard.edu/files/crcs/files/ai4sg_2020_paper_29.pdf'
				},
				{
					year: 2020,
					author: 'Burke, Robin, Sonboli, Nasim, et al.',
					title: '“And the Winner Is...”: Dynamic Lotteries for Multi-group Fairness-Aware Recommendation',

					publication: '14th ACM Conference on Recommender Systems, 2020',
					url: 'https://arxiv.org/pdf/2009.02590.pdf'
				},
				{
					year: 2020,
					author: 'Sonboli, Nasim, Burke, Robin,  et al.',
					title: '“Opportunistic Multi-aspect Fairness through Personalized Re-ranking',
					publication: 'Proceedings of the 28th ACM Conference on User Modeling, Adaptation and Personalization',

					url: 'https://arxiv.org/pdf/2005.12974.pdf'
				},
				{
					year: 2019,
					author: 'Wang, Bin et al',
					title: 'Social Networks in Online Peer-to-Peer Lending: The Case of Event-Type Ties as Pipes and Prisms',

					publication: 'Proceedings of the 52nd Hawaii International Conference on System Sciences',
					url: 'https://scholarspace.manoa.hawaii.edu/bitstream/10125/60099/0659.pdf'
				},
				{
					year: 2019,
					author: 'O’Luing, Mervyn, et al',
					title: 'A Grouping Genetic Algorithm for Joint Stratification and Sample Allocation Designs',

					publication: 'Survey Methodology',
					url: 'https://www150.statcan.gc.ca/n1/pub/12-001-x/2019003/article/00007-eng.pdf'
				},
				{
					year: 2019,
					author: 'Tsai, Jeanne et al',
					title: 'Culturally Valued Facial Expressions Enhance Loan Request Success',
					publication: 'Emotion',
					url: 'https://culture-emotion-lab.sites.stanford.edu/sites/g/files/sbiybj9351/f/culturallyvaluedfacialloansuccess.pdf',

				},
				{
					year: 2019,
					author: 'Zhao, Hongke et al',
					title: 'Voice of Charity: Prospecting the Donation Recurrence & Donor Retention in Crowdfunding',

					publication: 'IEEE Transactions on Knowledge and Data Engineering',
					url: 'http://staff.ustc.edu.cn/~cheneh/paper_pdf/2019/Hongke-Zhao-TKDE.pdf',
				},
				{
					year: 2018,
					author: 'Jain, Lalit and Jamieson, Kevin',
					title: 'Firing Bandits: Optimizing Crowdfunding',
					publication: 'Proceedings of the 35th International Conference on Machine Learning, Stockholm, Sweden, PMLR 80.',

					url: 'http://proceedings.mlr.press/v80/jain18a/jain18a.pdf'
				},
				{
					year: 2018,
					author: 'Sun, Lu, Kraut, Robert, and Yang, Diyi',
					title: 'Multi-level Modeling of Social Roles in Online Micro-lending Platforms',

					publication: 'Journal of Association for Computing Machinery',
					url: 'https://www.cc.gatech.edu/~dyang888/docs/cscw19_sun.pdf'
				},
				{
					year: 2018,
					author: 'Rietveld, Joost et al',
					title: 'Market Orchestrators: The Effect of Platform Certification on Complementor Performance and Behavior in the Context of Kiva (2010-2013)',

					publication: 'Social Science Research Network',
					url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3131553'
				},
				{
					year: 2018,
					author: 'Moss, Todd, et al',
					title: 'Funding the Story of hybrid Ventures: Crowdfunder Lending Preferences and Linguistic Hybridity',

					publication: 'Journal of Business Venturing',
					url: 'https://whitman.syr.edu/pdfa/fundingthestoryofhybridventures.pdf'
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
					title: 'A Deep Causal Inference Approach to Measuring the Effects of Forming Group Loans in Online Non-profit Microfinance Platform',

					publication: 'Dissertation Graduate School of Business, Stanford University',
					url: 'https://arxiv.org/pdf/1706.02795.pdf'
				},
				{
					year: 2017,
					author: 'Yang, Diyi and Kraut Robert',
					title: 'Persuading Teammates to Give: Systematic versus Heuristic Cues for Soliciting Loans',
					publication: 'Proceedings of the ACM on Human-Computer Interaction Proceedings of the ACM on Human-Computer Interaction. DOI: 0.1145/3134749',
					url: 'https://kraut.hciresearch.info/wp-content/uploads/Yang17-PersuadingTeammatesToGive.pdf'

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
					title: 'The Role of Rating and Loan Characteristics in Online Microfunding Behaviors',
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
					title: 'To Gather Together for a Better World: Understanding and Leveraging Communities in Micro-lending Recommendation',
					publication: '23rd International World Wide Web Conference',
					url: 'https://smartech.gatech.edu/bitstream/handle/1853/49249/GT-CSE-2013-05.pdf'
				},
				{
					year: 2014,
					author: 'Choo, Jaegul et al',
					title: 'Understanding and Promoting Micro-finance Activities in Kiva.org',
					publication: '7th ACM International Conference on Web Search and Data Mining',
					url: 'https://www.cc.gatech.edu/~hpark/papers/wsdm_kiva.pdf'
				},
				{
					year: 2013,
					author: 'Cryder, Cynthia et al',
					title: 'Goal gradient in helping behavior',
					publication: 'Journal of Experimental Social Psychology',
					url: 'https://www.cmu.edu/dietrich/sds/docs/loewenstein/GoalGradBeh.pdf'
				},
				{
					year: 2013,
					author: 'Meer, Jonathan, and Oren Rigbi',
					title: 'The Effects of Transactions Costs and Social Distance: Evidence from a Field Experiment.',
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
					publication: 'Proceedings of the fifth ACM international conference on Web search and data mining. ACM, 2012.',
					url: 'http://www-personal.umich.edu/~qmei/pub/wsdm2012-liu.pdf'
				},
				{
					year: 2012,
					author: 'Chen, Roy W',
					title: 'Social Identity and Cooperation',
					publication: 'Doctoral Dissertation. The University of Michigan, 2012',
					url: 'https://deepblue.lib.umich.edu/bitstream/handle/2027.42/93941/roywchen_1.pdf?sequence=1'

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
				/* eslint-enable max-len */
			],
		};
	}
};
</script>
