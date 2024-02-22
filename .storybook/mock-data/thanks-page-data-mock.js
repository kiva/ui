export const maleLoanData = {
	"data": {
		"shop": {
			"id": "1",
			"receipt": {
				"id": "123",
				"transactionTime": "2024-02-05T18:30:29Z",
				"credits": {
					"values": [
						{
							"id": 123,
							"creditType": "kiva_credit",
							"amount": null
						}
					]
				},
				"totals": {
					"bonusAppliedTotal": "0.00",
					"itemTotal": "30.00",
					"donationTotal": "5.00",
					"kivaCardTotal": "0.00",
					"depositTotals": {
						"depositTotal": "30.00",
						"kivaCreditAdded": "0.00",
						"kivaCreditUsed": "0.00"
					},
					"freeTrialAppliedTotal": "0.00",
					"kivaCreditAppliedTotal": "30.00",
					"redemptionCodeAppliedTotal": "0.00",
					"universalCodeAppliedTotal": "0.00"
				},
				"hasFreeCredits": false,
				"items": {
					"totalCount": 2,
					"values": [
						{
							"id": 123,
							"price": "25.00",
							"basketItemType": "loan_reservation",
							"loan": {
								"name": "Bob",
								"id": 123,
								"image": {
									"id": 123,
									"url": "https://www-0.development.kiva.org/img/s100/cd9161b3e5d58f77cf650ad9d7a37413.jpg",
									"default": "https://res.cloudinary.com/kiva/w_480,h_300,c_fill,g_faces/a_ignore,fl_progressive,q_auto:best,f_auto/remote/cd9161b3e5d58f77cf650ad9d7a37413.jpg",
									"hash": "cd9161b3e5d58f77cf650ad9d7a37413"
								},
								"use": "to acquire high-quality seeds, fertilizer, and agricultural chemicals  that will aid in increasing his crop yields.",
								"plannedExpirationDate": "2024-02-26T20:50:17Z",
								"geocode": {
									"city": "Litein",
									"country": {
										"name": "Kenya"
									}
								},
								"loanAmount": "325.00",
								"loanFundraisingInfo": {
									"fundedAmount": "175.00",
									"reservedAmount": "0.00"
								},
								"distributionModel": "fieldPartner",
								"inPfp": false,
								"gender": "male"
							},
							"team": {
								"id": 123,
								"teamPublicId": "team_canada",
								"name": "Team CANADA"
							}
						},
						{
							"id": 123,
							"price": "5.00",
							"basketItemType": "donation"
						}
					]
				}
			}
		},
		"my": {
			"id": "123",
			"autoDeposit": null,
			"teams": {
				"values": [
					{
						"id": 123,
						"team": {
							"id": 123,
							"teamPublicId": "team_canada",
							"name": "Team CANADA"
						}
					},
				]
			},
			"lender": {
				"id": 123,
				"name": "John"
			},
			"userAccount": {
				"id": 123,
				"firstName": "John",
				"lastName": "Smith",
				"email": "john@kiva.org",
				"inviterName": "john123",
				"public": true
			},
			"loans": {
				"totalCount": 1
			}
		},
	}
}

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 20);

export const femaleLoanData = {
	"data": {
		"shop": {
			"id": "1",
			"receipt": {
				"id": "123",
				"transactionTime": "2024-02-05T18:30:29Z",
				"credits": {
					"values": [
						{
							"id": 123,
							"creditType": "kiva_credit",
							"amount": null
						}
					]
				},
				"totals": {
					"bonusAppliedTotal": "0.00",
					"itemTotal": "30.00",
					"donationTotal": "5.00",
					"kivaCardTotal": "0.00",
					"depositTotals": {
						"depositTotal": "30.00",
						"kivaCreditAdded": "0.00",
						"kivaCreditUsed": "0.00"
					},
					"freeTrialAppliedTotal": "0.00",
					"kivaCreditAppliedTotal": "30.00",
					"redemptionCodeAppliedTotal": "0.00",
					"universalCodeAppliedTotal": "0.00"
				},
				"hasFreeCredits": false,
				"items": {
					"totalCount": 2,
					"values": [
						{
							"id": 123,
							"price": "25.00",
							"basketItemType": "loan_reservation",
							"loan": {
								"name": "Jane",
								"id": 123,
								"image": {
									"id": 123,
									"url": "https://www-0.development.kiva.org/img/s100/9839704fb7123e37d4eb398c499cef31.jpg",
									"default": "https://res.cloudinary.com/kiva/w_480,h_300,c_fill,g_faces/a_ignore,fl_progressive,q_auto:best,f_auto/remote/9839704fb7123e37d4eb398c499cef31.jpg",
									"hash": "9839704fb7123e37d4eb398c499cef31"
								},
								"use": "to invest in raw materials to ensure she can do weaving work consistently and increase her income potential.",
								"plannedExpirationDate": "2024-03-20T21:22:52Z",
								"geocode": {
									"city": "Rongkwang",
									"country": {
										"name": "Thailand"
									}
								},
								"loanAmount": "1725.00",
								"loanFundraisingInfo": {
									"fundedAmount": "275.00",
									"reservedAmount": "0.00"
								},
								"distributionModel": "fieldPartner",
								"inPfp": false,
								"gender": "female"
							},
							"team": {
								"id": 123,
								"teamPublicId": "team_canada",
								"name": "Team CANADA"
							}
						},
						{
							"id": 123,
							"price": "5.00",
							"basketItemType": "donation"
						}
					]
				}
			}
		},
		"my": {
			"id": "123",
			"autoDeposit": null,
			"teams": {
				"values": [
					{
						"id": 123,
						"team": {
							"id": 123,
							"teamPublicId": "team_canada",
							"name": "Team CANADA"
						}
					},
				]
			},
			"lender": {
				"id": 123,
				"name": "John",
				"image": {
					"id": 123,
					"url": "https://www-kiva-org-0.freetls.fastly.net/img/s100/4da4a17c4b35913d22114bf29bb1911b.jpg",
				},
				"publicId": "mary19806605",
			},
			"userAccount": {
				"id": 123,
				"firstName": "John",
				"lastName": "Smith",
				"email": "john@kiva.org",
				"inviterName": "john123",
				"public": true
			},
			"loans": {
				"totalCount": 1
			}
		},
		"general": {
			"kivaStats": {
				"campaignStats": {
					"currentBorrowerCount": 2298,
					"targetBorrowerCount": 6000,
					"targetEndDate": futureDate.toISOString(),
				}
			}
		}
	}
};

export const femaleLoanDataWithInviter = {
	"data": {
		...femaleLoanData.data,
		"community": {
			"lender": {
				"id": 123,
				"name": "Mary",
				"image": {
					"id": 123,
					"url": "https://www-kiva-org-0.freetls.fastly.net/img/s100/4da4a17c4b35913d22114bf29bb1911b.jpg",
					"width": 3264,
					"height": 2448
				},
				"publicId": "mary19806605"
			}
		}
	}
}

export const iwdExperiment = {
	id: 'Experiment:iwd_2024',
	version: 'b'
};

