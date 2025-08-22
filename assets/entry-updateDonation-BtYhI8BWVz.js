const e=`mutation updateDonation($price: Money!, $isTip: Boolean!, $basketId: String) {
	shop (basketId: $basketId) {
		id
		updateDonation (donation: {
			price: $price,
			isTip: $isTip
		})
		{
			id
			price
			isTip
		}
	}
}
`,i={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"updateDonation"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"price"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Money"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"isTip"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"updateDonation"},arguments:[{kind:"Argument",name:{kind:"Name",value:"donation"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"price"},value:{kind:"Variable",name:{kind:"Name",value:"price"}}},{kind:"ObjectField",name:{kind:"Name",value:"isTip"},value:{kind:"Variable",name:{kind:"Name",value:"isTip"}}}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isTip"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:259,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:e}}};export{i as _};
