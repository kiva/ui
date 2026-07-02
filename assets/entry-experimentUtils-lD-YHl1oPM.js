import{a as m}from"./entry-settingsUtils-DyCLv7scRe.js";import{l as s}from"./entry-logReadQueryError-Codcl0QZ_g.js";const l=`fragment experimentVersion on Experiment {
	id
	version
}
`,o={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"experimentVersion"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Experiment"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}],loc:{start:0,end:96,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:l}}},u=`query experimentAssignment($id: String) {
	experiment(id: $id) @client {
		id
		version
	}
}
`,p={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentAssignment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"experiment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:131,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:u}}},c=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,k={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:c}}};function S(t,i){try{const e=t.readQuery({query:k,variables:{key:i}});return m(e,"general.uiExperimentSetting.value")??{}}catch(e){return s(e,`getExperimentSettingCached experimentSetting: ${i}`),{}}}function N(t,i,e,a,r,d=void 0){const n=t.readFragment({id:`Experiment:${a}`,fragment:o})??{};return n.version&&n.version!=="unassigned"&&i(e,r??a,n.version,d),n}export{p as _,o as a,S as g,N as t};
