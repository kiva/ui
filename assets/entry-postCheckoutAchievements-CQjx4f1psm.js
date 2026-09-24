const e=`query PostCheckoutAchievements($loanIds: [Int!]!) {
	postCheckoutAchievements(loanIds: $loanIds) {
		overallProgress {
			id
			achievementId
			preCheckoutTier
			postCheckoutTier
			contributingLoanIds
		}
	}
}
`,i={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"PostCheckoutAchievements"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"overallProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"postCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"contributingLoanIds"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:251,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:e}}};export{i as _};
