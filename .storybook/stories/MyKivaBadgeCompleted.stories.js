import BadgeCompleted from '#src/components/MyKiva/BadgeCompleted.vue';

export default {
	title: 'MyKiva/BadgeCompleted',
	component: BadgeCompleted,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeCompleted },
		setup() { return { args }; },
		template: `
			<badge-completed v-bind="args" />
		`,
	});
	template.args = args;
	return template;
};

const contentfulBadgeData = {
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
      "id": "5qVq3IF07C8um3AiQVjLK5",
      "type": "Entry",
      "createdAt": "2024-10-08T20:25:25.114Z",
      "updatedAt": "2024-10-15T23:11:19.111Z",
      "environment": {
        "sys": {
          "id": "development",
          "type": "Link",
          "linkType": "Environment"
        }
      },
      "revision": 4,
      "contentType": {
        "sys": {
          "type": "Link",
          "linkType": "ContentType",
          "id": "challenge"
        }
      },
      "locale": "en-US"
    },
    "fields": {
      "key": "us-economic-equality-level-2",
      "challengeName": "U.S. Economic equality (level 2)",
      "badgeImage": {
        "metadata": {
          "tags": []
        },
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "j0p9a6ql0rn7"
            }
          },
          "id": "62zEUpZbO7qWZPoV1z2pZU",
          "type": "Asset",
          "createdAt": "2024-10-08T20:25:01.320Z",
          "updatedAt": "2024-10-08T20:25:01.320Z",
          "environment": {
            "sys": {
              "id": "development",
              "type": "Link",
              "linkType": "Environment"
            }
          },
          "revision": 1,
          "locale": "en-US"
        },
        "fields": {
          "title": "US Economic Equality Level 2",
          "description": "",
          "file": {
            "url": "//images.ctfassets.net/j0p9a6ql0rn7/62zEUpZbO7qWZPoV1z2pZU/f094aa821bdf8a5f8634b28562135594/US_Economic_Equality_Level_2.svg",
            "details": {
              "size": 18162550,
              "image": {
                "width": 2382,
                "height": 2382
              }
            },
            "fileName": "US Economic Equality Level 2.svg",
            "contentType": "image/svg+xml"
          }
        }
      },
      "thankYouImage": {
        "metadata": {
          "tags": []
        },
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "j0p9a6ql0rn7"
            }
          },
          "id": "62zEUpZbO7qWZPoV1z2pZU",
          "type": "Asset",
          "createdAt": "2024-10-08T20:25:01.320Z",
          "updatedAt": "2024-10-08T20:25:01.320Z",
          "environment": {
            "sys": {
              "id": "development",
              "type": "Link",
              "linkType": "Environment"
            }
          },
          "revision": 1,
          "locale": "en-US"
        },
        "fields": {
          "title": "US Economic Equality Level 2",
          "description": "",
          "file": {
            "url": "//images.ctfassets.net/j0p9a6ql0rn7/62zEUpZbO7qWZPoV1z2pZU/f094aa821bdf8a5f8634b28562135594/US_Economic_Equality_Level_2.svg",
            "details": {
              "size": 18162550,
              "image": {
                "width": 2382,
                "height": 2382
              }
            },
            "fileName": "US Economic Equality Level 2.svg",
            "contentType": "image/svg+xml"
          }
        }
      },
      "shareFact": "3 in 5 U.S. business owners brought in more income after their Kiva loan.*",
      "shareFactUrl": "/",
      "dateTagline": "N/A",
      "shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels."
    }
}

export const Default = story({
  badge: contentfulBadgeData,
  lendingAchievement: {
      "id": "us-economic-equality",
      "tiers": [
        {
          "completedDate": "2021-01-01T00:00:00Z",
          "learnMoreURL": "",
          "target": 2,
          "tierStatement": ""
        },
        {
          "completedDate": "2021-01-01T00:00:00Z",
          "learnMoreURL": "",
          "target": 3,
          "tierStatement": ""
        },
        {
          "completedDate": "2021-01-01T00:00:00Z",
          "learnMoreURL": "",
          "target": 5,
          "tierStatement": ""
        },
        {
          "completedDate": "2021-01-01T00:00:00Z",
          "learnMoreURL": "",
          "target": 10,
          "tierStatement": ""
        },
        {
          "completedDate": "2021-04-20T00:00:00Z",
          "learnMoreURL": "https://www.kiva.org/impact/systemically-marginalized-communities",
          "target": 20,
          "tierStatement": "70% of U.S. business owners surveyed were more confident in their business as a result of their loan.*"
        },
        {
          "completedDate": null,
          "learnMoreURL": "",
          "target": 50,
          "tierStatement": ""
        },
        {
          "completedDate": null,
          "learnMoreURL": "",
          "target": 100,
          "tierStatement": ""
        },
      ],
      "description": "description",
      "totalProgressToAchievement": 0,
      "status": "PARTIALLY_COMPLETE"
  },
  lender: {
    publicName: 'Christian',
    public: true,
    publicId: 'christian78848470'
  }
});
