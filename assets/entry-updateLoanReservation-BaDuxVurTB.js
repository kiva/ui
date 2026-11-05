const e=`mutation updateLoanReservation($loanId: Int!, $price: Money!, $basketId: String) {
	shop (basketId: $basketId) {
		id
		updateLoanReservation (loanReservation: {
			id: $loanId
			price: $price
		})
		{
			id
			price
		}
	}
}
`,i={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"updateLoanReservation"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"price"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Money"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"updateLoanReservation"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanReservation"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"loanId"}}},{kind:"ObjectField",name:{kind:"Name",value:"price"},value:{kind:"Variable",name:{kind:"Name",value:"price"}}}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:265,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:e}}};export{i as _};
