import receiptData from '../mock-data/receipt-data-mock';

export const mockedReceiptData = receiptData;

export const mockLender = {
	firstName: 'Test',
	lastName: 'User',
	email: 'testuser@kiva.org',
	inviterName: 'testUser123',
};

export const mockLoans = mockedReceiptData.items.values
	.filter(item => item.basketItemType === 'loan_reservation')
	.map(item => item.loan);

export const MOCK_OLD_BADGE_ID = 'equity';
export const MOCK_TIERED_BADGE_ID = 'us-economic-equality';

export const mockUserAchievementProgress = {
	"id": "123#class org.kiva.achievements.graphql.entity.UserAchievements",
	"lendingAchievements": [
		{
			"id": MOCK_OLD_BADGE_ID,
			"description": "",
			"milestoneProgress": [
				{
					"earnedAtDate": "2024-10-29T23:41:19Z[UTC]",
					"id": "default",
					"milestoneStatus": "COMPLETE",
					"progress": 14,
					"target": 1,
					"__typename": "MilestoneProgressForUser"
				}
			],
			"__typename": "LendingAchievement"
		}
	],
	"tieredLendingAchievements": [
		{
			"id": MOCK_TIERED_BADGE_ID,
			"description": "Take action and address financial inequity in communities throughout the United States that have been historically and systemically marginalized.",
			"totalProgressToAchievement": 2,
			"tiers": [
				{
					"target": 2,
					"tierStatement": "statement1",
					"completedDate": "2024-10-22T18:49:21Z[UTC]",
					"learnMoreURL": "https://www.kiva.org/",
					"__typename": "Tier"
				},
				{
					"target": 3,
					"tierStatement": "staTEMENT2",
					"completedDate": null,
					"learnMoreURL": "https://www.kiva.org/",
					"__typename": "Tier"
				},
				{
					"target": 5,
					"tierStatement": "statement3",
					"completedDate": null,
					"learnMoreURL": "https://www.kiva.org/",
					"__typename": "Tier"
				},
				{
					"target": 10,
					"tierStatement": "statement4",
					"completedDate": null,
					"learnMoreURL": "https://www.kiva.org/",
					"__typename": "Tier"
				},
				{
					"target": 20,
					"tierStatement": "statement5",
					"completedDate": null,
					"learnMoreURL": "https://www.kiva.org/",
					"__typename": "Tier"
				},
				{
					"target": 50,
					"tierStatement": "statement 6",
					"completedDate": null,
					"learnMoreURL": "https://www.kiva.org/",
					"__typename": "Tier"
				},
				{
					"target": 100,
					"tierStatement": "statement 7",
					"completedDate": null,
					"learnMoreURL": "https://www.kiva.org/",
					"__typename": "Tier"
				}
			],
			"__typename": "TieredLendingAchievement"
		}
	],
	"__typename": "UserAchievements"
};

export const mockContentful = {
	"entries": {
		"items": [
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
					"id": "59P1CzNvXrjb1s9efHBJuI",
					"type": "Entry",
					"createdAt": "2024-09-12T22:17:49.610Z",
					"updatedAt": "2024-11-15T18:44:54.418Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 8,
					"revision": 2,
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
					"key": "equity",
					"challengeName": "Equality Badge",
					"badgeImage": {
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
							"id": "6yl0sXP8fgaRaRwIaEVJO4",
							"type": "Asset",
							"createdAt": "2024-09-12T22:17:31.431Z",
							"updatedAt": "2024-11-15T18:44:50.354Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 9,
							"revision": 2,
							"locale": "en-US"
						},
						"fields": {
							"title": "Equity - Equality - Badge",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/6yl0sXP8fgaRaRwIaEVJO4/23ca0d8da49569f1d318a76d3b7575b1/Equality.png",
								"details": {
									"size": 21222,
									"image": {
										"width": 283,
										"height": 300
									}
								},
								"fileName": "Equality.png",
								"contentType": "image/png"
							}
						}
					},
					"thankYouImage": {
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
							"id": "6yl0sXP8fgaRaRwIaEVJO4",
							"type": "Asset",
							"createdAt": "2024-09-12T22:17:31.431Z",
							"updatedAt": "2024-11-15T18:44:50.354Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 9,
							"revision": 2,
							"locale": "en-US"
						},
						"fields": {
							"title": "Equity - Equality - Badge",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/6yl0sXP8fgaRaRwIaEVJO4/23ca0d8da49569f1d318a76d3b7575b1/Equality.png",
								"details": {
									"size": 21222,
									"image": {
										"width": 283,
										"height": 300
									}
								},
								"fileName": "Equality.png",
								"contentType": "image/png"
							}
						}
					},
					"dateTagline": "n/a"
				}
			},
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
					"id": "2QeWQR6pXKFh3I74dqS0e0",
					"type": "Entry",
					"createdAt": "2024-10-08T20:32:39.633Z",
					"updatedAt": "2024-11-04T21:58:26.929Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 18,
					"revision": 5,
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
					"key": "us-economic-equality-level-7",
					"challengeName": "U.S. Economic equality",
					"levelName": "✨100✨",
					"badgeImage": {
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
							"id": "6p6BcDBlAb7ZoCaZaypJIT",
							"type": "Asset",
							"createdAt": "2024-10-08T20:32:25.037Z",
							"updatedAt": "2024-10-25T00:53:09.706Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 9,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equalitty Level 7",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/6p6BcDBlAb7ZoCaZaypJIT/959a8c1e856fc5f9bf3227f6b92edbd4/US_Business_70.svg",
								"details": {
									"size": 43444,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 70.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"thankYouImage": {
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
							"id": "6p6BcDBlAb7ZoCaZaypJIT",
							"type": "Asset",
							"createdAt": "2024-10-08T20:32:25.037Z",
							"updatedAt": "2024-10-25T00:53:09.706Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 9,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equalitty Level 7",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/6p6BcDBlAb7ZoCaZaypJIT/959a8c1e856fc5f9bf3227f6b92edbd4/US_Business_70.svg",
								"details": {
									"size": 43444,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 70.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"shareFact": "3 in 5 U.S. business owners were less stressed about finances after their Kiva loan.",
					"shareFactUrl": "https://www.kiva.org/impact/systemically-marginalized-communities",
					"dateTagline": "N/A",
					"shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels."
				}
			},
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
					"id": "5pPaBjhrIf2qmEScZZxHp",
					"type": "Entry",
					"createdAt": "2024-10-08T20:31:30.591Z",
					"updatedAt": "2024-11-04T21:58:13.012Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 20,
					"revision": 6,
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
					"key": "us-economic-equality-level-6",
					"challengeName": "U.S. Economic equality",
					"levelName": "✨50✨",
					"badgeImage": {
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
							"id": "4nUE568E3WCZ1rYpbH3G1z",
							"type": "Asset",
							"createdAt": "2024-10-08T20:31:17.425Z",
							"updatedAt": "2024-10-25T00:51:55.052Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 13,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 6",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/4nUE568E3WCZ1rYpbH3G1z/e2b568f72e76ef888b97e28fb2cd21b3/US_Business_60.svg",
								"details": {
									"size": 43294,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 60.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"thankYouImage": {
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
							"id": "4nUE568E3WCZ1rYpbH3G1z",
							"type": "Asset",
							"createdAt": "2024-10-08T20:31:17.425Z",
							"updatedAt": "2024-10-25T00:51:55.052Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 13,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 6",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/4nUE568E3WCZ1rYpbH3G1z/e2b568f72e76ef888b97e28fb2cd21b3/US_Business_60.svg",
								"details": {
									"size": 43294,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 60.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"shareFact": "U.S. business owners who received Kiva loans were nearly twice as likely to say they’re profitable.",
					"shareFactUrl": "https://www.kiva.org/impact/systemically-marginalized-communities",
					"dateTagline": "N/A",
					"shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels, compared to people surveyed who didn’t receive a loan"
				}
			},
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
					"id": "5S0r7mPll6B4dB7Y37H5QG",
					"type": "Entry",
					"createdAt": "2024-10-08T20:30:17.753Z",
					"updatedAt": "2024-11-04T21:57:42.581Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 14,
					"revision": 5,
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
					"key": "us-economic-equality-level-5",
					"challengeName": "U.S. Economic equality",
					"levelName": "5",
					"badgeImage": {
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
							"id": "2s7t7DyW1EBoF4S7HhO4eZ",
							"type": "Asset",
							"createdAt": "2024-10-08T20:30:00.156Z",
							"updatedAt": "2024-10-25T00:47:22.575Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 5",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/2s7t7DyW1EBoF4S7HhO4eZ/9d9c46c77f5dac5f4e979c23d213a875/US_Business_50.svg",
								"details": {
									"size": 43277,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 50.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"thankYouImage": {
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
							"id": "2s7t7DyW1EBoF4S7HhO4eZ",
							"type": "Asset",
							"createdAt": "2024-10-08T20:30:00.156Z",
							"updatedAt": "2024-10-25T00:47:22.575Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 5",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/2s7t7DyW1EBoF4S7HhO4eZ/9d9c46c77f5dac5f4e979c23d213a875/US_Business_50.svg",
								"details": {
									"size": 43277,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 50.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"shareFact": "70% of U.S. business owners surveyed were more confident in their business as a result of their loan.",
					"shareFactUrl": "https://www.kiva.org/impact/systemically-marginalized-communities",
					"dateTagline": "N/A",
					"shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels."
				}
			},
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
					"id": "2eJ8dYOxfkCXUYT8UhSKdW",
					"type": "Entry",
					"createdAt": "2024-10-08T20:28:25.438Z",
					"updatedAt": "2024-11-04T21:57:30.002Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 14,
					"revision": 5,
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
					"key": "us-economic-equality-level-4",
					"challengeName": "U.S. Economic equality",
					"levelName": "4",
					"badgeImage": {
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
							"id": "4f5MR6ggWdXx3AC7oxx596",
							"type": "Asset",
							"createdAt": "2024-10-08T20:28:08.418Z",
							"updatedAt": "2024-10-25T00:46:52.600Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 4",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/4f5MR6ggWdXx3AC7oxx596/96c431c599c42c56483f7d18f43fe0aa/US_Business_40.svg",
								"details": {
									"size": 44264,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 40.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"thankYouImage": {
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
							"id": "4f5MR6ggWdXx3AC7oxx596",
							"type": "Asset",
							"createdAt": "2024-10-08T20:28:08.418Z",
							"updatedAt": "2024-10-25T00:46:52.600Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 4",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/4f5MR6ggWdXx3AC7oxx596/96c431c599c42c56483f7d18f43fe0aa/US_Business_40.svg",
								"details": {
									"size": 44264,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 40.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"shareFact": "Without support from Kiva, 1 in 4 U.S. entrepreneurs surveyed would’ve had to close their business.",
					"shareFactUrl": "https://www.kiva.org/impact/systemically-marginalized-communities",
					"dateTagline": "N/A",
					"shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels."
				}
			},
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
					"id": "3yqBniSubwAXimMzi8mApN",
					"type": "Entry",
					"createdAt": "2024-10-08T20:26:55.820Z",
					"updatedAt": "2024-11-04T21:57:13.745Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 14,
					"revision": 5,
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
					"key": "us-economic-equality-level-3",
					"challengeName": "U.S. Economic equality",
					"levelName": "3",
					"badgeImage": {
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
							"id": "4q0Das9uTU0gfrwtld137n",
							"type": "Asset",
							"createdAt": "2024-10-08T20:26:40.755Z",
							"updatedAt": "2024-10-29T15:56:15.595Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 13,
							"revision": 4,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 3",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/4q0Das9uTU0gfrwtld137n/6cb471c2c85e39c7cc98d9795ea1e066/US_Business_30.svg",
								"details": {
									"size": 41400,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 30.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"thankYouImage": {
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
							"id": "4q0Das9uTU0gfrwtld137n",
							"type": "Asset",
							"createdAt": "2024-10-08T20:26:40.755Z",
							"updatedAt": "2024-10-29T15:56:15.595Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 13,
							"revision": 4,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 3",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/4q0Das9uTU0gfrwtld137n/6cb471c2c85e39c7cc98d9795ea1e066/US_Business_30.svg",
								"details": {
									"size": 41400,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 30.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"shareFact": "1 in 3 U.S. business owners were able to hire employees after working with Kiva.",
					"shareFactUrl": "https://www.kiva.org/impact/systemically-marginalized-communities",
					"dateTagline": "N/A",
					"shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels."
				}
			},
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
					"id": "5qVq3IF07C8um3AiQVjLK5",
					"type": "Entry",
					"createdAt": "2024-10-08T20:25:25.114Z",
					"updatedAt": "2024-11-04T21:56:57.150Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 21,
					"revision": 7,
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
					"challengeName": "U.S. Economic equality",
					"levelName": "2",
					"badgeImage": {
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
							"id": "62zEUpZbO7qWZPoV1z2pZU",
							"type": "Asset",
							"createdAt": "2024-10-08T20:25:01.320Z",
							"updatedAt": "2024-10-25T00:45:08.112Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 2",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/62zEUpZbO7qWZPoV1z2pZU/9664408940c996a953658c0d7508ecca/US_Business_20.svg",
								"details": {
									"size": 56655,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 20.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"thankYouImage": {
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
							"id": "62zEUpZbO7qWZPoV1z2pZU",
							"type": "Asset",
							"createdAt": "2024-10-08T20:25:01.320Z",
							"updatedAt": "2024-10-25T00:45:08.112Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 2",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/62zEUpZbO7qWZPoV1z2pZU/9664408940c996a953658c0d7508ecca/US_Business_20.svg",
								"details": {
									"size": 56655,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 20.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"shareFact": "3 in 5 U.S. business owners brought in more income after their Kiva loan.",
					"shareFactUrl": "https://www.kiva.org/impact/systemically-marginalized-communities",
					"dateTagline": "N/A",
					"shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels."
				}
			},
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
					"id": "1v6rjxNM5uJeQaNEGdn0vR",
					"type": "Entry",
					"createdAt": "2024-10-08T20:24:07.013Z",
					"updatedAt": "2024-11-04T21:56:33.126Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"publishedVersion": 17,
					"revision": 6,
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
					"key": "us-economic-equality-level-1",
					"challengeName": "U.S. economic equality",
					"levelName": "1",
					"badgeImage": {
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
							"id": "3C3ddaga4hEXBlb9WxsdlQ",
							"type": "Asset",
							"createdAt": "2024-10-08T20:23:21.487Z",
							"updatedAt": "2024-10-25T00:44:19.738Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 1",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/3C3ddaga4hEXBlb9WxsdlQ/0155bb0e9a32be6b00071afa4769b10c/US_Business_10.svg",
								"details": {
									"size": 40688,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 10.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"thankYouImage": {
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
							"id": "3C3ddaga4hEXBlb9WxsdlQ",
							"type": "Asset",
							"createdAt": "2024-10-08T20:23:21.487Z",
							"updatedAt": "2024-10-25T00:44:19.738Z",
							"environment": {
								"sys": {
									"id": "development",
									"type": "Link",
									"linkType": "Environment"
								}
							},
							"publishedVersion": 10,
							"revision": 3,
							"locale": "en-US"
						},
						"fields": {
							"title": "US Economic Equality Level 1",
							"description": "",
							"file": {
								"url": "//images.ctfassets.net/j0p9a6ql0rn7/3C3ddaga4hEXBlb9WxsdlQ/0155bb0e9a32be6b00071afa4769b10c/US_Business_10.svg",
								"details": {
									"size": 40688,
									"image": {
										"width": 313,
										"height": 313
									}
								},
								"fileName": "US Business 10.svg",
								"contentType": "image/svg+xml"
							}
						}
					},
					"shareFact": "75% of U.S. entrepreneurs surveyed said they didn’t have a good alternative to Kiva.",
					"shareFactUrl": "https://www.kiva.org/impact/systemically-marginalized-communities",
					"dateTagline": "N/A",
					"shareFactFootnote": "Kiva borrowers surveyed by 60 Decibels."
				}
			},
		]
	},
	"__typename": "Contentful"
};
