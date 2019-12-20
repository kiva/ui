import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import GlobalPromoContentful from '@/components/WwwFrame/PromotionalBanner/GlobalPromotionalBannerContentful';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

const mockedContentfulAPIResponse = {
	data: {
		contentfulCMS: {
			items: [{
				key: 'ui-global-promo',
				active: true,
				startDate: "2019-01-02T00:00-08:00",
				endDate: "2030-01-02T00:00-08:00",
				content: [
					{
						fields: {
							active: true,
							startDate: "2019-01-02T00:00-08:00",
							endDate: "2030-01-02T00:00-08:00",
							bannerName: '',
							kvTrackEvent: [],
							link: '',
							richText: {
								"data":{},
								"content":[{
									"data":{},
									"content":[{
										"data":{},
										"marks":[],
										"value":"Invite someone special to Kiva using your unique share link!",
										"nodeType":"text"
									}],
									"nodeType":"paragraph"
								}],
								"nodeType":"document"
							},
						}
					}
				]
			}]

		}
	}
}
export default {
	title: 'Apollo Examples|Global Promotional Banner Contentful',
	decorators: [StoryRouter()],
};

export const Default = () => ({
	provide: {
		apollo: {
			query() {
				return Promise.resolve(mockedContentfulAPIResponse);
			}
		},
	},
	components: {
		GlobalPromoContentful,
	},
	template: `
		<global-promo-contentful />
	`,
});
