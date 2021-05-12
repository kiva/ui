/** Mock Data for various contentful objects
*/
export const appealBanner = {
	"bannerName": "Kiva15 Custom Appeal",
	"link": "/15",
	"richText": { "data": {}, "content": [{ "data": {}, "content": [{ "data": {}, "marks": [], "value": "Take the 15,000 loan challenge with us.", "nodeType": "text" }], "nodeType": "paragraph" }], "nodeType": "document" }, "startDate": "2020-09-23T00:00-07:00", "endDate": "2020-10-23T00:00-07:00", "active": true, "hiddenUrls": ["/"], "bannerType": "Custom Appeal", "dataObject": { "ctaButtonText": "Find a borrower", "shrinkButtonText": "Maybe later", "kiva15FundedLoansGoal": 15000 }, "additionalContent": [{ "sys": { "space": { "sys": { "type": "Link", "linkType": "Space", "id": "j0p9a6ql0rn7" } }, "id": "127JRxiMO69eaZksGnxwSM", "type": "Entry", "createdAt": "2020-09-13T23:21:17.897Z", "updatedAt": "2020-09-25T14:27:48.733Z", "environment": { "sys": { "id": "development", "type": "Link", "linkType": "Environment" } }, "revision": 2, "contentType": { "sys": { "type": "Link", "linkType": "ContentType", "id": "richTextContent" } }, "locale": "en-US" }, "fields": { "key": "kiva15AppealCopy", "name": "Kiva15 Custom Appeal Copy", "richText": { "nodeType": "document", "data": {}, "content": [{ "nodeType": "paragraph", "content": [{ "nodeType": "text", "value": "Join us in celebrating 15 years of impact by supporting 15,000 people around the world. ", "marks": [], "data": {} }], "data": {} }] } } }]
};

export const homepagePromos = {
	"heroPromo": {
		"sys": {
			"type": "Array"
		},
		"total": 1,
		"skip": 0,
		"limit": 100,
		"items": [
			{
				"sys": {
					"space": {
						"sys": {
							"type": "Link",
							"linkType": "Space",
							"id": "j0p9a6ql0rn7"
						}
					},
					"id": "6VjEaIlC0QYwUUQ6qsBuM6",
					"type": "Entry",
					"createdAt": "2019-11-20T22:41:56.452Z",
					"updatedAt": "2020-10-27T22:31:10.540Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"revision": 42,
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
					"key": "ui-homepage-promo",
					"active": false,
					"startDate": "2020-01-01T12:00-08:00",
					"endDate": "2020-12-04T00:00-08:00",
					"content": [
						{
							"sys": {
								"space": {
									"sys": {
										"type": "Link",
										"linkType": "Space",
										"id": "j0p9a6ql0rn7"
									}
								},
								"id": "3ayBtQyskSiLQAHZ6SckEV",
								"type": "Entry",
								"createdAt": "2020-05-02T20:38:51.236Z",
								"updatedAt": "2020-10-27T22:29:17.111Z",
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
										"id": "genericContentBlock"
									}
								},
								"locale": "en-US"
							},
							"fields": {
								"key": "covidFundPromoHomepage",
								"name": "COVID fund Promo Homepage",
								"primaryCtaLink": "/covid19response",
								"primaryCtaKvTrackEvent": [
									"home",
									"click-hero-cta"
								]
							}
						},
						{
							"sys": {
								"space": {
									"sys": {
										"type": "Link",
										"linkType": "Space",
										"id": "j0p9a6ql0rn7"
									}
								},
								"id": "6tEk2JGnG1Tc9i72s91VvB",
								"type": "Entry",
								"createdAt": "2020-05-02T20:37:06.999Z",
								"updatedAt": "2020-05-02T20:37:06.999Z",
								"environment": {
									"sys": {
										"id": "development",
										"type": "Link",
										"linkType": "Environment"
									}
								},
								"revision": 1,
								"contentType": {
									"sys": {
										"type": "Link",
										"linkType": "ContentType",
										"id": "responsiveImageSet"
									}
								},
								"locale": "en-US"
							},
							"fields": {
								"name": "COVID fund Homepage Promo Images",
								"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
								"images": [
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "2F0fMUNds6qhAj6CyQ0kn4",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.719Z",
											"updatedAt": "2020-05-02T20:33:48.261Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 5,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg lg std",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/Final_Homepage_lg_std.jpg",
												"details": {
													"size": 87066,
													"image": {
														"width": 1025,
														"height": 545
													}
												},
												"fileName": "Final_Homepage_lg_std.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "4CZue28n9f0crCW7KdtmC3",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.713Z",
											"updatedAt": "2020-05-02T20:34:00.567Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 3,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg med std",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/4CZue28n9f0crCW7KdtmC3/62e687fdb3089ae04710b88db25b6da9/hp-mg_med_std.jpg",
												"details": {
													"size": 73397,
													"image": {
														"width": 680,
														"height": 675
													}
												},
												"fileName": "hp-mg_med_std.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "7xdmdw4GgKlUDRUSmvO5Iu",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.714Z",
											"updatedAt": "2020-05-02T20:34:14.879Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 6,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg med retina",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/7xdmdw4GgKlUDRUSmvO5Iu/4ed7de5a67d27e2fbddb7f778dcb1317/hp-mg_med_retina.jpg",
												"details": {
													"size": 122452,
													"image": {
														"width": 1360,
														"height": 1350
													}
												},
												"fileName": "hp-mg_med_retina.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "5H7wikO7DzKOEqnBBqric1",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.711Z",
											"updatedAt": "2020-05-02T20:34:33.488Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 4,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg lg retina",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/5H7wikO7DzKOEqnBBqric1/5ae2476c691165a4c400780b0857cb48/Final_Homepage_lg_retina.jpg",
												"details": {
													"size": 167314,
													"image": {
														"width": 2048,
														"height": 1090
													}
												},
												"fileName": "Final_Homepage_lg_retina.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "5YzqkUttXksSAgaHuw9Cuv",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.923Z",
											"updatedAt": "2020-05-02T20:35:07.954Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 3,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg xl retina",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/5YzqkUttXksSAgaHuw9Cuv/23b7a0460c3616bf4f9e349631a5ab0a/hp-mg_xl_retina.jpg",
												"details": {
													"size": 270653,
													"image": {
														"width": 2880,
														"height": 1535
													}
												},
												"fileName": "hp-mg_xl_retina.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "6zlivQBwWaw0XtJeYn8diS",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.711Z",
											"updatedAt": "2020-05-02T20:35:22.641Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 3,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg xxl std",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/6zlivQBwWaw0XtJeYn8diS/c880e3eb4d5884ddc587742e6c010827/hp-mg_xxl_std.jpg",
												"details": {
													"size": 148815,
													"image": {
														"width": 1921,
														"height": 821
													}
												},
												"fileName": "hp-mg_xxl_std.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "1afYQ0d3JJDNbpet9oIr6J",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.713Z",
											"updatedAt": "2020-05-02T20:35:53.316Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 4,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg xxl retina",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/1afYQ0d3JJDNbpet9oIr6J/2c21bba64857e54a1a936aa3d4783cbf/hp-mg_xxl_retina.jpg",
												"details": {
													"size": 271004,
													"image": {
														"width": 3840,
														"height": 1640
													}
												},
												"fileName": "hp-mg_xxl_retina.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "5tuiyeQcopJaHcUy3rDaTN",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.927Z",
											"updatedAt": "2020-05-02T20:36:10.583Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 3,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg xl std",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/5tuiyeQcopJaHcUy3rDaTN/450b1136acedd6f218a2424ec4cfc5f9/hp-mp_xl_std.jpg",
												"details": {
													"size": 137038,
													"image": {
														"width": 1441,
														"height": 768
													}
												},
												"fileName": "hp-mp_xl_std.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "7alHPYp7xv7BUT5WLEieTz",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.953Z",
											"updatedAt": "2020-05-02T20:36:24.266Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 3,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg sm std",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/7alHPYp7xv7BUT5WLEieTz/e905db49ecfaa6ea102fe94f33c2555c/hp-mg_sm_std.jpg",
												"details": {
													"size": 50791,
													"image": {
														"width": 480,
														"height": 600
													}
												},
												"fileName": "hp-mg_sm_std.jpg",
												"contentType": "image/jpeg"
											}
										}
									},
									{
										"sys": {
											"space": {
												"sys": {
													"type": "Link",
													"linkType": "Space",
													"id": "j0p9a6ql0rn7"
												}
											},
											"id": "1ykOTxkXIdoDTe8gZ6lRZ2",
											"type": "Asset",
											"createdAt": "2020-01-08T21:22:27.920Z",
											"updatedAt": "2020-05-02T20:36:52.521Z",
											"environment": {
												"sys": {
													"id": "development",
													"type": "Link",
													"linkType": "Environment"
												}
											},
											"revision": 3,
											"locale": "en-US"
										},
										"fields": {
											"title": "hp-mg sm retina",
											"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
											"file": {
												"url": "//images.ctfassets.net/j0p9a6ql0rn7/1ykOTxkXIdoDTe8gZ6lRZ2/78faa1f3944065eb6780d20c32235c79/hp-mg_sm_retina.jpg",
												"details": {
													"size": 96212,
													"image": {
														"width": 960,
														"height": 1200
													}
												},
												"fileName": "hp-mg_sm_retina.jpg",
												"contentType": "image/jpeg"
											}
										}
									}
								]
							}
						}
					]
				}
			}
		],
		"includes": {
			"Entry": [
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "3ayBtQyskSiLQAHZ6SckEV",
						"type": "Entry",
						"createdAt": "2020-05-02T20:38:51.236Z",
						"updatedAt": "2020-10-27T22:29:17.111Z",
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
								"id": "genericContentBlock"
							}
						},
						"locale": "en-US"
					},
					"fields": {
						"key": "covidFundPromoHomepage",
						"name": "COVID fund Promo Homepage",
						"primaryCtaLink": "/covid19response",
						"primaryCtaKvTrackEvent": [
							"home",
							"click-hero-cta"
						]
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "6tEk2JGnG1Tc9i72s91VvB",
						"type": "Entry",
						"createdAt": "2020-05-02T20:37:06.999Z",
						"updatedAt": "2020-05-02T20:37:06.999Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 1,
						"contentType": {
							"sys": {
								"type": "Link",
								"linkType": "ContentType",
								"id": "responsiveImageSet"
							}
						},
						"locale": "en-US"
					},
					"fields": {
						"name": "COVID fund Homepage Promo Images",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"images": [
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "2F0fMUNds6qhAj6CyQ0kn4",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.719Z",
									"updatedAt": "2020-05-02T20:33:48.261Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 5,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg lg std",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/Final_Homepage_lg_std.jpg",
										"details": {
											"size": 87066,
											"image": {
												"width": 1025,
												"height": 545
											}
										},
										"fileName": "Final_Homepage_lg_std.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "4CZue28n9f0crCW7KdtmC3",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.713Z",
									"updatedAt": "2020-05-02T20:34:00.567Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 3,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg med std",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/4CZue28n9f0crCW7KdtmC3/62e687fdb3089ae04710b88db25b6da9/hp-mg_med_std.jpg",
										"details": {
											"size": 73397,
											"image": {
												"width": 680,
												"height": 675
											}
										},
										"fileName": "hp-mg_med_std.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "7xdmdw4GgKlUDRUSmvO5Iu",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.714Z",
									"updatedAt": "2020-05-02T20:34:14.879Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 6,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg med retina",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/7xdmdw4GgKlUDRUSmvO5Iu/4ed7de5a67d27e2fbddb7f778dcb1317/hp-mg_med_retina.jpg",
										"details": {
											"size": 122452,
											"image": {
												"width": 1360,
												"height": 1350
											}
										},
										"fileName": "hp-mg_med_retina.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "5H7wikO7DzKOEqnBBqric1",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.711Z",
									"updatedAt": "2020-05-02T20:34:33.488Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 4,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg lg retina",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/5H7wikO7DzKOEqnBBqric1/5ae2476c691165a4c400780b0857cb48/Final_Homepage_lg_retina.jpg",
										"details": {
											"size": 167314,
											"image": {
												"width": 2048,
												"height": 1090
											}
										},
										"fileName": "Final_Homepage_lg_retina.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "5YzqkUttXksSAgaHuw9Cuv",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.923Z",
									"updatedAt": "2020-05-02T20:35:07.954Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 3,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg xl retina",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/5YzqkUttXksSAgaHuw9Cuv/23b7a0460c3616bf4f9e349631a5ab0a/hp-mg_xl_retina.jpg",
										"details": {
											"size": 270653,
											"image": {
												"width": 2880,
												"height": 1535
											}
										},
										"fileName": "hp-mg_xl_retina.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "6zlivQBwWaw0XtJeYn8diS",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.711Z",
									"updatedAt": "2020-05-02T20:35:22.641Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 3,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg xxl std",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/6zlivQBwWaw0XtJeYn8diS/c880e3eb4d5884ddc587742e6c010827/hp-mg_xxl_std.jpg",
										"details": {
											"size": 148815,
											"image": {
												"width": 1921,
												"height": 821
											}
										},
										"fileName": "hp-mg_xxl_std.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "1afYQ0d3JJDNbpet9oIr6J",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.713Z",
									"updatedAt": "2020-05-02T20:35:53.316Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 4,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg xxl retina",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/1afYQ0d3JJDNbpet9oIr6J/2c21bba64857e54a1a936aa3d4783cbf/hp-mg_xxl_retina.jpg",
										"details": {
											"size": 271004,
											"image": {
												"width": 3840,
												"height": 1640
											}
										},
										"fileName": "hp-mg_xxl_retina.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "5tuiyeQcopJaHcUy3rDaTN",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.927Z",
									"updatedAt": "2020-05-02T20:36:10.583Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 3,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg xl std",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/5tuiyeQcopJaHcUy3rDaTN/450b1136acedd6f218a2424ec4cfc5f9/hp-mp_xl_std.jpg",
										"details": {
											"size": 137038,
											"image": {
												"width": 1441,
												"height": 768
											}
										},
										"fileName": "hp-mp_xl_std.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "7alHPYp7xv7BUT5WLEieTz",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.953Z",
									"updatedAt": "2020-05-02T20:36:24.266Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 3,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg sm std",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/7alHPYp7xv7BUT5WLEieTz/e905db49ecfaa6ea102fe94f33c2555c/hp-mg_sm_std.jpg",
										"details": {
											"size": 50791,
											"image": {
												"width": 480,
												"height": 600
											}
										},
										"fileName": "hp-mg_sm_std.jpg",
										"contentType": "image/jpeg"
									}
								}
							},
							{
								"sys": {
									"space": {
										"sys": {
											"type": "Link",
											"linkType": "Space",
											"id": "j0p9a6ql0rn7"
										}
									},
									"id": "1ykOTxkXIdoDTe8gZ6lRZ2",
									"type": "Asset",
									"createdAt": "2020-01-08T21:22:27.920Z",
									"updatedAt": "2020-05-02T20:36:52.521Z",
									"environment": {
										"sys": {
											"id": "development",
											"type": "Link",
											"linkType": "Environment"
										}
									},
									"revision": 3,
									"locale": "en-US"
								},
								"fields": {
									"title": "hp-mg sm retina",
									"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
									"file": {
										"url": "//images.ctfassets.net/j0p9a6ql0rn7/1ykOTxkXIdoDTe8gZ6lRZ2/78faa1f3944065eb6780d20c32235c79/hp-mg_sm_retina.jpg",
										"details": {
											"size": 96212,
											"image": {
												"width": 960,
												"height": 1200
											}
										},
										"fileName": "hp-mg_sm_retina.jpg",
										"contentType": "image/jpeg"
									}
								}
							}
						]
					}
				}
			],
			"Asset": [
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "1afYQ0d3JJDNbpet9oIr6J",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.713Z",
						"updatedAt": "2020-05-02T20:35:53.316Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 4,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg xxl retina",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/1afYQ0d3JJDNbpet9oIr6J/2c21bba64857e54a1a936aa3d4783cbf/hp-mg_xxl_retina.jpg",
							"details": {
								"size": 271004,
								"image": {
									"width": 3840,
									"height": 1640
								}
							},
							"fileName": "hp-mg_xxl_retina.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "1ykOTxkXIdoDTe8gZ6lRZ2",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.920Z",
						"updatedAt": "2020-05-02T20:36:52.521Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 3,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg sm retina",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/1ykOTxkXIdoDTe8gZ6lRZ2/78faa1f3944065eb6780d20c32235c79/hp-mg_sm_retina.jpg",
							"details": {
								"size": 96212,
								"image": {
									"width": 960,
									"height": 1200
								}
							},
							"fileName": "hp-mg_sm_retina.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "2F0fMUNds6qhAj6CyQ0kn4",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.719Z",
						"updatedAt": "2020-05-02T20:33:48.261Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 5,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg lg std",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/Final_Homepage_lg_std.jpg",
							"details": {
								"size": 87066,
								"image": {
									"width": 1025,
									"height": 545
								}
							},
							"fileName": "Final_Homepage_lg_std.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "4CZue28n9f0crCW7KdtmC3",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.713Z",
						"updatedAt": "2020-05-02T20:34:00.567Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 3,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg med std",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/4CZue28n9f0crCW7KdtmC3/62e687fdb3089ae04710b88db25b6da9/hp-mg_med_std.jpg",
							"details": {
								"size": 73397,
								"image": {
									"width": 680,
									"height": 675
								}
							},
							"fileName": "hp-mg_med_std.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "5H7wikO7DzKOEqnBBqric1",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.711Z",
						"updatedAt": "2020-05-02T20:34:33.488Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 4,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg lg retina",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/5H7wikO7DzKOEqnBBqric1/5ae2476c691165a4c400780b0857cb48/Final_Homepage_lg_retina.jpg",
							"details": {
								"size": 167314,
								"image": {
									"width": 2048,
									"height": 1090
								}
							},
							"fileName": "Final_Homepage_lg_retina.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "5YzqkUttXksSAgaHuw9Cuv",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.923Z",
						"updatedAt": "2020-05-02T20:35:07.954Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 3,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg xl retina",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/5YzqkUttXksSAgaHuw9Cuv/23b7a0460c3616bf4f9e349631a5ab0a/hp-mg_xl_retina.jpg",
							"details": {
								"size": 270653,
								"image": {
									"width": 2880,
									"height": 1535
								}
							},
							"fileName": "hp-mg_xl_retina.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "5tuiyeQcopJaHcUy3rDaTN",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.927Z",
						"updatedAt": "2020-05-02T20:36:10.583Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 3,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg xl std",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/5tuiyeQcopJaHcUy3rDaTN/450b1136acedd6f218a2424ec4cfc5f9/hp-mp_xl_std.jpg",
							"details": {
								"size": 137038,
								"image": {
									"width": 1441,
									"height": 768
								}
							},
							"fileName": "hp-mp_xl_std.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "6zlivQBwWaw0XtJeYn8diS",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.711Z",
						"updatedAt": "2020-05-02T20:35:22.641Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 3,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg xxl std",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/6zlivQBwWaw0XtJeYn8diS/c880e3eb4d5884ddc587742e6c010827/hp-mg_xxl_std.jpg",
							"details": {
								"size": 148815,
								"image": {
									"width": 1921,
									"height": 821
								}
							},
							"fileName": "hp-mg_xxl_std.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "7alHPYp7xv7BUT5WLEieTz",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.953Z",
						"updatedAt": "2020-05-02T20:36:24.266Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 3,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg sm std",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/7alHPYp7xv7BUT5WLEieTz/e905db49ecfaa6ea102fe94f33c2555c/hp-mg_sm_std.jpg",
							"details": {
								"size": 50791,
								"image": {
									"width": 480,
									"height": 600
								}
							},
							"fileName": "hp-mg_sm_std.jpg",
							"contentType": "image/jpeg"
						}
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "7xdmdw4GgKlUDRUSmvO5Iu",
						"type": "Asset",
						"createdAt": "2020-01-08T21:22:27.714Z",
						"updatedAt": "2020-05-02T20:34:14.879Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 6,
						"locale": "en-US"
					},
					"fields": {
						"title": "hp-mg med retina",
						"description": "Lend a hand from afar and join the global COVID-19 response. Take action",
						"file": {
							"url": "//images.ctfassets.net/j0p9a6ql0rn7/7xdmdw4GgKlUDRUSmvO5Iu/4ed7de5a67d27e2fbddb7f778dcb1317/hp-mg_med_retina.jpg",
							"details": {
								"size": 122452,
								"image": {
									"width": 1360,
									"height": 1350
								}
							},
							"fileName": "hp-mg_med_retina.jpg",
							"contentType": "image/jpeg"
						}
					}
				}
			]
		}
	},
	"kivaCardPromo": {
		"sys": {
			"type": "Array"
		},
		"total": 1,
		"skip": 0,
		"limit": 100,
		"items": [
			{
				"sys": {
					"space": {
						"sys": {
							"type": "Link",
							"linkType": "Space",
							"id": "j0p9a6ql0rn7"
						}
					},
					"id": "1lBB1uCt3E4S3cBWGVTSbx",
					"type": "Entry",
					"createdAt": "2020-11-10T22:47:25.202Z",
					"updatedAt": "2020-11-11T00:41:47.189Z",
					"environment": {
						"sys": {
							"id": "development",
							"type": "Link",
							"linkType": "Environment"
						}
					},
					"revision": 8,
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
					"key": "ui-homepage-kiva-card-promo",
					"active": true,
					"startDate": "2020-10-13T00:00-08:00",
					"endDate": "2020-12-26T00:00-08:00",
					"content": [
						{
							"sys": {
								"space": {
									"sys": {
										"type": "Link",
										"linkType": "Space",
										"id": "j0p9a6ql0rn7"
									}
								},
								"id": "3CapD9VOqn6SUEzSN4lsXJ",
								"type": "Entry",
								"createdAt": "2020-11-06T01:17:51.100Z",
								"updatedAt": "2020-11-11T00:36:42.326Z",
								"environment": {
									"sys": {
										"id": "development",
										"type": "Link",
										"linkType": "Environment"
									}
								},
								"revision": 8,
								"contentType": {
									"sys": {
										"type": "Link",
										"linkType": "ContentType",
										"id": "genericContentBlock"
									}
								},
								"locale": "en-US"
							},
							"fields": {
								"key": "homepage-kiva-card-promo-part-1",
								"name": "Homepage Kiva Card Promo Part 1",
								"bodyCopy": {
									"data": {},
									"content": [
										{
											"data": {},
											"content": [
												{
													"data": {},
													"marks": [],
													"value": "Make your gifts count this year—share the lending love. Introduce us to your friends and family through Kiva Cards.",
													"nodeType": "text"
												}
											],
											"nodeType": "paragraph"
										},
										{
											"data": {},
											"content": [
												{
													"data": {},
													"marks": [],
													"value": "Plus, when you buy two or more Kiva Cards this week, you’ll get a free $25 lending credit. ",
													"nodeType": "text"
												}
											],
											"nodeType": "paragraph"
										},
										{
											"data": {},
											"content": [
												{
													"data": {},
													"marks": [],
													"value": "What are you waiting for? Get a head start on gift giving now!",
													"nodeType": "text"
												}
											],
											"nodeType": "paragraph"
										}
									],
									"nodeType": "document"
								},
								"headline": "Share the love️ with Kiva Cards",
								"primaryCtaLink": "/gifts/kiva-cards",
								"primaryCtaText": "Share the love"
							}
						},
						{
							"sys": {
								"space": {
									"sys": {
										"type": "Link",
										"linkType": "Space",
										"id": "j0p9a6ql0rn7"
									}
								},
								"id": "6iBW6SSUNLzdmE2Owbohmn",
								"type": "Entry",
								"createdAt": "2020-11-10T00:18:59.891Z",
								"updatedAt": "2020-11-11T00:36:53.517Z",
								"environment": {
									"sys": {
										"id": "development",
										"type": "Link",
										"linkType": "Environment"
									}
								},
								"revision": 3,
								"contentType": {
									"sys": {
										"type": "Link",
										"linkType": "ContentType",
										"id": "genericContentBlock"
									}
								},
								"locale": "en-US"
							},
							"fields": {
								"key": "homepage-kiva-card-promo-part-2",
								"name": "Homepage Kiva Card Promo Part 2",
								"bodyCopy": {
									"data": {},
									"content": [
										{
											"data": {},
											"content": [
												{
													"data": {},
													"marks": [],
													"value": "Do away with the endless gadgets and gizmos for the holidays this year. Help people around the world during the season of giving by gifting Kiva Cards to your friends and family.",
													"nodeType": "text"
												}
											],
											"nodeType": "paragraph"
										}
									],
									"nodeType": "document"
								},
								"headline": "Share the love️ with Kiva Cards",
								"primaryCtaLink": "/gifts/kiva-cards",
								"primaryCtaText": "Share the love"
							}
						}
					],
					"dataObject": {
						"part2ActivationDate": "2020-12-01T00:00:00"
					}
				}
			}
		],
		"includes": {
			"Entry": [
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "3CapD9VOqn6SUEzSN4lsXJ",
						"type": "Entry",
						"createdAt": "2020-11-06T01:17:51.100Z",
						"updatedAt": "2020-11-11T00:36:42.326Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 8,
						"contentType": {
							"sys": {
								"type": "Link",
								"linkType": "ContentType",
								"id": "genericContentBlock"
							}
						},
						"locale": "en-US"
					},
					"fields": {
						"key": "homepage-kiva-card-promo-part-1",
						"name": "Homepage Kiva Card Promo Part 1",
						"bodyCopy": {
							"data": {},
							"content": [
								{
									"data": {},
									"content": [
										{
											"data": {},
											"marks": [],
											"value": "Make your gifts count this year—share the lending love. Introduce us to your friends and family through Kiva Cards.",
											"nodeType": "text"
										}
									],
									"nodeType": "paragraph"
								},
								{
									"data": {},
									"content": [
										{
											"data": {},
											"marks": [],
											"value": "Plus, when you buy two or more Kiva Cards this week, you’ll get a free $25 lending credit. ",
											"nodeType": "text"
										}
									],
									"nodeType": "paragraph"
								},
								{
									"data": {},
									"content": [
										{
											"data": {},
											"marks": [],
											"value": "What are you waiting for? Get a head start on gift giving now!",
											"nodeType": "text"
										}
									],
									"nodeType": "paragraph"
								}
							],
							"nodeType": "document"
						},
						"headline": "Share the love️ with Kiva Cards",
						"primaryCtaLink": "/gifts/kiva-cards",
						"primaryCtaText": "Share the love"
					}
				},
				{
					"sys": {
						"space": {
							"sys": {
								"type": "Link",
								"linkType": "Space",
								"id": "j0p9a6ql0rn7"
							}
						},
						"id": "6iBW6SSUNLzdmE2Owbohmn",
						"type": "Entry",
						"createdAt": "2020-11-10T00:18:59.891Z",
						"updatedAt": "2020-11-11T00:36:53.517Z",
						"environment": {
							"sys": {
								"id": "development",
								"type": "Link",
								"linkType": "Environment"
							}
						},
						"revision": 3,
						"contentType": {
							"sys": {
								"type": "Link",
								"linkType": "ContentType",
								"id": "genericContentBlock"
							}
						},
						"locale": "en-US"
					},
					"fields": {
						"key": "homepage-kiva-card-promo-part-2",
						"name": "Homepage Kiva Card Promo Part 2",
						"bodyCopy": {
							"data": {},
							"content": [
								{
									"data": {},
									"content": [
										{
											"data": {},
											"marks": [],
											"value": "Do away with the endless gadgets and gizmos for the holidays this year. Help people around the world during the season of giving by gifting Kiva Cards to your friends and family.",
											"nodeType": "text"
										}
									],
									"nodeType": "paragraph"
								}
							],
							"nodeType": "document"
						},
						"headline": "Share the love️ with Kiva Cards",
						"primaryCtaLink": "/gifts/kiva-cards",
						"primaryCtaText": "Share the love"
					}
				}
			]
		}
	}
}

export const contentfulGenericContentBlock = (key) => {
	return {
		"key": key,
		"name": `Test GenericContentBlock ${key}`,
		"bodyCopy": { "data": {}, "content": [{ "data": {}, "content": [{ "data": {}, "marks": [], "value": "Kiva makes it simple to support causes you care about - every month, automatically.", "nodeType": "text" }], "nodeType": "paragraph" }], "nodeType": "document" },
		"headline": "Choose a cause, <br/><em>change a life</em>",
		"subHeadline": undefined,
		"primaryCtaLink": undefined,
		"primaryCtaKvTrackEvent": undefined,
		"primaryCtaText": "Select your cause",
	}

}

export const contentfulBackground = (type) => {
	let backgroundVideo = {
		"title": "Test Video 2",
		"file": {
			"url": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/28831/Typer.mp4",
			"details": { "size": 1175461 },
			"fileName": "Typer.mp4",
			"contentType": "video/mp4"
		}
	}
	let backgroundImage = {
		"title": "Test Image",
		"file": {
			"url": "https://images.ctfassets.net/j0p9a6ql0rn7/7mY5ZujL9UfbluRkVkHgkX/b30c629747deda979a57b9ae027469f3/mg-hppromo-1-wxga-retina.jpg",
			"details": { "size": 1175461 },
			"fileName": "mg-hppromo-1-wxga-retina.jpg",
			"contentType": "image/jpg"
		}
	}
	return {
		"key": "test-background",
		"name": "Test Background",
		"backgroundColor": "#518230",
		"backgroundMedia": {
			...(type==='image' && backgroundImage),
			...(type==='video' && backgroundVideo),
			...(type==='color' && undefined)
		}
	}

}

export const contentfulMediaImg = () => {
	let randomColor = Math.floor(Math.random()*16777215).toString(16);
	return {
		"title": "Test Image",
		"description": "Image Description",
		"file": {
			"url": `https://via.placeholder.com/401x457/${randomColor}/000000`,
			"details": { "size": 232910, "image": { "width": 401, "height": 457 } },
			"fileName": "placeholder.png", "contentType": "image/png"
		}
	}
}

export const contentfulMediaVideo = {
	"title": "Test Video",
	"description": "Video Description",
	"file": {
		"url": "https://temp.media/video/?height=600&width=337&length=10",
		"details": { "size": 232910, "image": { "width": 337, "height": 600 } },
		"fileName": "placeholder.png", "contentType": "video/mp4"
	}
}
