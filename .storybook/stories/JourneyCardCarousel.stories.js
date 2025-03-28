import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel.vue';

export default {
	title: 'MyKiva/JourneyCardCarousel',
	component: JourneyCardCarousel,
};

const slideData = {
	"metadata": {
		"tags": [],
		"concepts": []
	},
	"sys": {
		"space": {
			"sys": {
				"type": "Link",
				"linkType": "Space",
				"id": "j0p9a6ql0rn7"
			}
		},
		"id": "3o3K7MEh5uVtlJVIpSeGo1",
		"type": "Entry",
		"createdAt": "2025-03-27T17:44:50.639Z",
		"updatedAt": "2025-03-27T17:51:18.855Z",
		"environment": {
			"sys": {
				"id": "development",
				"type": "Link",
				"linkType": "Environment"
			}
		},
		"publishedVersion": 9,
		"revision": 2,
		"contentType": {
			"sys": {
				"type": "Link",
				"linkType": "ContentType",
				"id": "richTextContent"
			}
		},
		"locale": "en-US"
	},
	"fields": {
		"key": "my-kiva-women-journey",
		"name": "My Kiva Women's Journey",
		"richText": {
			"data": {},
			"content": [
				{
					"data": {
						"target": {
							"metadata": {
								"tags": [],
								"concepts": []
							},
							"sys": {
								"space": {
									"sys": {
										"type": "Link",
										"linkType": "Space",
										"id": "j0p9a6ql0rn7"
									}
								},
								"id": "4so9JjqLLH6edFsyfSiDSF",
								"type": "Asset",
								"createdAt": "2025-03-27T17:37:04.934Z",
								"updatedAt": "2025-03-27T17:37:04.934Z",
								"environment": {
									"sys": {
										"id": "development",
										"type": "Link",
										"linkType": "Environment"
									}
								},
								"publishedVersion": 5,
								"revision": 1,
								"locale": "en-US"
							},
							"fields": {
								"title": "Women Journey Hero BG",
								"description": "",
								"file": {
									"url": "//images.ctfassets.net/j0p9a6ql0rn7/4so9JjqLLH6edFsyfSiDSF/45cfa5d3fadbbd52a89ba9b6dc1c4da4/women-hero.jpeg",
									"details": {
										"size": 8606393,
										"image": {
											"width": 4096,
											"height": 2734
										}
									},
									"fileName": "women-hero.jpeg",
									"contentType": "image/jpeg"
								}
							}
						}
					},
					"content": [],
					"nodeType": "embedded-asset-block"
				},
				{
					"data": {
						"target": {
							"metadata": {
								"tags": [],
								"concepts": []
							},
							"sys": {
								"space": {
									"sys": {
										"type": "Link",
										"linkType": "Space",
										"id": "j0p9a6ql0rn7"
									}
								},
								"id": "2MmH5aNIzfqjWwLDPihyUE",
								"type": "Entry",
								"createdAt": "2025-03-27T17:44:39.011Z",
								"updatedAt": "2025-03-27T17:48:30.301Z",
								"environment": {
									"sys": {
										"id": "development",
										"type": "Link",
										"linkType": "Environment"
									}
								},
								"publishedVersion": 19,
								"revision": 3,
								"contentType": {
									"sys": {
										"type": "Link",
										"linkType": "ContentType",
										"id": "uiSetting"
									}
								},
								"locale": "en-US"
							},
							"fields": {
								"key": "women-journey-hero-settings",
								"active": true,
								"startDate": "2025-03-26T00:00-06:00",
								"endDate": "2125-03-27T00:00-06:00",
								"dataObject": {
									"title": "Women’s equality",
									"subtitle": "",
									"primaryCtaText": "Lend to a woman",
									"primaryCtaUrl": "/lend/filter",
									"secondaryCtaText": "See your progress",
									"secondaryCtaUrl": "/portfolio"
								}
							}
						}
					},
					"content": [],
					"nodeType": "embedded-entry-block"
				},
				{
					"data": {},
					"content": [
						{
							"data": {},
							"marks": [],
							"value": "",
							"nodeType": "text"
						}
					],
					"nodeType": "paragraph"
				}
			],
			"nodeType": "document"
		}
	}
};

const slides = [
		{
			...slideData,
			badgeUrl: '//images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/70d21f8db5f93b20be1581ef333dc60e/Women_10.svg',
		},
		{
			...slideData,
			badgeUrl: '//images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/70d21f8db5f93b20be1581ef333dc60e/Women_10.svg', 
		},
		{
			...slideData,
			badgeUrl: '//images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/70d21f8db5f93b20be1581ef333dc60e/Women_10.svg',
		 },
		{
			...slideData,
			badgeUrl: '//images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/70d21f8db5f93b20be1581ef333dc60e/Women_10.svg',
		},
		{
			...slideData,
			badgeUrl: '//images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/70d21f8db5f93b20be1581ef333dc60e/Women_10.svg',
		},
];

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { JourneyCardCarousel },
		setup() { return { args }; },
		template: `
			<div style="max-width: 1200px;">
				<journey-card-carousel v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ slides });
export const Loading = story({ slides: [{}, {}], isLoading: true });
