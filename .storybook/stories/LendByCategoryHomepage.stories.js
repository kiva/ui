import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
import Vue2TouchEvents from 'vue2-touch-events';
Vue.use(kivaPlugins)
Vue.use(Vue2TouchEvents);

import StoryRouter from 'storybook-vue-router';
import LendByCategoryHomepage from '@/pages/Homepage/LendByCategoryHomepage';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import { mockLoansArray } from '../utils';
import mockedLoanChannelsData from '../mock-data/loan-channels-data-mock';

const mockedAPIResponse = {
	data: {
		general: {
			homepage_category_rows: {
				key: "ui.homepage_category_rows",
				value: "[{\"id\":52},{\"id\":96},{\"id\":93},{\"id\":89},{\"id\":87},{\"id\":4},{\"id\":102},{\"id\":25}]"
			}
		},
		lend: {
			loanChannelsById: mockedLoanChannelsData
		},
		contentful: {
			part1: {
				sys: {
					type: 'Array',
				},
				total: 1,
				skip: 0,
				limit: 100,
				items: [
					{
						sys: {
							space: {
								sys: {
									type: 'Link',
									linkType: 'Space',
									id: 'j0p9a6ql0rn7',
								},
							},
							id: '3CapD9VOqn6SUEzSN4lsXJ',
							type: 'Entry',
							createdAt: '2020-11-06T01:17:51.100Z',
							updatedAt: '2020-11-10T00:29:27.031Z',
							environment: {
								sys: {
									id: 'development',
									type: 'Link',
									linkType: 'Environment',
								},
							},
							revision: 7,
							contentType: {
								sys: {
									type: 'Link',
									linkType: 'ContentType',
									id: 'genericContentBlock',
								},
							},
							locale: 'en-US',
						},
						fields: {
							key: 'homepage-kiva-card-campaign-part-1',
							name: 'Homepage Kiva Card Campaign Part 1',
							bodyCopy: {
								data: {},
								content: [
									{
										data: {},
										content: [
											{
												data: {},
												marks: [],
												value:
                          'Make your gifts count this year—share the lending love. Introduce us to your friends and family through Kiva Cards.',
												nodeType: 'text',
											},
										],
										nodeType: 'paragraph',
									},
									{
										data: {},
										content: [
											{
												data: {},
												marks: [],
												value:
                          'Plus, when you buy two or more Kiva Cards this week, you’ll get a free $25 lending credit. ',
												nodeType: 'text',
											},
										],
										nodeType: 'paragraph',
									},
									{
										data: {},
										content: [
											{
												data: {},
												marks: [],
												value:
                          'What are you waiting for? Get a head start on gift giving now!',
												nodeType: 'text',
											},
										],
										nodeType: 'paragraph',
									},
								],
								nodeType: 'document',
							},
							headline: 'Share the love️ with Kiva Cards',
							primaryCtaLink: '/gifts/kiva-cards',
							primaryCtaText: 'Share the love',
						},
					},
				],
			},
			part2: {
				sys: {
					type: 'Array',
				},
				total: 1,
				skip: 0,
				limit: 100,
				items: [
					{
						sys: {
							space: {
								sys: {
									type: 'Link',
									linkType: 'Space',
									id: 'j0p9a6ql0rn7',
								},
							},
							id: '6iBW6SSUNLzdmE2Owbohmn',
							type: 'Entry',
							createdAt: '2020-11-10T00:18:59.891Z',
							updatedAt: '2020-11-10T00:29:13.695Z',
							environment: {
								sys: {
									id: 'development',
									type: 'Link',
									linkType: 'Environment',
								},
							},
							revision: 2,
							contentType: {
								sys: {
									type: 'Link',
									linkType: 'ContentType',
									id: 'genericContentBlock',
								},
							},
							locale: 'en-US',
						},
						fields: {
							key: 'homepage-kiva-card-campaign-part-2',
							name: 'Homepage Kiva Card Campaign Part 2',
							bodyCopy: {
								data: {},
								content: [
									{
										data: {},
										content: [
											{
												data: {},
												marks: [],
												value:
                          'Do away with the endless gadgets and gizmos for the holidays this year. Help people around the world during the season of giving by gifting Kiva Cards to your friends and family.',
												nodeType: 'text',
											},
										],
										nodeType: 'paragraph',
									},
								],
								nodeType: 'document',
							},
							headline: 'Share the love️ with Kiva Cards',
							primaryCtaLink: '/gifts/kiva-cards',
							primaryCtaText: 'Share the love',
						},
					},
				],
			},
		},
	}
}

export default {
	title: 'Pages/LendByCategoryHomepage',
	component: LendByCategoryHomepage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		'lend-by-category-homepage': LendByCategoryHomepage,
	},
	mixins: [apolloStoryMixin()],
	provide: {
		apollo: {
			readQuery() {
				return mockedAPIResponse.data;
			},
			query(params) {
				if (params.variables && params.variables.ids && params.variables.numberOfLoans) {
					const mockedLoanChannel = mockedAPIResponse.data.lend.loanChannelsById.find(channel => channel.id === params.variables.ids[0]);
					mockedLoanChannel.loans = {
						values:  mockLoansArray(params.variables.numberOfLoans),
					};
					return Promise.resolve({
						data: {
							lend: {
								loanChannelsById:[
									mockedLoanChannel
								]
							}
						}

					});
				}
				return Promise.resolve(mockedAPIResponse);
			},
		},
	},
	template: `
		<lend-by-category-homepage style="margin: -2rem" />
	`,
});
