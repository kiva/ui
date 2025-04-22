import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel.vue';
import {
	badgeWomensEquality,
} from '../mock-data/badge-journey-data-mock';

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
                                "updatedAt": "2025-04-02T23:05:02.810Z",
                                "environment": {
                                    "sys": {
                                        "id": "development",
                                        "type": "Link",
                                        "linkType": "Environment"
                                    }
                                },
                                "publishedVersion": 8,
                                "revision": 2,
                                "locale": "en-US"
                            },
                            "fields": {
                                "title": "Women Journey Hero BG",
                                "description": "",
                                "file": {
                                    "url": "//images.ctfassets.net/j0p9a6ql0rn7/4so9JjqLLH6edFsyfSiDSF/7ef2518cb8b28fab523ec723c9f113de/women_cta_bg.jpeg",
                                    "details": {
                                        "size": 440061,
                                        "image": {
                                            "width": 700,
                                            "height": 467
                                        }
                                    },
                                    "fileName": "women_cta_bg.jpeg",
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
                                "updatedAt": "2025-04-17T17:10:25.192Z",
                                "environment": {
                                    "sys": {
                                        "id": "development",
                                        "type": "Link",
                                        "linkType": "Environment"
                                    }
                                },
                                "publishedVersion": 37,
                                "revision": 10,
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
                                    "primaryCtaText": "Lend to a woman",
                                    "primaryCtaUrl": "/lend-by-category/women",
                                    "secondaryCtaText": "See your progress",
                                    "secondaryCtaUrl": "/mykiva?journey=womens-equality",
                                    "achievementKey": "womens-equality"
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

const nonBadgeData = {
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
        "id": "76YwCih0L4FCiexX3zqk2n",
        "type": "Entry",
        "createdAt": "2025-04-15T16:37:45.939Z",
        "updatedAt": "2025-04-22T16:18:46.743Z",
        "environment": {
            "sys": {
                "id": "development",
                "type": "Link",
                "linkType": "Environment"
            }
        },
        "publishedVersion": 15,
        "revision": 6,
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
        "key": "my-kiva-join-team-card",
        "name": "My Kiva Join Team",
        "richText": {
            "nodeType": "document",
            "data": {},
            "content": [
                {
                    "nodeType": "embedded-entry-block",
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
                                "id": "1sumKmVTAP4MrcuwayXPkP",
                                "type": "Entry",
                                "createdAt": "2025-04-22T16:11:10.912Z",
                                "updatedAt": "2025-04-22T16:11:10.912Z",
                                "environment": {
                                    "sys": {
                                        "id": "development",
                                        "type": "Link",
                                        "linkType": "Environment"
                                    }
                                },
                                "publishedVersion": 3,
                                "revision": 1,
                                "contentType": {
                                    "sys": {
                                        "type": "Link",
                                        "linkType": "ContentType",
                                        "id": "media"
                                    }
                                },
                                "locale": "en-US"
                            },
                            "fields": {
                                "key": "my-kiva-join-team-card-mobile",
                                "contentLight": [
                                    {
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
                                            "id": "6D5K2GfH04Vg3JtA14ql7o",
                                            "type": "Asset",
                                            "createdAt": "2025-04-22T16:11:04.194Z",
                                            "updatedAt": "2025-04-22T16:11:04.194Z",
                                            "environment": {
                                                "sys": {
                                                    "id": "development",
                                                    "type": "Link",
                                                    "linkType": "Environment"
                                                }
                                            },
                                            "publishedVersion": 4,
                                            "revision": 1,
                                            "locale": "en-US"
                                        },
                                        "fields": {
                                            "title": "my-kiva-join-team-card-mobile-asset",
                                            "description": "",
                                            "file": {
                                                "url": "//images.ctfassets.net/j0p9a6ql0rn7/6D5K2GfH04Vg3JtA14ql7o/86b4eed566fd11c5eaa3f56afaac3aae/M_-_Join_Card.png",
                                                "details": {
                                                    "size": 56838,
                                                    "image": {
                                                        "width": 644,
                                                        "height": 804
                                                    }
                                                },
                                                "fileName": "M - Join Card.png",
                                                "contentType": "image/png"
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    "content": []
                },
                {
                    "nodeType": "embedded-entry-block",
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
                                "id": "1TpB1xNbcklGgGdRtRhG72",
                                "type": "Entry",
                                "createdAt": "2025-04-22T16:15:22.104Z",
                                "updatedAt": "2025-04-22T16:15:22.104Z",
                                "environment": {
                                    "sys": {
                                        "id": "development",
                                        "type": "Link",
                                        "linkType": "Environment"
                                    }
                                },
                                "publishedVersion": 3,
                                "revision": 1,
                                "contentType": {
                                    "sys": {
                                        "type": "Link",
                                        "linkType": "ContentType",
                                        "id": "media"
                                    }
                                },
                                "locale": "en-US"
                            },
                            "fields": {
                                "key": "my-kiva-join-team-card-desktop",
                                "contentLight": [
                                    {
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
                                            "id": "1yLhf0Nkw8LdsYul6y6f56",
                                            "type": "Asset",
                                            "createdAt": "2025-04-22T16:15:15.777Z",
                                            "updatedAt": "2025-04-22T16:15:15.777Z",
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
                                            "title": "my-kiva-join-team-card-desktop-asset",
                                            "description": "",
                                            "file": {
                                                "url": "//images.ctfassets.net/j0p9a6ql0rn7/1yLhf0Nkw8LdsYul6y6f56/00e644c799dc787410fbb7c43f09e9c2/D_-_Join_Card.png",
                                                "details": {
                                                    "size": 68173,
                                                    "image": {
                                                        "width": 1040,
                                                        "height": 780
                                                    }
                                                },
                                                "fileName": "D - Join Card.png",
                                                "contentType": "image/png"
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    "content": []
                },
                {
                    "nodeType": "embedded-entry-block",
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
                                "id": "71eZ7rwtSICIEgvYOyViMn",
                                "type": "Entry",
                                "createdAt": "2025-04-15T16:31:05.921Z",
                                "updatedAt": "2025-04-22T19:26:33.174Z",
                                "environment": {
                                    "sys": {
                                        "id": "development",
                                        "type": "Link",
                                        "linkType": "Environment"
                                    }
                                },
                                "publishedVersion": 29,
                                "revision": 7,
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
                                "key": "my-kiva-join-team-hero-settings",
                                "active": true,
                                "startDate": "2025-04-14T00:00-07:00",
                                "endDate": "2125-04-14T00:00-07:00",
                                "dataObject": {
                                    "title": "Lend together",
                                    "primaryCtaText": "Explore lending teams",
                                    "primaryCtaUrl": "/teams",
                                    "primaryCtaVariant": "primary",
                                    "contentText": "Lending teams are based on shared interests or location. Join a team and take your impact further!"
                                }
                            }
                        }
                    },
                    "content": []
                },
                {
                    "nodeType": "paragraph",
                    "data": {},
                    "content": [
                        {
                            "nodeType": "text",
                            "value": "",
                            "marks": [],
                            "data": {}
                        }
                    ]
                }
            ]
        }
    }
};

const badgesData = [
	badgeWomensEquality
];

const slides = [
		slideData,
		nonBadgeData,
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

export const Default = story({ slides, badgesData });
