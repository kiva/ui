<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">

		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import KvCodeBlock from '@/components/Kv/KvCodeBlock';

export default {
	components: {
		WwwPage,
		DeveloperSecondaryMenu,
	},
	metaInfo: {
		title: 'Research'
	},
	data: {
		papers: [
							{2018 :
                [{"author(s)" : "Rietveld, Joost et al",
                "title": "Market Orchestrators: The Effect of Platform Certification on Complementor Performance and Behavior in the Context of Kiva (2010-2013)",
                "publication": "Social Science Research Network",
                "url": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3131553"
								},
                {"author(s)": "Moss, Todd, et al",
                "title": "Funding the Story of hybrid Ventures: Crowdfunder Lending Preferences and Linguistic Hybridity",
                "publication": "Journal of Business Venturing",
                "url":""
                },
                {"author(s)": "O’Luing, Mervyn, et al",
                "title": "A Grouping Genetic Algorithm for Joint Stratification and Sample Allocation Designs",
                "publication": "Insight Centre for Data Analytics",
                "url":""
                },
                {"author(s)": "Burke, Robin et al",
                "title": "Balanced Neighborhoods for Multi-sided Fairness in Recommendation",
                "publication": "Proceedings of Machine Learning Research",
                "url":""
								}]
							},
    					{2017 :
                [{"author(s)": "Thai T. Pham and Yuanyuan Shen",
                "title": "A Deep Causal Inference Approach to Measuring the Effects of Forming Group Loans in Online Non-profit Microfinance Platform",
                "publication":"Dissertation Graduate School of Business, Stanford University",
                "url":""
                },
                {"author(s)": "Yang, Diyi and Kraut Robert",
                "title": "Persuading Teammates to Give: Systematic versus Heuristic Cues for Soliciting Loans",
                "publication": "Proceedings of the ACM on Human-Computer Interaction Proceedings of the ACM on Human-Computer Interaction. DOI: 0.1145/3134749",
                "url":""
                }]
							},
							{2016 :[
                {"author(s)": "Chen, Yan et al",
                "title": "Recommending Teams Promotes Prosocial Lending in Online Microfinance",
                "publication": "PNAS: Proceedings of the National Academy of Sciences",
                "url":""
								}]
							},
							{2015 :[
                {"author(s)": "Paruthi, Gaurav et al",
                "title": "The Role of Rating and Loan Characteristics in Online Microfunding Behaviors",
                "publication": "Data For Good Exchange",
                "url":""
                },
                {"author(s)": "Genevsky, Alexander and Knutson, Brian",
                "title": "Neural Affective Mechanisms Predict Market-Level Microlending",
                "publication": "Psychological Science",
                "url":""
                }]
							},
							{2014 :[
                {"author(s)": "Choo, Jaegul et al",
                "title": "To Gather Together for a Better World: Understanding and Leveraging Communities in Micro-lending Recommendation",
                "publication": "23rd International World Wide Web Conference",
                "url":""
                },
                {"author(s)": "Choo, Jaegul et al",
                "title": "Understanding and Promoting Micro-finance Activities in Kiva.org",
                "publication": "7th ACM International Conference on Web Search and Data Mining",
                "url":""
                }]
							},
							{2013 :[
                {"author(s)": "Meer, Jonathan, and Oren Rigbi",
                "title": "The Effects of Transactions Costs and Social Distance: Evidence from a Field Experiment.",
                "publication": "The BE Journal of Economic Analysis & Policy",
                "url":""
                },
                {"author(s)": "Schaff, Pim",
                "title": "Effect of teams on lending behavior on Kiva.org",
                "publication": "Thesis. Erasmus Univeresiteit Rotterdam, 2013",
                "url":""
                }]
							},
							{2012 :[
                {"author(s)": "Liu, Yang, et al",
                "title": "I loan because...: understanding motivations for pro-social lending",
                "publication": "Proceedings of the fifth ACM international conference on Web search and data mining. ACM, 2012.",
                "url":
                },
                {"author(s)": "Chen, Roy W",
                "title": "Social Identity and Cooperation",
                "publication": "Doctoral Dissertation. The University of Michigan, 2012",
                "url": ""
                }]
							},
							{2010:[
                {"author(s)": "Hartley, Scott",
                "title": "Kiva. org: Crowd-Sourced Microfinance & Cooperation in Group Lending",
                "publication": "Harvard University Working Paper, 2010",
                "url":""
								}]
							}
    				]
				},
			};
<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.callout {
	background-color: $kiva-alert-yellow;
	padding: 1.625rem;
	margin: 0.5rem 0;
}
</style>
