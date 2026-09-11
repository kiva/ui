import{a as s}from"./entry-settingsUtils-CjCYT3055q.js";import{l as m}from"./entry-logReadQueryError-BL2yt7MPC5.js";const l=`fragment experimentVersion on Experiment {
	id
	version
}
`,o={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"experimentVersion"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Experiment"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}],loc:{start:0,end:96,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:l}}},c=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,u={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:c}}},k=`query experimentAssignment($id: String) {
	experiment(id: $id) @client {
		id
		version
	}
}
`,v={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentAssignment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"experiment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:131,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:k}}};function y(n,e){try{const i=n.readQuery({query:u,variables:{key:e}});return s(i,"general.uiExperimentSetting.value")??{}}catch(i){return m(i,`getExperimentSettingCached experimentSetting: ${e}`),{}}}function N(n,e,i,t,r,d=void 0){const a=n.readFragment({id:`Experiment:${t}`,fragment:o})??{};return a.version&&a.version!=="unassigned"&&e(i,r??t,a.version,d),a}const g=(n,e,i)=>{var t;(t=e==null?void 0:e.query)!=null&&t.setuiab&&(n.cache.evict({id:`Experiment:${i}`}),n.cache.gc())},f=(n,e,i)=>(g(n,e,i),n.query({query:v,variables:{id:i}}));export{v as _,o as a,y as g,f as q,N as t};
