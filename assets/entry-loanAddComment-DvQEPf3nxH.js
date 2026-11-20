const e=`mutation commentOnLoan($id: Int!, $body: String) {
	loan(id: $id) {
		addComment(body: $body)
	}
}
`,n={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"commentOnLoan"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"body"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"addComment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"body"},value:{kind:"Variable",name:{kind:"Name",value:"body"}}}],directives:[]}]}}]}}],loc:{start:0,end:137,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:e}}};export{n as _};
