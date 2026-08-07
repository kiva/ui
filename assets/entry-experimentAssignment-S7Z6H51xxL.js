const e=`query experimentAssignment($id: String) {
	experiment(id: $id) @client {
		id
		version
	}
}
`,i={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentAssignment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"experiment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:131,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:e}}};export{i as _};
