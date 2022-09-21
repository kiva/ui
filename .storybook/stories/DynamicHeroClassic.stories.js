import DynamicHeroClassic from '@/components/Contentful/DynamicHeroClassic';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

export default {
	title: 'kv/KvDynamicHeroClassic',
	component: DynamicHeroClassic,
	args: {
        content: {
            "key": "hp-classic-standard-hero",
            "name": "hp-classic-standard-hero",
            "type": "dynamicHeroClassic",
            "title": null,
            "contents": [
                {
                "key": "hp-classic-standard-hero-gcb",
                "name": "hp-classic-standard-hero-gcb",
                "bodyCopy": {
                    "nodeType": "document",
                    "data": {},
                    "content": [
                        {
                            "nodeType": "paragraph",
                            "data": {},
                            "content": [
                            {
                                "nodeType": "text",
                                "value": "1. Laura and her husband, Walcenibier, need a $1000 loan to grow their empanada business",
                                "marks": [],
                                "data": {}
                            }
                            ]
                        },
                            {
                            "nodeType": "paragraph",
                            "data": {},
                            "content": [
                            {
                                "nodeType": "text",
                                "value": "2. Laura and her husband, Walcenibier, need a $1000 loan to grow their empanada business",
                                "marks": [],
                                "data": {}
                            },
                            {
                                nodeType: 'text',
                                value: ' Lorem ipsum',
                                data: {
                                    class: 'tw-text-brand'
                                },
                                marks: [{ type: 'bold'}],
                            }
                            ]
                        },
                            {
                            "nodeType": "paragraph",
                            "data": {},
                            "content": [
                            {
                                "nodeType": "text",
                                "value": "3. 37 people lend money through Kiva to help them fund their loan",
                                "marks": [],
                                "data": {}
                            },
                            {
                                nodeType: 'text',
                                value: ' Lorem ipsum',
                                data: {},
                                marks: [{ type: 'underline'}],
                            }
                            ]
                        },
                            {
                            "nodeType": "paragraph",
                            "data": {},
                            "content": [
                            {
                                "nodeType": "text",
                                "value": "4. 37 people lend money through Kiva to help them fund their loan",
                                "marks": [],
                                "data": {}
                            },
                            {
                                nodeType: 'text',
                                value: ' Lorem ipsum',
                                data: {},
                                marks: [{ type: 'italic'}],
                            }
                            ]
                        }
                    ]
                },
                "headline": "<nobr>Make a loan,</nobr> <nobr><span class=\"tw-text-brand\">change a life</span></nobr>.",
                "contentType": "genericContentBlock"
                },
                {
                "label": "Find a borrower",
                "style": "primary",
                "webLink": "/lend-by-category",
                "analyticsClickEvent": [
                    "homepage",
                    "click-standard-hero-cta",
                    "Find a borrower"
                ],
                "contentType": "button"
                },
                {
                "label": "Learn more",
                "style": "secondary",
                "webLink": "/lend-by-category",
                "analyticsClickEvent": [
                    "homepage",
                    "click-standard-hero-cta",
                    "Find a borrower"
                ],
                "contentType": "button"
                }
            ],
            "media": [
                {
                "title": "StaticLoanCard",
                "description": "Asunta | A loan of $1,950 helps to increase production by hiring more artisans for her workshop.",
                "file": {
                    "url": "//images.ctfassets.net/j0p9a6ql0rn7/3mOH6ZpXwkg8QjHud1tNMZ/cbfa3eaec8bcb730c09d8fb6aeee0080/MGCampaignLoanCardStatic.jpg",
                    "details": {
                    "size": 336770,
                    "image": {
                        "width": 762,
                        "height": 906
                    }
                    },
                    "fileName": "MGCampaignLoanCardStatic.jpg",
                    "contentType": "image/jpeg"
                }
                }
            ]
        }
    },
}

export const Default = (args, { argTypes }) => ({
	components: {
		DynamicHeroClassic,
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin()],
	template: `
		<dynamic-hero-classic :content="content" />
	`,
});
