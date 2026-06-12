const e=`fragment loanCardFields on LoanBasic {
	id
	distributionModel
	status
	name
	borrowerCount
	geocode {
		# city added for DetailedLoanCard Query Cache
		city
		# state is used for US loans on LoanChannelCategoryPage
		state
		country {
			id
			isoCode
			name
			region
		}
	}
	use
	activity {
		id
		name
	}
	sector {
		id
		name
	}
	tags
	whySpecial
	lenderRepaymentTerm
	loanAmount
	minNoteSize
	loanFundraisingInfo {
		id
		fundedAmount
		reservedAmount
		isExpiringSoon
	}
	plannedExpirationDate
	matchingText
	matchRatio
	isMatchable
	simultaneousMatching {
		managedAccountId
		displayName
		ratio
	}
	userProperties {
		favorited
		lentTo
	}

	image {
		id
		hash
	}

	# for fullLoanUse, along with use, borrowerCount, status, name, loanAmount
	anonymizationLevel
	fullLoanUse @client

	# lenders added for DetailedLoanCard Query Cache
	lenders(limit: 0) {
		totalCount
	}
	... on LoanPartner {
		partnerName
		themes
	}
	...on LoanDirect {
		trusteeName
	}
}
`,i={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"loanCardFields"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanBasic"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"distributionModel"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"borrowerCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"region"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"activity"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"sector"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"tags"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"whySpecial"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lenderRepaymentTerm"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"minNoteSize"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"reservedAmount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isExpiringSoon"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"plannedExpirationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"matchingText"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"matchRatio"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isMatchable"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"simultaneousMatching"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"managedAccountId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"ratio"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"userProperties"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"favorited"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lentTo"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"anonymizationLevel"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fullLoanUse"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}]},{kind:"Field",name:{kind:"Name",value:"lenders"},arguments:[{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"IntValue",value:"0"}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanPartner"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"partnerName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"themes"},arguments:[],directives:[]}]}},{kind:"InlineFragment",typeCondition:{kind:"NamedType",name:{kind:"Name",value:"LoanDirect"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"trusteeName"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:1006,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:e}}};export{i as _};
